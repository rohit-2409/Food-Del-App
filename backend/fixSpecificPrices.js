import mongoose from "mongoose";
import foodModel from "./models/foodmodel.js";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://rohitsingh9516415020_db_user:46545654@cluster0.4clnqer.mongodb.net/TOMATO-FOOD-DEL";

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected\n");

  // Garlic Mushroom  → stored 20 → display ₹200
  const r1 = await foodModel.updateMany(
    { name: { $regex: /garlic mushroom/i } },
    { price: 20 }
  );

  // Butter Noodles / Buttter Noodles → stored 18 → display ₹180
  const r2 = await foodModel.updateMany(
    { name: { $regex: /butt+er.*noodles/i } },
    { price: 18 }
  );

  console.log(`🧄 Garlic Mushroom  → updated ${r1.modifiedCount} doc(s)  →  ₹${20*10}`);
  console.log(`🍜 Butter Noodles   → updated ${r2.modifiedCount} doc(s)  →  ₹${18*10}`);

  // Verify
  const items = await foodModel.find({
    name: { $in: [/garlic mushroom/i, /butt+er.*noodles/i] }
  }).lean();
  // Simpler: just find by regex via loop
  const all = await foodModel.find({}).lean();
  console.log("\n📋 Verification:");
  all.filter(i => /garlic mushroom/i.test(i.name) || /butt+er.*noodles/i.test(i.name))
     .forEach(i => console.log(`  ${i.name.padEnd(24)}  stored: ${i.price}  →  display: ₹${i.price * 10}`));

  process.exit(0);
}

run().catch(e => { console.error("❌", e.message); process.exit(1); });
