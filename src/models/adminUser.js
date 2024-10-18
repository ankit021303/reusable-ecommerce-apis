import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

// Define the Super-Admin Model
const adminSchema = sequelize.define(
  "admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "manager", "distributor", "client"),
      allowNull: false,
      defaultValue: "client", // Assuming "client" is the default role
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        isIn: [[0, 1]],
      },
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "diverse"),
      allowNull: false,
      validate: {
        notNull: { msg: "Gender is required" },
        isIn: {
          args: [["male", "female", "diverse"]],
          msg: "Gender must be male, female, or diverse",
        },
      },
    },
    contactNo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Contact number is required" },
        is: { args: /^\d{12}$/, msg: "Invalid contact number format" },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default adminSchema;
