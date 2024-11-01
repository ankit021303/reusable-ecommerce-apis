// import User from "../../models/userModel";
import Review from "../../models/reviewModel.js";
// import Medicine from "../../models/medicineModel";

// To add Review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const { id } = req.user;

    // Create a new review
    const newReview = await Review.create({
        userId: id, // Use `id` as userId
        productId,
        rating,
        comment,
        created_by: id,
        updated_by: id,
      });

    res.status(201).json({
      message: "Review added successfully!",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Internal server error" });
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
