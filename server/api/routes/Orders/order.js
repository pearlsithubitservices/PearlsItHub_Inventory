const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { getOrders, getOrder, createOrder, updateOrderStatus, deleteOrder } = require("../../controller/Orders/order");

router.use(protect);
router.get("/", getOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;