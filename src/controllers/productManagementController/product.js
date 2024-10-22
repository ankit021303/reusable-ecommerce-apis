import Medicine from "../../models/medicineModel.js";
import Category from "../../models/categoryModel.js";

// Create/Add Medicine As the product and store it in Medicine Table (i.e. Product Table)
export const addMedicine = async (req, res) => {
  try {
    const { name, description, price, stockCount, expiryDate, categories } =
      req.body;
    const { userId, role } = req.user; // Extract userId and role from the decoded token

    // Check if the user has the role of 'admin' or 'manager'
    if (role !== "admin" && role !== "manager") {
      return res
        .status(403)
        .json({
          message: "Unauthorized, only admins or managers can add medicine.",
        });
    }

    const newMedicine = await Medicine.create({
      name,
      description,
      price,
      stockCount,
      expiryDate,
      created_by: userId,
      updated_by: userId,
    });

    // Find or create categories (categories should be an array of category names)
    const categoryInstances = await Promise.all(
      categories.map(async (categoryName) => {
        const [category] = await Category.findOrCreate({
          where: { name: categoryName },
        });
        return category;
      })
    );

    // Associate the medicine with the found/created categories
    await newMedicine.addCategories(categoryInstances);

    return res.status(201).json({
      message: "Medicine added successfully with categories.",
      medicine: newMedicine,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

// Get/Fetch medicines by category name
export const getMedicinesByCategory = async (req, res) => {
  try {
    const { categoryName } = req.query;

    // Check if categoryName is provided
    if (!categoryName) {
      return res.status(400).json({
        message: "Bad Request: categoryName is required.",
        status: false,
        code: 400,
      });
    }

    const category = await Category.findOne({
      where: { name: categoryName },
      include: {
        model: Medicine,
        through: { attributes: [] }, // Exclude the join table from the result
      },
    });

    // If Category is not Found
    if (!category) {
      return res.status(404).json({ 
        message: "Category not found.",
        status: false,
        code:404
      });
    }

    return res.status(200).json({
      message: `Medicines in category: ${categoryName}`,
      medicines: category.medicines,
      status: true,
      code: 200,
    });
  } catch (error) {
    console.error("Error during sign-up:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
      code: 500,
    });
  }
};

// To Update the Product(i.e. Medicine)
export const updateMedicine = async (req, res) => {
  try {
  } catch (error) {}
};
