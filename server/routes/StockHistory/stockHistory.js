const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { getStockHistory, getProductHistory, createStockAdjustment } = require("../../controller/StockHistory/stockHistory");

router.use(protect);
router.get("/", getStockHistory);
router.get("/product/:productId", getProductHistory);
router.post("/", createStockAdjustment);

module.exports = router;