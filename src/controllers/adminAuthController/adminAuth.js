import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../../models/adminModel.js";

dotenv.config();

// Register Controller
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, gender, contactNo } = req.body;

    // Check if the email already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

    // Create a new Admin
    const newAdmin = await Admin.create({
      fullName,
      email,
      password: hashedPassword,
      gender,
      contactNo,
      role: "admin",
    });

    // Generating unique-identifier
    const uniqueIdentifier = CryptoJS.SHA256(
      `${newAdmin.id}-${Date.now()}-${Math.random()}`
    ).toString();

    // Generate JWT token for registered User
    const token = jwt.sign(
      {
        userId: newAdmin.id,
        email: newAdmin.email,
        fullName: newAdmin.fullName,
        role: newAdmin.role,
        unique_identifier: uniqueIdentifier,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN, // Token expires in 5 days
      }
    );

    return res.status(201).json({
      message: "Admin User registered successfully.",
      status: true,
      code: 201,
      token,
      user: {
        id: newAdmin.id,
        name: newAdmin.fullName,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Error during sign-up:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
      code: 500,
    });
  }
};

// Login Controller
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking the existence of emails in Admin Table.
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generating unique-identifier
    const uniqueIdentifier = CryptoJS.SHA256(
      `${admin.id}-${Date.now()}-${Math.random()}`
    ).toString();

    const token = jwt.sign(
      {
        userId: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        unique_identifier: uniqueIdentifier,
        role: admin.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(200).json({
      message: "User sign-in successfully.",
      status: true,
      code: 200,
      token,
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
