import express from "express";
import { authenticateUserJWT } from "../../middleware/authenticateJWT.js";
import { placeOrder } from "../../controllers/orderManagementController/order.js";

const router = express.Router();

// Route to add new Review
router.post("/place-order", authenticateUserJWT, placeOrder);

export default router;
