import mongoose from "mongoose";
import foodModel from "./models/foodmodel.js";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://rohitsingh9516415020_db_user:46545654@cluster0.4clnqer.mongodb.net/TOMATO-FOOD-DEL";

// All 32 food items matching the frontend assets.js exactly
const foodItems = [
  // ── Salad (4 items) ──────────────────────────────────────
  {
    name: "Greek salad",
    image: "food_1.png",
    price: 120,
    description: "Fresh crispy greens with olives, feta cheese, tomatoes, and a zesty lemon-herb dressing.",
    category: "Salad",
    rating: 4.5,
    reviews: 120,
  },
  {
    name: "Veg salad",
    image: "food_2.png",
    price: 180,
    description: "A colourful mix of seasonal vegetables tossed in a light vinaigrette dressing.",
    category: "Salad",
    rating: 4.2,
    reviews: 95,
  },
  {
    name: "Clover Salad",
    image: "food_3.png",
    price: 160,
    description: "Tender clover sprouts blended with garden vegetables and a tangy sesame dressing.",
    category: "Salad",
    rating: 4.0,
    reviews: 80,
  },
  {
    name: "Chicken Salad",
    image: "food_4.png",
    price: 240,
    description: "Grilled chicken strips over crisp romaine with croutons and creamy caesar dressing.",
    category: "Salad",
    rating: 4.7,
    reviews: 200,
  },

  // ── Rolls (4 items) ──────────────────────────────────────
  {
    name: "Lasagna Rolls",
    image: "food_5.png",
    price: 140,
    description: "Classic Italian lasagna sheets rolled with rich meat sauce and melted mozzarella.",
    category: "Rolls",
    rating: 4.3,
    reviews: 110,
  },
  {
    name: "Peri Peri Rolls",
    image: "food_6.png",
    price: 120,
    description: "Spicy peri peri chicken wrapped in a soft flour tortilla with fresh salsa.",
    category: "Rolls",
    rating: 4.4,
    reviews: 150,
  },
  {
    name: "Chicken Rolls",
    image: "food_7.png",
    price: 200,
    description: "Tender grilled chicken with sautéed peppers and onions folded in a warm wrap.",
    category: "Rolls",
    rating: 4.6,
    reviews: 175,
  },
  {
    name: "Veg Rolls",
    image: "food_8.png",
    price: 150,
    description: "Crispy vegetable filling wrapped in a whole-wheat tortilla — light and delicious.",
    category: "Rolls",
    rating: 4.1,
    reviews: 90,
  },

  // ── Deserts (4 items) ─────────────────────────────────────
  {
    name: "Ripple Ice Cream",
    image: "food_9.png",
    price: 140,
    description: "Swirls of strawberry and vanilla ice cream rippled together for a fruity treat.",
    category: "Deserts",
    rating: 4.5,
    reviews: 130,
  },
  {
    name: "Fruit Ice Cream",
    image: "food_10.png",
    price: 220,
    description: "Premium ice cream loaded with chunks of fresh seasonal fruits.",
    category: "Deserts",
    rating: 4.8,
    reviews: 210,
  },
  {
    name: "Jar Ice Cream",
    image: "food_11.png",
    price: 100,
    description: "Layered ice cream dessert served in a mason jar — indulgent and fun.",
    category: "Deserts",
    rating: 4.3,
    reviews: 100,
  },
  {
    name: "Vanilla Ice Cream",
    image: "food_12.png",
    price: 120,
    description: "Classic creamy vanilla ice cream made with real vanilla bean extract.",
    category: "Deserts",
    rating: 4.4,
    reviews: 160,
  },

  // ── Sandwich (4 items) ────────────────────────────────────
  {
    name: "Chicken Sandwich",
    image: "food_13.png",
    price: 120,
    description: "Crispy fried chicken fillet with lettuce, tomato and mayo on a toasted bun.",
    category: "Sandwich",
    rating: 4.5,
    reviews: 140,
  },
  {
    name: "Vegan Sandwich",
    image: "food_14.png",
    price: 180,
    description: "Plant-based patty with avocado, sprouts, and spicy hummus on multigrain bread.",
    category: "Sandwich",
    rating: 4.2,
    reviews: 85,
  },
  {
    name: "Grilled Sandwich",
    image: "food_15.png",
    price: 160,
    description: "Golden-grilled sandwich stuffed with cheese, veggies, and herb butter.",
    category: "Sandwich",
    rating: 4.6,
    reviews: 190,
  },
  {
    name: "Bread Sandwich",
    image: "food_16.png",
    price: 240,
    description: "Rustic artisan bread filled with premium deli meats, cheese, and pickles.",
    category: "Sandwich",
    rating: 4.3,
    reviews: 110,
  },

  // ── Cake (4 items) ────────────────────────────────────────
  {
    name: "Cup Cake",
    image: "food_17.png",
    price: 140,
    description: "Moist vanilla cupcake crowned with swirls of fluffy buttercream frosting.",
    category: "Cake",
    rating: 4.7,
    reviews: 230,
  },
  {
    name: "Vegan Cake",
    image: "food_18.png",
    price: 120,
    description: "Egg-free, dairy-free chocolate cake that is moist, rich, and utterly indulgent.",
    category: "Cake",
    rating: 4.2,
    reviews: 75,
  },
  {
    name: "Butterscotch Cake",
    image: "food_19.png",
    price: 200,
    description: "Layers of soft sponge soaked in butterscotch sauce and topped with caramel cream.",
    category: "Cake",
    rating: 4.8,
    reviews: 265,
  },
  {
    name: "Sliced Cake",
    image: "food_20.png",
    price: 150,
    description: "A generous slice of our signature red velvet cake with cream cheese frosting.",
    category: "Cake",
    rating: 4.5,
    reviews: 180,
  },

  // ── Pure Veg (4 items) ────────────────────────────────────
  {
    name: "Garlic Mushroom",
    image: "food_21.png",
    price: 140,
    description: "Sautéed button mushrooms in roasted garlic butter — a vegetarian favourite.",
    category: "Pure Veg",
    rating: 4.4,
    reviews: 120,
  },
  {
    name: "Fried Cauliflower",
    image: "food_22.png",
    price: 220,
    description: "Crispy battered cauliflower florets seasoned with tangy chilli-lime spice blend.",
    category: "Pure Veg",
    rating: 4.3,
    reviews: 105,
  },
  {
    name: "Mix Veg Pulao",
    image: "food_23.png",
    price: 100,
    description: "Fragrant basmati rice cooked with seasonal vegetables and whole spices.",
    category: "Pure Veg",
    rating: 4.1,
    reviews: 90,
  },
  {
    name: "Rice Zucchini",
    image: "food_24.png",
    price: 120,
    description: "Light and healthy zucchini ribbons tossed with steamed rice and fresh herbs.",
    category: "Pure Veg",
    rating: 4.0,
    reviews: 70,
  },

  // ── Pasta (4 items) ───────────────────────────────────────
  {
    name: "Cheese Pasta",
    image: "food_25.png",
    price: 120,
    description: "Al-dente penne smothered in a velvety four-cheese sauce — ultimate comfort food.",
    category: "Pasta",
    rating: 4.6,
    reviews: 195,
  },
  {
    name: "Tomato Pasta",
    image: "food_26.png",
    price: 180,
    description: "Classic Italian pasta in a slow-cooked San Marzano tomato and basil marinara.",
    category: "Pasta",
    rating: 4.4,
    reviews: 150,
  },
  {
    name: "Creamy Pasta",
    image: "food_27.png",
    price: 160,
    description: "Silky cream sauce pasta with sun-dried tomatoes, spinach, and parmesan.",
    category: "Pasta",
    rating: 4.7,
    reviews: 220,
  },
  {
    name: "Chicken Pasta",
    image: "food_28.png",
    price: 240,
    description: "Grilled chicken breast tossed with penne in a rich pesto-cream sauce.",
    category: "Pasta",
    rating: 4.8,
    reviews: 280,
  },

  // ── Noodles (4 items) ─────────────────────────────────────
  {
    name: "Butter Noodles",
    image: "food_29.png",
    price: 140,
    description: "Wok-tossed egg noodles in a rich garlic butter sauce — simple and satisfying.",
    category: "Noodles",
    rating: 4.3,
    reviews: 115,
  },
  {
    name: "Veg Noodles",
    image: "food_30.png",
    price: 120,
    description: "Stir-fried noodles packed with crunchy vegetables in a savory soy-ginger sauce.",
    category: "Noodles",
    rating: 4.2,
    reviews: 100,
  },
  {
    name: "Somen Noodles",
    image: "food_31.png",
    price: 200,
    description: "Thin Japanese somen noodles served in a light dashi broth with fresh toppings.",
    category: "Noodles",
    rating: 4.5,
    reviews: 145,
  },
  {
    name: "Cooked Noodles",
    image: "food_32.png",
    price: 150,
    description: "Hearty noodles slow-cooked with a blend of Asian spices and fresh aromatics.",
    category: "Noodles",
    rating: 4.4,
    reviews: 130,
  },
];

async function seedDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Check existing items
    const existing = await foodModel.find({});
    console.log(`📦 Current items in DB: ${existing.length}`);

    // Get names already in DB
    const existingNames = new Set(existing.map((f) => f.name));

    // Filter only new items
    const newItems = foodItems.filter((item) => !existingNames.has(item.name));
    console.log(`➕ Items to add: ${newItems.length}`);

    if (newItems.length === 0) {
      console.log("\n🎉 All 32 food items are already in the database!");
    } else {
      await foodModel.insertMany(newItems);
      console.log(`\n✅ Successfully added ${newItems.length} new food items!`);

      const total = await foodModel.countDocuments();
      console.log(`📊 Total items in DB now: ${total}`);

      // Print summary by category
      const categories = {};
      foodItems.forEach((item) => {
        categories[item.category] = (categories[item.category] || 0) + 1;
      });
      console.log("\n📋 Category breakdown:");
      Object.entries(categories).forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} items`);
      });
    }

    console.log("\n🚀 Seed complete! Restart your backend server to see all items.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
}

seedDatabase();
