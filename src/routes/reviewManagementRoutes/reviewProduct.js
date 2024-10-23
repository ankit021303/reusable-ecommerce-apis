import express from "express";
import { authenticateUserJWT } from "../../middleware/authenticateJWT.js";
import {
  addReview,
  updateReview,
} from "../../controllers/reviewManagementController/reviewProduct.js";

const router = express.Router();

// Route to add new Review
router.post("/add-product-review", authenticateUserJWT, addReview);

// To Update the Product Review
router.get("/update-product-review", authenticateUserJWT, updateReview);

export default router;
