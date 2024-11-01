// import User from "../../models/userModel";
import OrderedProduct from "../../models/orderedProductModel.js";
import Order from "../../models/orderModel.js";
import Review from "../../models/reviewModel.js";
// import Medicine from "../../models/medicineModel";

// To add Review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const { id: userId } = req.user;

    // Check whether the user has placed an order fro the product
    const existingOrederedProduct = await OrderedProduct.findOne({
      where: {
        medicineId: productId, //medicineId is the column fro productId
      },
      include: [
        {
          model: Order,
          as: "order",
          where: {
            userId: userId,
          },
          attributes: [],
        },
      ],
    });

    if (!existingOrederedProduct) {
      return res.status(403).json({
        message: "You can only review products that you have purchased."
      });
    }


    // Create a new review
    const newReview = await Review.create({
        userId,
        productId,
        rating,
        comment,
        created_by: userId,
        updated_by: userId,
      });

    res.status(201).json({
      review: newReview,
      message: "Review added successfully!",
      status: true,
      code: 201,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ 
      message: "Internal server error",
      status: false,
      code: 500,
    });
  }
};

// To Update Review (Update Review)
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const { userId } = req.user; // assuming userId comes from the authenticated token

    const review = await Review.findOne({
      where: { id: reviewId, userId },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Update the review
    review.rating = rating;
    review.comment = comment;
    review.updated_by = userId; // Update `updated_by` with the current user
    await review.save();

    res.status(200).json({
      message: "Review updated successfully!",
      review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
