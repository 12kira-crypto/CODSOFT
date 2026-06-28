require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  { name: "Wireless Headphones", description: "Premium noise-cancelling over-ear headphones with 30hr battery.", price: 79.99, category: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", stock: 15, rating: 4.5 },
  { name: "Mechanical Keyboard", description: "RGB backlit mechanical keyboard with tactile switches.", price: 49.99, category: "electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400", stock: 20, rating: 4.3 },
  { name: "Smartphone Stand", description: "Adjustable aluminum desk stand for phones and tablets.", price: 19.99, category: "electronics", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400", stock: 50, rating: 4.1 },
  { name: "Running Shoes", description: "Lightweight breathable shoes built for long-distance runs.", price: 64.99, category: "sports", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", stock: 30, rating: 4.6 },
  { name: "Yoga Mat", description: "Non-slip 6mm thick mat with carrying strap.", price: 24.99, category: "sports", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400", stock: 25, rating: 4.4 },
  { name: "Classic White T-Shirt", description: "100% cotton essential tee, available in all sizes.", price: 14.99, category: "clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", stock: 100, rating: 4.2 },
  { name: "Denim Jacket", description: "Vintage-wash denim jacket with button front.", price: 49.99, category: "clothing", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400", stock: 40, rating: 4.0 },
  { name: "Atomic Habits", description: "James Clear's guide to building good habits and breaking bad ones.", price: 12.99, category: "books", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", stock: 60, rating: 4.8 },
  { name: "The Pragmatic Programmer", description: "Classic software engineering book every developer should read.", price: 34.99, category: "books", image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400", stock: 35, rating: 4.7 },
  { name: "Desk Lamp", description: "LED lamp with adjustable brightness and USB charging port.", price: 29.99, category: "home", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400", stock: 45, rating: 4.3 },
  { name: "Scented Candle Set", description: "Set of 3 soy wax candles in lavender, vanilla, and cedar.", price: 18.99, category: "home", image: "https://images.unsplash.com/photo-1602607144772-8c149a4c6a4c?w=400", stock: 55, rating: 4.5 },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("✅ 11 products added to database!");
  process.exit();
};

seed().catch((err) => { console.error(err); process.exit(1); });