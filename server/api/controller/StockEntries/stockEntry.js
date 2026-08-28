const StockEntry = require("../../models/StockEntry");
const Product = require("../../models/Product");
const WarehouseStock = require("../../models/WarehouseStock");
const StockHistory = require("../../models/StockHistory");
const Warehouse = require("../../models/Warehouse");

const getStockEntries = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { referenceNo: { $regex: search, $options: "i" } },
        { sourceDocument: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await StockEntry.countDocuments(query);
    const pages = Math.ceil(total / limitNum);
    const entries = await StockEntry.find(query)
      .populate("warehouse", "name location")
      .populate("items.product", "name sku")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: entries.length,
      total,
      page: pageNum,
      pages,
      entries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStockEntry = async (req, res) => {
  try {
    const entry = await StockEntry.findById(req.params.id)
      .populate("warehouse", "name location")
      .populate("items.product", "name sku");

    if (!entry) {
      return res.status(404).json({ success: false, message: "Stock entry not found" });
    }

    res.json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createStockEntry = async (req, res) => {
  try {
    const {
      referenceNo,
      date,
      status,
      sourceType,
      sourceDocument,
      expectedDeliveryDate,
      warehouse,
      storageLocation,
      user,
      items,
      remarks,
      notes,
    } = req.body;

    const warehouseExists = await Warehouse.findById(warehouse);
    if (!warehouseExists) {
      return res.status(400).json({ success: false, message: "Warehouse not found" });
    }

    let totalQuantity = 0;
    let totalCost = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product not found: ${item.productName}` });
      }

      const itemTotal = Number(item.quantity) * Number(item.unitCost);
      totalQuantity += Number(item.quantity);
      totalCost += itemTotal;

      processedItems.push({
        product: product._id,
        productName: product.name,
        skuCode: product.sku || product.barcode || "",
        unit: product.unit || item.unit || "Nos",
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
        totalCost: itemTotal,
        expiryDate: item.expiryDate || null,
      });

      await Product.findByIdAndUpdate(product._id, {
        $inc: { currentStock: Number(item.quantity) },
      });

      let warehouseStock = await WarehouseStock.findOne({
        product: product._id,
        warehouse: warehouse,
      });

      if (warehouseStock) {
        warehouseStock.quantity += Number(item.quantity);
        warehouseStock.lastRestocked = new Date();
        await warehouseStock.save();
      } else {
        warehouseStock = await WarehouseStock.create({
          product: product._id,
          warehouse: warehouse,
          quantity: Number(item.quantity),
          reorderLevel: product.reorderLevel || 10,
          binLocation: storageLocation || "",
        });
      }

      await StockHistory.create({
        product: product._id,
        warehouse: warehouse,
        transactionType: sourceType === "Purchase Order" ? "purchase" : sourceType.toLowerCase(),
        quantityChange: Number(item.quantity),
        previousStock: product.currentStock - Number(item.quantity),
        newStock: product.currentStock,
        unitPrice: Number(item.unitCost),
        totalValue: itemTotal,
        reference: referenceNo,
        notes: remarks || notes || "",
        performedBy: req.user?._id,
        expiryDate: item.expiryDate || null,
      });
    }

    const stockEntry = await StockEntry.create({
      referenceNo,
      date: date || new Date(),
      status,
      sourceType,
      sourceDocument,
      expectedDeliveryDate: expectedDeliveryDate || null,
      warehouse,
      storageLocation,
      user,
      items: processedItems,
      remarks,
      notes,
      totalQuantity,
      totalCost,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, stockEntry });
  } catch (error) {
    console.error("Error creating stock entry:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteStockEntry = async (req, res) => {
  try {
    const entry = await StockEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: "Stock entry not found" });
    }

    await entry.deleteOne();
    res.json({ success: true, message: "Stock entry deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStockEntries,
  getStockEntry,
  createStockEntry,
  deleteStockEntry,
};
