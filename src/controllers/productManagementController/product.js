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

    // Check if a medicine with the same name already exists
    const existingMedicine = await Medicine.findOne({ where: { name } });
    if (existingMedicine) {
      return res.status(409).json({
        message: `Medicine with name "${name}" already exists.`,
      });
    }

    // Get the file paths of the uploaded images
    const imagePaths = req.files.map((file) => file.path);

    // Ensure categories is an array or empty if not provided
    const categoriesArray = Array.isArray(categories) ? categories : [categories];

    const newMedicine = await Medicine.create({
      name,
      description,
      price,
      stockCount,
      expiryDate,
      images: imagePaths,
      created_by: userId,
      updated_by: userId,
    });

    // Find or create categories (categories should be an array of category names)
    const categoryInstances = await Promise.all(
      categoriesArray.map(async (categoryName) => {
        const [category] = await Category.findOrCreate({
          where: { name: categoryName },
        });
        return category;
      })
    );


    // Associate the medicine with the found/created categories
    await newMedicine.addCategories(categoryInstances);

    // Fetch the categories associated with the medicine
    const medicineWithCategories = await Medicine.findByPk(newMedicine.id, {
      include: [{ model: Category, as: 'categories' }] 
    });

    return res.status(201).json({
      message: "Medicine added successfully with categories.",
      medicine: medicineWithCategories,
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
    const { id } = req.params; // Medicine ID from URL parameters
    const { name, description, price, stockCount, expiryDate, categories } = req.body;
    const { userId, role } = req.user; // Extract userId and role from the decoded token

    // Check if the user has the role of 'admin' or 'manager'
    if (role !== "admin" && role !== "manager") {
      return res.status(403).json({
        message: "Unauthorized, only admins or managers can update medicine.",
      });
    }

    // Find the existing medicine by its ID
    const medicine = await Medicine.findByPk(id);
    if (!medicine) {
      return res.status(404).json({
        message: `Medicine with id "${id}" not found.`,
      });
    }

    // Update the medicine details
    await medicine.update({
      name: name || medicine.name, // Update if provided, otherwise keep current value
      description: description || medicine.description,
      price: price || medicine.price,
      stockCount: stockCount || medicine.stockCount,
      expiryDate: expiryDate || medicine.expiryDate,
      updated_by: userId, // Update the updated_by field with the current user
    });

    // Handle images if provided
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => file.path);
      await medicine.update({ images: imagePaths });
    }

    // Ensure categories is an array or empty if not provided
    const categoriesArray = Array.isArray(categories) ? categories : [categories];

    // Find or create categories (categories should be an array of category names)
    if (categoriesArray.length > 0) {
      const categoryInstances = await Promise.all(
        categoriesArray.map(async (categoryName) => {
          const [category] = await Category.findOrCreate({
            where: { name: categoryName },
          });
          return category;
        })
      );

      // Update the categories associated with the medicine
      await medicine.setCategories(categoryInstances);
    }

    // Fetch the updated medicine along with its categories
    const updatedMedicineWithCategories = await Medicine.findByPk(medicine.id, {
      include: [{ model: Category, as: 'categories' }],
    });

    return res.status(200).json({
      message: "Medicine updated successfully.",
      medicine: updatedMedicineWithCategories,
    });
  } catch (error) {
    console.error("Error during medicine update:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
      code: 500,
    });
  }
};