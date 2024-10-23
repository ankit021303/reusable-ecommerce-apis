import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

// Defining the User Model.
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Full name is required",
        },
        len: {
          args: [2, 50],
          msg: "Full name must be between 2 and 50 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Must be a valid email address",
        },
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
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "Date is required" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: "Password must be at least 6 characters long",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: [["user", "admin"]], // Valid roles
      },
    },
    isActive: {
      type: DataTypes.INTEGER,
      defaultValue: 0, //True Status, ACTIVE
      allowNull: true,
      validate: {
        isIn: [[0, 1]],
      },
    },
  },
  {
    timestamps: true, 
    tableName: "users",
  }
);

export default User;
