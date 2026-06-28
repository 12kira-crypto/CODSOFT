const Order = require("../models/Order");

const placeOrder = async (req, res) => {
  const { items, shippingAddress, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in the order." });
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    totalAmount,
  });

  res.status(201).json(order);
};

const getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product", "name image")
    .sort({ createdAt: -1 });
  res.json(orders);
};

module.exports = { placeOrder, getUserOrders };
