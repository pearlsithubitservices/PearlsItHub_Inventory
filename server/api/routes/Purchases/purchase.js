const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { getPurchases, getPurchase, createPurchase, updatePurchase, receivePurchase, deletePurchase } = require("../../controller/Purchases/purchase");

router.use(protect);
router.get("/", getPurchases);
router.get("/:id", getPurchase);
router.post("/", createPurchase);
router.put("/:id", updatePurchase);
router.post("/:id/receive", receivePurchase);
router.delete("/:id", deletePurchase);

module.exports = router;