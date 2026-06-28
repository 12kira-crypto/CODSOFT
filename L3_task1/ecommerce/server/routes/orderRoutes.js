const express = require("express");
const { placeOrder, getUserOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/mine", protect, getUserOrders);

module.exports = router;
