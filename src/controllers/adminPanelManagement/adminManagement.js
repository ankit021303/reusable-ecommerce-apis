import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "../../models/adminModel.js";

dotenv.config();

// Controller to create Manager, Distributor, and Client by Admin
export const createAdminAccount = async (req, res) => {
  try {
    const { fullName, email, password, role, gender, contactNo } = req.body;

    // Check the email in the Admin table
    const existingAdmin = req.user;

    // Checking if the logged-in user is an admin
    if (existingAdmin.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Only admins can create accounts.",
      });
    }

    // Now Validate the role
    if (!["manager", "distributor", "client"].includes(role)) {
      return res.status(400).json({
        message:
          "Invalid role. Role must be either 'manager', 'distributor', or 'client'.",
      });
    }

    // Check if the email already exists
    const existingAdminMail = await Admin.findOne({ where: { email } });
    if (existingAdminMail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash the Password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS) || 10
    );

    // Create new Account in the Admin Table for the specified role other than Admin.
    const newAdmin = await Admin.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      gender,
      contactNo,
      created_by: existingAdmin.id,
    });

    return res.status(201).json({
      message: `${
        role.charAt(0).toUpperCase() + role.slice(1)
      } account created successfully.`,
      status: true,
      user: {
        id: newAdmin.id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Error during account creation:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};

// Controller to Get All Admin Data
export const getAllAdmins = async (req, res) => {
  try {
    // Check if the logged-in user is an admin
    const currentAdmin = req.user;
    if (currentAdmin.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Only admins can view all admin accounts.",
        status: false,
      });
    }

    // Fetch all admins from the Admin table with all fields
    const admins = await Admin.findAll();

    // Check if any data is found
    if (admins.length === 0) {
      return res.status(404).json({
        message: "No admin accounts found.",
        status: false,
      });
    }

    // Send the response with all admin data
    return res.status(200).json({
      message: "Admin accounts fetched successfully.",
      status: true,
      data: admins,
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return res.status(500).json({
      message: "Internal server error.",
      status: false,
    });
  }
};