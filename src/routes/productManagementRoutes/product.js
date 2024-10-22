import express from "express";
import { addMedicine } from "../../controllers/productManagementController/product.js";

const router = express.Router();

// Route to add new medicine
router.post("/add-medicine", addMedicine);

export default router;