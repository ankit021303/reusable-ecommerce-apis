import Order from "./orderModel.js";
import OrderedProduct from "./orderedProductModel.js";
import User from "./userModel.js";
import Medicine from "./medicineModel.js";

const associateModels = () => {
  Order.hasMany(OrderedProduct, {
    foreignKey: "orderId",
    as: "orderedProducts",
  });

  OrderedProduct.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
  });

  OrderedProduct.belongsTo(Medicine, {
    foreignKey: "medicineId",
    as: "medicine",
  });

  Order.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });
};

export default associateModels;
