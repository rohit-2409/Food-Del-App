import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= ADD FOOD ITEM =================
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const image_filename = req.file.filename;

    const food = new foodModel({
      name: req.body.name,
      price: req.body.price,
      image: image_filename,
      description: req.body.description,
      category: req.body.category,
      rating: req.body.rating ? Number(req.body.rating) : 0,
      reviews: req.body.reviews ? Number(req.body.reviews) : 0,
    });

    await food.save();

    res.status(201).json({
      success: true,
      message: "Food Added Successfully",
    });
  } catch (error) {
    console.error("Error in addFood:", error);
    res.status(500).json({
      success: false,
      message: "Error While Adding Food",
      error: error.message,
    });
  }
};

// ================= ALL FOOD LIST =================
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    return res.status(200).json({ 
      success: true, 
      data: foods 
    });
  } catch (error) {
    console.error("Error in listFood:", error);
    // 🎯 Make sure this says 'res', NOT 'response'
    return res.status(500).json({
      success: false,
      message: "Error While Fetching Food List",
      error: error.message,
    });
  }
};

// remove food items
const removeFood = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Food id is required"
            });
        }

        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        const imagePath = path.join(__dirname, "../uploads", food.image);
        await fs.promises.unlink(imagePath).catch(() => {});

        await foodModel.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Food Removed Successfully"
        });
    } catch (error) {
        console.error("Error in removeFood:", error);
        return res.status(500).json({
            success: false,
            message: "Error while removing food",
            error: error.message
        });
    }
};

// ================= EXPORT =================
export { addFood, listFood,removeFood};