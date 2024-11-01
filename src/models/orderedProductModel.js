import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";
import Medicine from "./medicineModel.js"; 
import Order from "./orderModel.js";

const OrderedProduct = sequelize.define(
  "OrderedProduct",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Orders",
        key: "id",
      },
      allowNull: false,
    },
    // Product Id
    medicineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "medicines",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

// OrderedProduct.associate = (models) => {
//   OrderedProduct.belongsTo(Order, { foreignKey: "orderId" });
//   OrderedProduct.belongsTo(Medicine, { foreignKey: "medicineId" });
// };

export default OrderedProduct;
