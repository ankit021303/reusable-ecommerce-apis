import express from "express";
import { authenticateJWT } from "../../middleware/authenticateJWT.js";
import {
  addMedicine,
  getMedicinesByCategory,
} from "../../controllers/productManagementController/product.js";
import upload from "../../middleware/multerStorage.js";

const router = express.Router();

// Route to add new medicine
router.post("/add-medicine", upload.array("images", 5), authenticateJWT, addMedicine);
// To Fetch Product(i.e.Medicines) by Category
router.get(
  "/get-medicines-by-category",
  authenticateJWT,
  getMedicinesByCategory
);

export default router;
