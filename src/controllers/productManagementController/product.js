// controllers/medicineController.js
import Medicine from "../../models/medicineModel.js";

// Create/Add Medicine As trhe product and add it to the Medicine Table (i.e. Product Table)
export const addMedicine = async (req, res) => {
  try {
    const { name, description, price, stockCount, expiryDate } = req.body;

    const newMedicine = await Medicine.create({
      name,
      description,
      price,
      stockCount,
      expiryDate,
    });

    return res.status(201).json({
      message: "Medicine added successfully.",
      medicine: newMedicine,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};


