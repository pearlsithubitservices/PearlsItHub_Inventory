const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { getSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier } = require("../../controller/Suppliers/supplier");

router.use(protect);
router.get("/", getSuppliers);
router.get("/:id", getSupplier);
router.post("/", createSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;