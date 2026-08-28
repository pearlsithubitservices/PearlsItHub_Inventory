const mongoose = require('mongoose');

const stockEntryItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  skuCode: { type: String },
  unit: { type: String },
  quantity: { type: Number, required: true },
  unitCost: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  expiryDate: { type: Date }
});

const stockEntrySchema = new mongoose.Schema({
  referenceNo: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
  sourceType: { type: String, enum: ['Purchase Order', 'Return', 'Transfer', 'Adjustment'], required: true },
  sourceDocument: { type: String },
  expectedDeliveryDate: { type: Date },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  storageLocation: { type: String },
  user: { type: String },
  items: [stockEntryItemSchema],
  remarks: { type: String },
  notes: { type: String },
  totalQuantity: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

stockEntrySchema.index({ referenceNo: 1 });
stockEntrySchema.index({ warehouse: 1, createdAt: -1 });

module.exports = mongoose.model('StockEntry', stockEntrySchema);
