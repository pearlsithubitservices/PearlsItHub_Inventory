const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { getStockEntries, getStockEntry, createStockEntry, deleteStockEntry } = require("../../controller/StockEntries/stockEntry");

router.use(protect);
router.get("/", getStockEntries);
router.get("/:id", getStockEntry);
router.post("/", createStockEntry);
router.delete("/:id", deleteStockEntry);

module.exports = router;