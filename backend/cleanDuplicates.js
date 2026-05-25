import mongoose from "mongoose";
import foodModel from "./models/foodmodel.js";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://rohitsingh9516415020_db_user:46545654@cluster0.4clnqer.mongodb.net/TOMATO-FOOD-DEL";

// The canonical names that should be kept (matching frontend assets.js exactly)
const canonicalNames = new Set([
  "Greek salad", "Veg salad", "Clover Salad", "Chicken Salad",
  "Lasagna Rolls", "Peri Peri Rolls", "Chicken Rolls", "Veg Rolls",
  "Ripple Ice Cream", "Fruit Ice Cream", "Jar Ice Cream", "Vanilla Ice Cream",
  "Chicken Sandwich", "Vegan Sandwich", "Grilled Sandwich", "Bread Sandwich",
  "Cup Cake", "Vegan Cake", "Butterscotch Cake", "Sliced Cake",
  "Garlic Mushroom ", "Fried Cauliflower", "Mix Veg Pulao", "Rice Zucchini",
  "Cheese Pasta", "Tomato Pasta", "Creamy Pasta", "Chicken Pasta",
  "Buttter Noodles", "Veg Noodles", "Somen Noodles", "Cooked Noodles",
  // also seeded as:
  "Garlic Mushroom", "Butter Noodles"
]);

async function cleanDuplicates() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const all = await foodModel.find({});
    console.log(`📦 Total items before cleanup: ${all.length}`);

    const toDelete = [];
    for (const item of all) {
      if (!canonicalNames.has(item.name)) {
        toDelete.push(item);
        console.log(`🗑️  Will remove: "${item.name}" (id: ${item._id})`);
      }
    }

    if (toDelete.length === 0) {
      console.log("\n✅ No duplicates found — DB is clean!");
    } else {
      const ids = toDelete.map(i => i._id);
      await foodModel.deleteMany({ _id: { $in: ids } });
      console.log(`\n✅ Removed ${toDelete.length} duplicate/non-canonical items.`);
    }

    const remaining = await foodModel.countDocuments();
    console.log(`📊 Items remaining in DB: ${remaining}`);
    process.exit(0);
  } catch (e) {
    console.error("❌ Error:", e.message);
    process.exit(1);
  }
}

cleanDuplicates();
