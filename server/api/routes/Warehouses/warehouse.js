const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { getWarehouses, getWarehouse, getWarehouseStock, createWarehouse, updateWarehouse, deleteWarehouse } = require("../../controller/Warehouses/warehouse");

router.use(protect);
router.get("/", getWarehouses);
router.get("/:id/stock", getWarehouseStock);
router.get("/:id", getWarehouse);
router.post("/", createWarehouse);
router.put("/:id", updateWarehouse);
router.delete("/:id", deleteWarehouse);

module.exports = router;