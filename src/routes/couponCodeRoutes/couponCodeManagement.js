import express from "express";
import {
  getAllCouponCodes,
  getCouponCodeById,
  createCouponCode,
  updateCouponCode,
  deleteCouponCode,
} from "../../controllers/couponCodeController/couponCodeManagement.js";
import { authenticateJWT } from "../../middleware/authenticateJWT.js";

const router = express.Router();

// GET || Retrieve All Coupon Codes
router.get("/get-couponCodes", authenticateJWT, getAllCouponCodes);

// GET || Retrieve a Specific Coupon Code
router.get("/get-couponCodes/:id", authenticateJWT, getCouponCodeById);

// POST || Create a New Coupon Code
router.post("/add-couponCodes", authenticateJWT, createCouponCode);

// PUT || Update a Coupon Code
router.put("/update-coupon/:id", authenticateJWT, updateCouponCode);

// DELETE || Delete a Coupon Code
router.delete("/delete-coupon/:id", authenticateJWT, deleteCouponCode);

export default router;