import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

// Define the Category Model
const Category = sequelize.define(
  "category",
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
      unique: true, // Category with unique name
    },
  },
  {
    timestamps: true,
  }
);

export default Category;
