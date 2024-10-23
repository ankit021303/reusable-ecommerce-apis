import express from "express";
import { signup, login } from "../../controllers/userController/userAuth.js";

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

export default router;