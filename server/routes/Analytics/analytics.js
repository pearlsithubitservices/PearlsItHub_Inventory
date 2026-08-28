const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { getStockOverview, getStockMovement, getLowStockAlerts, getPurchaseAnalytics, getInventoryValue } = require("../../controller/Analytics/analytics");

router.use(protect);
router.get("/stock-overview", getStockOverview);
router.get("/stock-movement", getStockMovement);
router.get("/low-stock-alerts", getLowStockAlerts);
router.get("/purchase-analytics", getPurchaseAnalytics);
router.get("/inventory-value", getInventoryValue);

module.exports = router;