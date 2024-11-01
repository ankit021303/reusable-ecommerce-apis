import { DataTypes } from "sequelize";
import {sequelize} from "../config/sequelize.js"; 
import User from "./userModel.js";
import OrderedProduct from "./orderedProductModel.js";

const Order = sequelize.define(
  "Order",
  {
    orderNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Name of the User table
        key: "id",
      },
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
    orderStatus: {
      type: DataTypes.ENUM("pending", "shipped", "delivered", "cancelled"),
      defaultValue: "pending",
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "Orders", 
  }
);

// Set up associations
// Order.associate = () => {
//   Order.belongsTo(User, {
//     foreignKey: "userId",
//     as: "user",
//   });

//   // Order has many OrderedProducts as products
//   Order.hasMany(OrderedProduct, {
//     foreignKey: "orderId",
//     as: "products", 
//   });
// };

// // Order has many OrderedProducts as orderedProducts
// Order.hasMany(OrderedProduct, {
//   foreignKey: "orderId",
//   as: "orderedProducts", 
// });
// OrderedProduct.belongsTo(Order, {
//   foreignKey: "orderId",
// });

export default Order;
