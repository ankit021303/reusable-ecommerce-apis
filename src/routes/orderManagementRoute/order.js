import express from "express";
import { authenticateUserJWT } from "../../middleware/authenticateJWT.js";
import { placeOrder, confirmPayment } from "../../controllers/orderManagementController/order.js";

const router = express.Router();

// Route to add new Review
router.post("/place-order", authenticateUserJWT, placeOrder);

// Route to Handle Payment Confirmation
router.post("/confirm-payment", authenticateUserJWT, confirmPayment);

export default router;
