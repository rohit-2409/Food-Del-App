import basket_icon from './basket_icon.png'
import logo from './logo.png'
import header_img from './header_img.png'
import search_icon from './search_icon.png'
import menu_1 from './menu_1.png'
import menu_2 from './menu_2.png'
import menu_3 from './menu_3.png'
import menu_4 from './menu_4.png'
import menu_5 from './menu_5.png'
import menu_6 from './menu_6.png'
import menu_7 from './menu_7.png'
import menu_8 from './menu_8.png'

import food_1 from './food_1.png'
import food_2 from './food_2.png'
import food_3 from './food_3.png'
import food_4 from './food_4.png'
import food_5 from './food_5.png'
import food_6 from './food_6.png'
import food_7 from './food_7.png'
import food_8 from './food_8.png'
import food_9 from './food_9.png'
import food_10 from './food_10.png'
import food_11 from './food_11.png'
import food_12 from './food_12.png'
import food_13 from './food_13.png'
import food_14 from './food_14.png'
import food_15 from './food_15.png'
import food_16 from './food_16.png'
import food_17 from './food_17.png'
import food_18 from './food_18.png'
import food_19 from './food_19.png'
import food_20 from './food_20.png'
import food_21 from './food_21.png'
import food_22 from './food_22.png'
import food_23 from './food_23.png'
import food_24 from './food_24.png'
import food_25 from './food_25.png'
import food_26 from './food_26.png'
import food_27 from './food_27.png'
import food_28 from './food_28.png'
import food_29 from './food_29.png'
import food_30 from './food_30.png'
import food_31 from './food_31.png'
import food_32 from './food_32.png'

import add_icon_white from './add_icon_white.png'
import add_icon_green from './add_icon_green.png'
import remove_icon_red from './remove_icon_red.png'
import app_store from './app_store.png'
import play_store from './play_store.png'
import linkedin_icon from './linkedin_icon.png'
import facebook_icon from './facebook_icon.png'
import twitter_icon from './twitter_icon.png'
import cross_icon from './cross_icon.png'
import selector_icon from './selector_icon.png'
import rating_starts from './rating_starts.png'
import profile_icon from './profile_icon.png'
import bag_icon from './bag_icon.png'
import logout_icon from './logout_icon.png'
import parcel_icon from './parcel_icon.png'
import checked from './checked.png'
import un_checked from './un_checked.png'

export const assets = {
    logo,
    basket_icon,
    header_img,
    search_icon,
    rating_starts,
    add_icon_green,
    add_icon_white,
    remove_icon_red,
    app_store,
    play_store,
    linkedin_icon,
    facebook_icon,
    twitter_icon,
    cross_icon,
    selector_icon,
    profile_icon,
    logout_icon,
    bag_icon,
    parcel_icon,
    checked,
    un_checked
}

export const menu_list = [
    {
        menu_name: "Salad",
        menu_image: menu_1
    },
    {
        menu_name: "Rolls",
        menu_image: menu_2
    },
    {
        menu_name: "Deserts",
        menu_image: menu_3
    },
    {
        menu_name: "Sandwich",
        menu_image: menu_4
    },
    {
        menu_name: "Cake",
        menu_image: menu_5
    },
    {
        menu_name: "Pure Veg",
        menu_image: menu_6
    },
    {
        menu_name: "Pasta",
        menu_image: menu_7
    },
    {
        menu_name: "Noodles",
        menu_image: menu_8
    }
]

