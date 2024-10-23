import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";

// Helper to generate JWT token
const generateToken = (user) => {
  const payload = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "5d",
  });
};

// SignUp API
export const signup = async (req, res) => {
  const { fullName, email, password, gender, dob } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      gender,
      dob,
    });

    // Generate token
    const token = generateToken(newUser);

    return res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        userId: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        gender: newUser.gender,
        dob: newUser.dob,
        role: newUser.role,
        isActive: newUser.isActive,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
      code: 500,
    });
  }
};

// Login API
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate token
    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
