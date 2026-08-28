const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { getProducts, getProductStats, getProductStock, getProduct, createProduct, updateProduct, deleteProduct } = require("../../controller/Products/product");

router.use(protect);
router.get("/", getProducts);
router.get("/stats/summary", getProductStats);
router.get("/stock/:id", getProductStock);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;