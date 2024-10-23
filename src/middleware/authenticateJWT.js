import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Function for JWT authentication for both Master and Web User.
const authenticate = (req, res, next, isAdminPanel = false) => {
  const authToken = req.headers.authorization?.split(" ")[1];

  if (!authToken) {
    return res.status(401).json({
      error: "Authentication failed: No token provided.",
      status: false,
      code: 401,
      data: null,
    });
  }

  // Verify the JWT token
  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET_KEY);

    // Normalize the role to lowercase for consistency
    const userRole = decodedToken.role?.toLowerCase();

    // If isAdminPanel is true, restrict access to admin-related roles
    if (
      isAdminPanel &&
      !["admin", "manager", "staff", "distributor"].includes(userRole)
    ) {
      return res.status(403).json({
        error:
          "Authentication failed: Insufficient permissions for admin panel.",
        status: false,
        code: 403,
        data: null,
      });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        error: "Authentication failed: Invalid token.",
        status: false,
        sode: 403,
        data: null,
      });
    }
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Middleware for Admin Panel Users
export const authenticateJWT = (req, res, next) => {
  authenticate(req, res, next, true); // isAdminPanel = true
};

// Middleware for Web Users
export const authenticateUserJWT = (req, res, next) => {
  authenticate(req, res, next, false); // isAdminPanel = false
};
