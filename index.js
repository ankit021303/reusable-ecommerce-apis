import express from "express";
import bodyParser from 'body-parser';
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Routes
// Admin Panel Routes
import authRoute from "./src/routes/adminAuthRoutes/auth.js";
import adminManagementRoutes from "./src/routes/adminPanelManagementRoute/adminManagement.js";
import productManagementRoutes from "./src/routes/productManagementRoutes/product.js";
import couponManagementRoutes from "./src/routes/couponCodeRoutes/couponCodeManagement.js";

// Web User Routes
import userAuthRoute from "./src/routes/userRoutes/userAuth.js";
import userReviewRoute from "./src/routes/reviewManagementRoutes/reviewProduct.js";
import userOrderRoute from "./src/routes/orderManagementRoute/order.js";

// Importing connection.js for developing the connection with the mySQL-DB.
import connectToDatabase from "./src/config/dbConfig.js";

dotenv.config();

const app = express();

// Middleware to parse incoming JSON
app.use(bodyParser.json());

const port  = process.env.PORT || 5001;

// For Ditectory Path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Streaming the logs to the file
const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
})

morgan.token('type', (req, res) => {
    return req.headers["Content-Type"];
  });
  
  // Initializing Middleware
  app.use(morgan(":method :url :status :res[content-length] - :response-time ms :date[web]:type,", {
    stream: accessLogStream,
  }));

app.use(express.json());

app.use(cors());

// Establish a database connection
const connection = await connectToDatabase();

app.get("/", (req, res) => {
    res.json("Helloooo MEDIC");
});

// ADMIN AUTH Routes
app.use("/api/admin/auth", authRoute );
// Admin Management Routes
app.use("/api/admin/members", adminManagementRoutes );
// Product(i.e. Medicine) Management Routes
app.use("/api/admin/manage-products", productManagementRoutes);
// Coupon Management Routes
app.use("/api/admin/manage-coupons", couponManagementRoutes)

// WEB USER AUTH Routes
app.use("/api/user/auth", userAuthRoute);
// User-Product-Review Routes
app.use("/api/user/review", userReviewRoute);
// User-Place Order Routes
app.use("/api/user", userOrderRoute);

app.listen(port, () => {
    console.log(`App is running on port http://localhost:${port}`);
});

export default connection;