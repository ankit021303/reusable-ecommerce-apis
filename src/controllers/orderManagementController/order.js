import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../../config/sequelize.js";
import Order from "../../models/orderModel.js";
import OrderedProduct from "../../models/orderedProductModel.js";
import Medicine from "../../models/medicineModel.js";

// API to place the Order
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

        // Check the Stock
        if (medicine.stockCount < product.quantity) {
          throw new Error(
            `Insufficient stock for ${medicine.name}. Available stock: ${medicine.stockCount}`
          );
        }

        // CAlculate the Total Amount of the Product
        const productTotal = medicine.price * product.quantity;
        totalAmount += productTotal;

        // Returning the ordered product for insertion afterwwards
        return {
          medicineId: product.medicineId,
          quantity: product.quantity,
          price: medicine.price,
        };
      })
    );

    // Generate a unique order number
    const orderNo = `ORD-${uuidv4()}`;

    // Create the New Order
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

    // Update stock counts for the ordered medicines
    await Promise.all(
      products.map(async (product) => {
        const medicine = await Medicine.findByPk(product.medicineId);
        await medicine.update(
          { stockCount: medicine.stockCount - product.quantity },
          { transaction }
        );
      })
    );

    // Commit transaction after everything is successful
    await transaction.commit();

    return res.status(201).json({
      message: "Order placed successfully.",
      order: newOrder,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error placing order:", error);
    return res.status(500).json({
      message: "Failed to place the order.",
      error: error.message,
    });
  }
};
