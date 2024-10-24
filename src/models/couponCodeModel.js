import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const CouponCode = sequelize.define(
  "couponCode",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discountPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.INTEGER,
      defaultValue: 0, //True Status, ACTIVE
      allowNull: false,
      validate: {
        isIn: [[0, 1]],
      },
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "couponCodes",
  }
);

export default CouponCode;
