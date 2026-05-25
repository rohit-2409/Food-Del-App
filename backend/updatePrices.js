import mongoose from "mongoose";
import foodModel from "./models/foodmodel.js";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://rohitsingh9516415020_db_user:46545654@cluster0.4clnqer.mongodb.net/TOMATO-FOOD-DEL";

// Fair Indian restaurant/delivery prices (stored value, displayed as ×10 in app)
// Minimum ₹149 for most items, realistic premium tiers
const priceMap = {
  // Salad — ₹149 to ₹269
  "Greek salad":        17,   // ₹170
  "Veg salad":          15,   // ₹149 → stored 15 = ₹150
  "Clover Salad":       16,   // ₹160
  "Chicken Salad":      25,   // ₹250

  // Rolls — ₹129 to ₹229
  "Lasagna Rolls":      20,   // ₹199 → 20 = ₹200
  "Peri Peri Rolls":    15,   // ₹149 → 15 = ₹150
  "Chicken Rolls":      22,   // ₹220
  "Veg Rolls":          13,   // ₹129 → 13 = ₹130

  // Deserts — ₹99 to ₹179
  "Ripple Ice Cream":   12,   // ₹120
  "Fruit Ice Cream":    15,   // ₹149 → 15 = ₹150
  "Jar Ice Cream":      11,   // ₹110
  "Vanilla Ice Cream":  12,   // ₹120

  // Sandwich — ₹129 to ₹229
  "Chicken Sandwich":   18,   // ₹180
  "Vegan Sandwich":     15,   // ₹149 → 15 = ₹150
  "Grilled Sandwich":   17,   // ₹170
  "Bread Sandwich":     14,   // ₹140

  // Cake — ₹129 to ₹279
  "Cup Cake":           13,   // ₹129 → 13 = ₹130
  "Vegan Cake":         17,   // ₹170
  "Butterscotch Cake":  25,   // ₹249 → 25 = ₹250
  "Sliced Cake":        20,   // ₹199 → 20 = ₹200

  // Pure Veg — ₹129 to ₹219
  "Garlic Mushroom ":   18,   // ₹180
  "Garlic Mushroom":    18,
  "Fried Cauliflower":  16,   // ₹160
  "Mix Veg Pulao":      14,   // ₹140
  "Rice Zucchini":      13,   // ₹130

  // Pasta — ₹179 to ₹319
  "Cheese Pasta":       20,   // ₹199 → 20 = ₹200
  "Tomato Pasta":       18,   // ₹179 → 18 = ₹180
  "Creamy Pasta":       25,   // ₹249 → 25 = ₹250
  "Chicken Pasta":      32,   // ₹319 → 32 = ₹320

  // Noodles — ₹129 to ₹219
  "Buttter Noodles":    16,   // ₹160
  "Butter Noodles":     16,
  "Veg Noodles":        13,   // ₹130
  "Somen Noodles":      21,   // ₹210
  "Cooked Noodles":     17,   // ₹170
};

async function updatePrices() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected\n");

    const all = await foodModel.find({});
    let updated = 0;

    for (const item of all) {
      const newPrice = priceMap[item.name];
      if (newPrice !== undefined && item.price !== newPrice) {
        await foodModel.updateOne({ _id: item._id }, { price: newPrice });
        const old = `₹${item.price * 10}`;
        const neu = `₹${newPrice * 10}`;
        console.log(`💰  ${item.name.padEnd(24)} ${old.padStart(6)} → ${neu}`);
        updated++;
      }
    }

    if (updated === 0) {
      console.log("✅ All prices already up to date.");
    } else {
      console.log(`\n✅ Updated ${updated} prices.\n`);
    }

    // Print final price table
    const final = await foodModel.find({}).sort({ category: 1, name: 1 });
    let lastCat = "";
    console.log("\n📋 Final price sheet:\n");
    for (const item of final) {
      if (item.category !== lastCat) {
        lastCat = item.category;
        console.log(`  ── ${lastCat} ──`);
      }
      console.log(`     ${item.name.trim().padEnd(22)}  ₹${item.price * 10}`);
    }
    process.exit(0);
  } catch (e) {
    console.error("❌", e.message);
    process.exit(1);
  }
}

updatePrices();
