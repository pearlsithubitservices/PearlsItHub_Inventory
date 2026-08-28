const Product = require("../../models/Product");
const WarehouseStock = require("../../models/WarehouseStock");
const { protect } = require("../../middleware/auth");

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      brand,
      stockStatus,
      page = 1,
      limit = 10,
    } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { barcode: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (status) query.status = status;
    if (brand) query.brand = brand;

    if (stockStatus === "In Stock") {
      query.currentStock = { $gt: 10 };
    } else if (stockStatus === "Low Stock") {
      query.currentStock = { $gt: 0, $lte: 10 };
    } else if (stockStatus === "Out of Stock") {
      query.currentStock = 0;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const pages = Math.ceil(total / limitNum);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductStats = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const active = await Product.countDocuments({ status: "active" });
    const inactive = await Product.countDocuments({ status: "inactive" });
    const outOfStock = await Product.countDocuments({ currentStock: 0 });
    const categories = await Product.distinct("category");
    res.json({
      success: true,
      stats: {
        total,
        active,
        inactive,
        outOfStock,
        categories: categories.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const warehouseStock = await WarehouseStock.find({
      product: req.params.id,
    }).populate("warehouse", "name location");

    res.json({ success: true, product, warehouseStock });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductStats,
  getProductStock,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