const food_list_raw = [
    // ── Salad (displayed price = stored × 10) ────────────────
    {
        _id: "1",
        name: "Greek salad",
        image: food_1,
        price: 17,   // ₹170
        description: "Fresh crispy greens with olives, feta cheese, tomatoes, and a zesty lemon-herb dressing.",
        category: "Salad"
    },
    {
        _id: "2",
        name: "Veg salad",
        image: food_2,
        price: 15,   // ₹150
        description: "A colourful mix of seasonal vegetables tossed in a light vinaigrette dressing.",
        category: "Salad"
    }, {
        _id: "3",
        name: "Clover Salad",
        image: food_3,
        price: 16,   // ₹160
        description: "Tender clover sprouts blended with garden vegetables and a tangy sesame dressing.",
        category: "Salad"
    }, {
        _id: "4",
        name: "Chicken Salad",
        image: food_4,
        price: 25,   // ₹250
        description: "Grilled chicken strips over crisp romaine with croutons and creamy caesar dressing.",
        category: "Salad"
    },
    // ── Rolls ─────────────────────────────────────────────────
    {
        _id: "5",
        name: "Lasagna Rolls",
        image: food_5,
        price: 20,   // ₹200
        description: "Classic Italian lasagna sheets rolled with rich meat sauce and melted mozzarella.",
        category: "Rolls"
    }, {
        _id: "6",
        name: "Peri Peri Rolls",
        image: food_6,
        price: 15,   // ₹150
        description: "Spicy peri peri chicken wrapped in a soft flour tortilla with fresh salsa.",
        category: "Rolls"
    }, {
        _id: "7",
        name: "Chicken Rolls",
        image: food_7,
        price: 22,   // ₹220
        description: "Tender grilled chicken with sautéed peppers and onions folded in a warm wrap.",
        category: "Rolls"
    }, {
        _id: "8",
        name: "Veg Rolls",
        image: food_8,
        price: 13,   // ₹130
        description: "Crispy vegetable filling wrapped in a whole-wheat tortilla — light and delicious.",
        category: "Rolls"
    },
    // ── Deserts ───────────────────────────────────────────────
    {
        _id: "9",
        name: "Ripple Ice Cream",
        image: food_9,
        price: 12,   // ₹120
        description: "Swirls of strawberry and vanilla ice cream rippled together for a fruity treat.",
        category: "Deserts"
    }, {
        _id: "10",
        name: "Fruit Ice Cream",
        image: food_10,
        price: 15,   // ₹150
        description: "Premium ice cream loaded with chunks of fresh seasonal fruits.",
        category: "Deserts"
    }, {
        _id: "11",
        name: "Jar Ice Cream",
        image: food_11,
        price: 11,   // ₹110
        description: "Layered ice cream dessert served in a mason jar — indulgent and fun.",
        category: "Deserts"
    }, {
        _id: "12",
        name: "Vanilla Ice Cream",
        image: food_12,
        price: 12,   // ₹120
        description: "Classic creamy vanilla ice cream made with real vanilla bean extract.",
        category: "Deserts"
    },
    // ── Sandwich ──────────────────────────────────────────────
    {
        _id: "13",
        name: "Chicken Sandwich",
        image: food_13,
        price: 18,   // ₹180
        description: "Crispy fried chicken fillet with lettuce, tomato and mayo on a toasted bun.",
        category: "Sandwich"
    },
    {
        _id: "14",
        name: "Vegan Sandwich",
        image: food_14,
        price: 15,   // ₹150
        description: "Plant-based patty with avocado, sprouts, and spicy hummus on multigrain bread.",
        category: "Sandwich"
    }, {
        _id: "15",
        name: "Grilled Sandwich",
        image: food_15,
        price: 17,   // ₹170
        description: "Golden-grilled sandwich stuffed with cheese, veggies, and herb butter.",
        category: "Sandwich"
    }, {
        _id: "16",
        name: "Bread Sandwich",
        image: food_16,
        price: 14,   // ₹140
        description: "Rustic artisan bread filled with premium deli meats, cheese, and pickles.",
        category: "Sandwich"
    },
    // ── Cake ──────────────────────────────────────────────────
    {
        _id: "17",
        name: "Cup Cake",
        image: food_17,
        price: 13,   // ₹130
        description: "Moist vanilla cupcake crowned with swirls of fluffy buttercream frosting.",
        category: "Cake"
    }, {
        _id: "18",
        name: "Vegan Cake",
        image: food_18,
        price: 17,   // ₹170
        description: "Egg-free, dairy-free chocolate cake that is moist, rich, and utterly indulgent.",
        category: "Cake"
    }, {
        _id: "19",
        name: "Butterscotch Cake",
        image: food_19,
        price: 25,   // ₹250
        description: "Layers of soft sponge soaked in butterscotch sauce and topped with caramel cream.",
        category: "Cake"
    }, {
        _id: "20",
        name: "Sliced Cake",
        image: food_20,
        price: 20,   // ₹200
        description: "A generous slice of our signature red velvet cake with cream cheese frosting.",
        category: "Cake"
    },
    // ── Pure Veg ──────────────────────────────────────────────
    {
        _id: "21",
        name: "Garlic Mushroom ",
        image: food_21,
        price: 20,   // ₹200
        description: "Sautéed button mushrooms in roasted garlic butter — a vegetarian favourite.",
        category: "Pure Veg"
    }, {
        _id: "22",
        name: "Fried Cauliflower",
        image: food_22,
        price: 16,   // ₹160
        description: "Crispy battered cauliflower florets seasoned with tangy chilli-lime spice blend.",
        category: "Pure Veg"
    }, {
        _id: "23",
        name: "Mix Veg Pulao",
        image: food_23,
        price: 14,   // ₹140
        description: "Fragrant basmati rice cooked with seasonal vegetables and whole spices.",
        category: "Pure Veg"
    }, {
        _id: "24",
        name: "Rice Zucchini",
        image: food_24,
        price: 13,   // ₹130
        description: "Light and healthy zucchini ribbons tossed with steamed rice and fresh herbs.",
        category: "Pure Veg"
    },
    // ── Pasta ─────────────────────────────────────────────────
    {
        _id: "25",
        name: "Cheese Pasta",
        image: food_25,
        price: 20,   // ₹200
        description: "Al-dente penne smothered in a velvety four-cheese sauce — ultimate comfort food.",
        category: "Pasta"
    },
    {
        _id: "26",
        name: "Tomato Pasta",
        image: food_26,
        price: 18,   // ₹180
        description: "Classic Italian pasta in a slow-cooked San Marzano tomato and basil marinara.",
        category: "Pasta"
    }, {
        _id: "27",
        name: "Creamy Pasta",
        image: food_27,
        price: 25,   // ₹250
        description: "Silky cream sauce pasta with sun-dried tomatoes, spinach, and parmesan.",
        category: "Pasta"
    }, {
        _id: "28",
        name: "Chicken Pasta",
        image: food_28,
        price: 32,   // ₹320
        description: "Grilled chicken breast tossed with penne in a rich pesto-cream sauce.",
        category: "Pasta"
    },
    // ── Noodles ───────────────────────────────────────────────
    {
        _id: "29",
        name: "Buttter Noodles",
        image: food_29,
        price: 18,   // ₹180
        description: "Wok-tossed egg noodles in a rich garlic butter sauce — simple and satisfying.",
        category: "Noodles"
    }, {
        _id: "30",
        name: "Veg Noodles",
        image: food_30,
        price: 13,   // ₹130
        description: "Stir-fried noodles packed with crunchy vegetables in a savory soy-ginger sauce.",
        category: "Noodles"
    }, {
        _id: "31",
        name: "Somen Noodles",
        image: food_31,
        price: 21,   // ₹210
        description: "Thin Japanese somen noodles served in a light dashi broth with fresh toppings.",
        category: "Noodles"
    }, {
        _id: "32",
        name: "Cooked Noodles",
        image: food_32,
        price: 15,   // ₹150
        description: "Hearty noodles slow-cooked with a blend of Asian spices and fresh aromatics.",
        category: "Noodles"
    }
]

export const food_list = food_list_raw.map(item => ({
    ...item,
    _id: `65ca77a06c59b2e0431b${String(item._id).padStart(4, '0')}`
}));
