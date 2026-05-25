import mongoose from "mongoose";
import foodModel from "./models/foodmodel.js";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://rohitsingh9516415020_db_user:46545654@cluster0.4clnqer.mongodb.net/TOMATO-FOOD-DEL";

// Map the correct image filename for each food name
const imageMap = {
  "Greek salad": "food_1.png",
  "Veg salad": "food_2.png",
  "Clover Salad": "food_3.png",
  "Chicken Salad": "food_4.png",
  "Lasagna Rolls": "food_5.png",
  "Peri Peri Rolls": "food_6.png",
  "Chicken Rolls": "food_7.png",
  "Veg Rolls": "food_8.png",
  "Ripple Ice Cream": "food_9.png",
  "Fruit Ice Cream": "food_10.png",
  "Jar Ice Cream": "food_11.png",
  "Vanilla Ice Cream": "food_12.png",
  "Chicken Sandwich": "food_13.png",
  "Vegan Sandwich": "food_14.png",
  "Grilled Sandwich": "food_15.png",
  "Bread Sandwich": "food_16.png",
  "Cup Cake": "food_17.png",
  "Vegan Cake": "food_18.png",
  "Butterscotch Cake": "food_19.png",
  "Sliced Cake": "food_20.png",
  "Garlic Mushroom ": "food_21.png",
  "Garlic Mushroom": "food_21.png",
  "Fried Cauliflower": "food_22.png",
  "Mix Veg Pulao": "food_23.png",
  "Rice Zucchini": "food_24.png",
  "Cheese Pasta": "food_25.png",
  "Tomato Pasta": "food_26.png",
  "Creamy Pasta": "food_27.png",
  "Chicken Pasta": "food_28.png",
  "Buttter Noodles": "food_29.png",
  "Butter Noodles": "food_29.png",
  "Veg Noodles": "food_30.png",
  "Somen Noodles": "food_31.png",
  "Cooked Noodles": "food_32.png",
};

async function fixImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected\n");

    const all = await foodModel.find({});
    let fixed = 0;

    for (const item of all) {
      const correctImg = imageMap[item.name];
      if (correctImg && item.image !== correctImg) {
        await foodModel.updateOne({ _id: item._id }, { image: correctImg });
        console.log(`🔧 Fixed: "${item.name}"  ${item.image}  →  ${correctImg}`);
        fixed++;
      }
    }

    console.log(`\n✅ Fixed ${fixed} image references.`);
    process.exit(0);
  } catch (e) {
    console.error("❌ Error:", e.message);
    process.exit(1);
  }
}

fixImages();
