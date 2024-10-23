import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../../config/sequelize.js";
import Order from "../../models/orderModel.js";
import OrderedProduct from "../../models/orderedProductModel.js";
import Medicine from "../../models/medicineModel.js";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// PLACE THE ORDER
// API to place the Order with Stripe Checkout Session
export const placeOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { shippingAddress, products } = req.body; // products: [{ medicineId, quantity }]
    const { id: userId } = req.user;

    if (!products || products.length === 0) {
      return res.status(400).json({
        message: "No products provided in the order.",
      });
    }

    // Calculate the total amount
    let totalAmount = 0;

    // Check if the medicines exist and calculate the total amount
    const orderedProducts = await Promise.all(
      products.map(async (product) => {
        if (!product.medicineId || !product.quantity) {
          throw new Error(
            `Invalid product data. Product ID and quantity are required.`
          );
        }

        const medicine = await Medicine.findByPk(product.medicineId);
        if (!medicine) {
          throw new Error(`Medicine with ID ${product.medicineId} not found.`);
        }

        // Check the stock
        if (medicine.stockCount < product.quantity) {
          throw new Error(
            `Insufficient stock for ${medicine.name}. Available stock: ${medicine.stockCount}`
          );
        }

        // Calculate the total amount of the product
        const productTotal = medicine.price * product.quantity;
        totalAmount += productTotal;

        // Returning the ordered product for insertion afterwards
        return {
          medicineId: product.medicineId,
          quantity: product.quantity,
          price: medicine.price,
        };
      })
    );

    // Generate a unique order number
    const orderNo = `ORD-${uuidv4()}`;

    // Create the new order with 'pending' payment and order status
    const newOrder = await Order.create(
      {
        orderNo,
        userId,
        totalAmount,
        shippingAddress,
        paymentStatus: "pending", // Initially set payment status to 'pending'
        orderStatus: "pending", // Order status as 'pending'
        created_by: userId,
        updated_by: userId,
      },
      { transaction }
    );

    // Ensure there are valid products to insert
    if (orderedProducts.length === 0) {
      throw new Error("No valid products to order.");
    }

    // Create ordered products
    const orderedProductRecords = orderedProducts.map((product) => ({
      orderId: newOrder.id,
      medicineId: product.medicineId,
      quantity: product.quantity,
      price: product.price,
    }));

    await OrderedProduct.bulkCreate(orderedProductRecords, { transaction });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orderedProducts.map((product) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Medicine ID: ${product.medicineId}`,
          },
          unit_amount: Math.round(product.price * 100), // price in paise
        },
        quantity: product.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.STRIPE_SUCCESS_PAYMENT}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.STRIPE_CANCEL_PAYMENT,
      metadata: {
        order_id: newOrder.id,
        user_id: userId,
      },
    });

    // Commit the transaction after creating the order and products
    await transaction.commit();

    return res.status(201).json({
      message: "Order placed successfully. Please complete the payment.",
      orderId: newOrder.id,
      checkoutUrl: session.url, // Return the checkout session URL
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error placing order:", error);
    return res.status(500).json({
      message: "Failed to place the order.",
      status: false,
      code: 500,
      error: error.message,
    });
  }
};

// API to confirm payment and update order/payment status
export const confirmPayment = async (req, res) => {
  const { session_id } = req.body;

  try {
    // Retrieve the session from Stripe using the session ID
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Check if the payment was successful
    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        message: "Payment not completed or failed.",
        status: false,
      });
    }

    // Retrieve the payment intent from the session
    const paymentIntentId = session.payment_intent;

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Retrieve the order ID from the session metadata
    const orderId = session.metadata.order_id;

    // Find the order by its ID
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Update the order's payment status to 'completed'
    order.paymentStatus = 'completed';
    // Set orderStatus to 'shipped' or another valid state as per your logic
    order.orderStatus = 'shipped'; // Use 'shipped' or any other valid status
    await order.save();

    // Update the stock count for the ordered medicines
    const orderedProducts = await OrderedProduct.findAll({
      where: { orderId },
    });

    await Promise.all(
      orderedProducts.map(async (orderedProduct) => {
        const medicine = await Medicine.findByPk(orderedProduct.medicineId);
        await medicine.update(
          { stockCount: medicine.stockCount - orderedProduct.quantity }
        );
      })
    );

    return res.status(200).json({
      message: "Payment confirmed and order updated successfully.",
      paymentIntent: paymentIntent,
      order: order,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return res.status(500).json({
      message: "Failed to confirm the payment and update order.",
      status: false,
      error: error.message,
    });
  }
};