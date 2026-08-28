const mongoose = require('mongoose');

const warehouseStockSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  quantity: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, default: 10 },
  maxStockLevel: { type: Number },
  binLocation: { type: String },
  aisle: { type: String },
  shelf: { type: String },
  lastRestocked: { type: Date },
  lastSold: { type: Date }
}, { timestamps: true });

// Compound index to ensure unique product-warehouse combination
warehouseStockSchema.index({ product: 1, warehouse: 1 }, { unique: true });

module.exports = mongoose.model('WarehouseStock', warehouseStockSchema);
