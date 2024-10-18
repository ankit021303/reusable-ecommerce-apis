import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middelware only to be used for Admin Panel User (i.e. Admin, Manager, Staff and Distributor)
export const authenticateJWT = (req, res, next) => {
  const authToken = req.headers.authorization?.split(" ")[1];

  if (!authToken) {
    // Token not provided, return an error
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

    req.user = decodedToken;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Token is invalid or secret key is incorrect
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
