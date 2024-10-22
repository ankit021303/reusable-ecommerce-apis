import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

// Define the Medicine (Product) Model
const Medicine = sequelize.define(
  "medicine",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Assuming each medicine has a unique name
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true, // Optional description of the medicine
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0, // Ensure price is not negative
      },
    },
    stockCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Initial stock is 0
      validate: {
        min: 0, // EStock shouldn't be 0
      },
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false, 
      validate: {
        isDate: true,
        isAfter: new Date().toString(), // Ensure expiry date should be in the future
      },
    },
  },
  {
    timestamps: true,
  }
);

export default Medicine;
