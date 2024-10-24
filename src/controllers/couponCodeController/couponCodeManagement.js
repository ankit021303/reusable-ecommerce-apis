import CouponCode from "../../models/couponCodeModel.js";

// GET || Retrieve All Coupon Codes
export const getAllCouponCodes = async (req, res) => {
  try {
    const couponCodes = await CouponCode.findAll();

    res.status(200).json({
      message: "Coupon codes retrieved successfully",
      data: couponCodes,
    });
  } catch (error) {
    console.error("Error retrieving coupon codes:", error.message);
    res.status(500).json({
      errorMessage: "Unable to retrieve coupon codes",
      status: false,
    });
  }
};

// GET || Retrieve a Specific Coupon Code
export const getCouponCodeById = async (req, res) => {
  try {
    const { id } = req.params;
    const couponCode = await CouponCode.findByPk(id);

    if (!couponCode) {
      return res.status(404).json({
        message: "Coupon code not found",
        status: false,
      });
    }

    res.status(200).json({
      message: "Coupon code retrieved successfully",
      data: couponCode,
    });
  } catch (error) {
    console.error("Error retrieving coupon code:", error.message);
    res.status(500).json({
      errorMessage: "Unable to retrieve coupon code",
      status: false,
      code: 500,
    });
  }
};

// POST || Create a New Coupon Code
export const createCouponCode = async (req, res) => {
  try {
    const {
      code,
      description,
      discountPercentage,
      expiryDate,
      usageLimit,
    } = req.body;

    const { userId } = req.user;

    const newCouponCode = await CouponCode.create({
      code,
      description,
      discountPercentage,
      expiryDate,
      usageLimit,
      created_by: userId,
    });

    res.status(201).json({
      message: "Coupon code created successfully",
      data: newCouponCode,
    });
  } catch (error) {
    console.error("Error creating coupon code:", error.message);
    res.status(500).json({
      errorMessage: "Unable to create coupon code",
      status: false,
    });
  }
};

// PUT || Update a Coupon Code
export const updateCouponCode = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      discountPercentage,
      expiryDate,
      usageLimit,
      isActive,
    } = req.body;

    const { id: userId } = req.user;

    // Find the coupon code by ID
    const couponCode = await CouponCode.findByPk(id);

    if (!couponCode) {
      return res.status(404).json({
        message: "Coupon code not found",
        status: false,
      });
    }

    // Update the coupon code with provided fields
    await couponCode.update({
      code: code || couponCode.code, // Maintain existing value if not provided
      description: description || couponCode.description,
      discountPercentage: discountPercentage || couponCode.discountPercentage,
      expiryDate: expiryDate || couponCode.expiryDate,
      usageLimit: usageLimit || couponCode.usageLimit,
      // Ensure isActive is either 0 or 1, otherwise, keep the existing value
      isActive:
        typeof isActive === "number" && [0, 1].includes(isActive)
          ? isActive
          : couponCode.isActive,
      updated_by: userId,
    });

    res.status(200).json({
      message: `Coupon code updated successfully. The coupon is now ${
        isActive === 0 ? "Active" : "Inactive"
      }.`,
      data: couponCode,
    });
  } catch (error) {
    console.error("Error updating coupon code:", error.message);
    res.status(500).json({
      errorMessage: "Unable to update coupon code",
      status: false,
      code:500,
    });
  }
};

// DELETE || Delete a Coupon Code
export const deleteCouponCode = async (req, res) => {
  try {
    const { id } = req.params;

    const couponCode = await CouponCode.findByPk(id);

    if (!couponCode) {
      return res.status(404).json({
        message: "Coupon code not found",
        status: false,
      });
    }

    await couponCode.destroy();

    res.status(200).json({
      message: "Coupon code deleted successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error deleting coupon code:", error.message);
    res.status(500).json({
      errorMessage: "Unable to delete coupon code",
      status: false,
    });
  }
};
