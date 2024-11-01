import { sequelize } from "../config/sequelize.js";
import dotenv from 'dotenv';

dotenv.config();

// Create Table on Importing the Models and sync the changes to the Table on running the code.
import "../models/userModel.js";
import "../models/adminModel.js";
import "../models/medicineModel.js";
import "../models/categoryModel.js";
import "../models/reviewModel.js";
import "../models/orderModel.js";
import "../models/orderedProductModel.js";
import "../models/couponCodeModel.js";

// Import the Assocuiation function.
import associateModels from "../models/associateModel.js";
associateModels();

// console.log("Check the Latest Code....");

// Connecting to the Database
const connectToDatabase = async() => {
  try {
    await sequelize.authenticate();
    console.log('Postgres Connection has been established successfully.');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default connectToDatabase;
