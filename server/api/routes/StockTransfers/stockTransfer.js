const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { getStockTransfers, getStockTransfer, createStockTransfer, shipTransfer, receiveTransfer, updateTransfer, approveTransfer, cancelTransfer } = require("../../controller/StockTransfers/stockTransfer");

router.use(protect);
router.get("/", getStockTransfers);
router.get("/:id", getStockTransfer);
router.post("/", createStockTransfer);
router.post("/:id/ship", shipTransfer);
router.post("/:id/receive", receiveTransfer);
router.put("/:id", updateTransfer);
router.post("/:id/approve", approveTransfer);
router.delete("/:id", cancelTransfer);

module.exports = router;