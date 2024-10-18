import express from "express";
import { registerAdmin, loginAdmin } from "../../controllers/adminAuthController/adminAuth.js";

const router = express.Router();

// Register a new admin
router.post("/master-register", registerAdmin);

// Login an admin
router.post("/master-login", loginAdmin);

export default router;