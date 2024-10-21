import express from "express";
import { createAdminAccount, getAllAdmins } from "../../controllers/adminPanelManagement/adminManagement.js";
import { authenticateJWT } from "../../middleware/authenticateJWT.js"; // Assuming you have a middleware for token verification

const router = express.Router();

// Route for admin to create Manager, Distributor, or Client
router.post("/create-master-account", authenticateJWT, createAdminAccount);

// Router to Get the Data from the Admin Table.
router.get("/get-master-detail", authenticateJWT, getAllAdmins);

// 

export default router;
