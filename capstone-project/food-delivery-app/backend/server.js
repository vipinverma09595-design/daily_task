// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// =====================
// MongoDB Connection
// =====================
mongoose
  .connect("mongodb://127.0.0.1:27017/food-delivery-app")
  .then(async () => {
    console.log("MongoDB connected");

    // Seed database ONLY after connection
    await seedDatabase();
    await insertDummyData();
  })
  .catch((err) => {
    console.error("Error connecting to db", err);
  });

// =====================
// Schemas & Models
// =====================
const restaurantSchema = new mongoose.Schema({
  name: String,
  image: String,
  isVeg: Boolean,
  menu: [
    {
      name: String,
      price: Number,
      image: String,
      isVeg: Boolean,
    },
  ],
  rating: Number,
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

const previousOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  dateOfOrder: { type: Date, required: true },
  amount: { type: Number, required: true },
});

const PreviousOrder = mongoose.model("PreviousOrder", previousOrderSchema);

// =====================
// Seed Data
// =====================
const seedData = [
  {
    name: "Verma Ji Snacks",
    category: "Snacks",
    image: "/images/restaurants/snacks.jpg",
    rating: 4.4,
    menu: [
      {
        name: "Samosa",
        price: 20,
        image: "/images/dishes/samosa.jpg",
        isVeg: true
      },
      {
        name: "Kachori",
        price: 25,
        image: "/images/dishes/kachori.jpg",
        isVeg: true
      },
      {
        name: "Aloo Pakora",
        price: 30,
        image: "/images/dishes/pakora.jpg",
        isVeg: true
      },
    ],
  },
  {
    name: "Malwa Bhojanalaya",
    category: "malwa-thali",

    image: "/images/restaurants/malwa.jpg",
    rating: 4.6,
    menu: [
      {
        name: "Dal Bafla",
        price: 120,
        image: "/images/dishes/dal-bafla.jpg",
        isVeg: true
      },
      {
        name: "Kadhi Chawal",
        price: 90,
        image: "/images/dishes/kadhi-chawal.jpg",
        isVeg: true
      },
      {
        name: "Bhindi Masala",
        price: 80,
        image: "/images/dishes/bhindi.jpg",
        isVeg: true
      },
    ],
  },
  {
    name: "Punjabi Tadka",
    category: "punjabi-thali",

    image: "/images/restaurants/punjabi.jpg",
    rating: 4.5,
    menu: [
      {
        name: "Paneer Butter Masala",
        price: 160,
        image: "/images/dishes/paneer-butter-masala.jpg",
        isVeg: true
      },
      {
        name: "Butter Naan",
        price: 30,
        image: "/images/dishes/naan.jpg",
        isVeg: true
      },
      {
        name: "Dal Makhani",
        price: 140,
        image: "/images/dishes/dal-makhani.jpg",
        isVeg: true
      },
    ],
  },
  {
    name: "South Indian Express",
    category: "south-indian-food",

    image: "/images/restaurants/south.jpg",
    rating: 4.3,
    menu: [
      {
        name: "Masala Dosa",
        price: 100,
        image: "/images/dishes/masala-dosa.jpg",
        isVeg: true
      },
      {
        name: "Idli Sambhar",
        price: 70,
        image: "/images/dishes/idli.jpg",
        isVeg: true
      },
      {
        name: "Vada Sambhar",
        price: 80,
        image: "/images/dishes/vada.jpg",
        isVeg: true
      },
    ],
  },
  {
    name: "Biryani Adda",
    category: "biryani",
    image: "/images/restaurants/biryani.jpg",
    rating: 4.7,
    menu: [
      {
        name: "Chicken Biryani",
        price: 220,
        image: "/images/dishes/chicken-biryani.jpg",
         isVeg: false
      },
      {
        name: "Veg Biryani",
        price: 180,
        image: "/images/dishes/veg-biryani.jpg",
         isVeg: false
      },
      {
        name: "Raita",
        price: 40,
        image: "/images/dishes/raita.jpg",
         isVeg: true
      },
    ],
  },
];


// =====================
// Seed Functions
// =====================
const seedDatabase = async () => {
  try {
    await Restaurant.deleteMany();
    await Restaurant.insertMany(seedData);
    console.log("Restaurant data seeded");
  } catch (error) {
    console.error("Error seeding restaurants:", error.message);
  }
};

const insertDummyData = async () => {
  try {
    const existingOrders = await PreviousOrder.find();
    if (existingOrders.length === 0) {
      await PreviousOrder.insertMany([
        { orderId: "001", dateOfOrder: new Date(), amount: 30 },
        { orderId: "002", dateOfOrder: new Date(), amount: 45 },
      ]);
      console.log("Previous orders seeded");
    }
  } catch (error) {
    console.error("Error inserting orders:", error.message);
  }
};

// =====================
// Routes
// =====================
app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/previousOrders", async (req, res) => {
  try {
    const orders = await PreviousOrder.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/previousOrders", async (req, res) => {
  try {
    const { orderId, dateOfOrder, amount } = req.body;

    const newOrder = new PreviousOrder({
      orderId,
      dateOfOrder: new Date(dateOfOrder),
      amount,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// =====================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
