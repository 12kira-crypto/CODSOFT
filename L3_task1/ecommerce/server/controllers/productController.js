const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
  const { category, minPrice, maxPrice, sort } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let query = Product.find(filter);

  if (sort === "price_asc") query = query.sort({ price: 1 });
  else if (sort === "price_desc") query = query.sort({ price: -1 });
  else if (sort === "rating") query = query.sort({ rating: -1 });
  else query = query.sort({ createdAt: -1 });

  const products = await query;
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
};

module.exports = { getAllProducts, getProductById };
