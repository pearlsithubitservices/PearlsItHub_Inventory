const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Product Information
  name: { type: String, required: true },
  productId: { type: String },
  productType: { type: String },
  description: { type: String },
  barcode: { type: String },
  sellInPack: { type: String },
  warranty: { type: String },
  productExpiryDate: { type: Date },

  // Classification
  category: { type: String, required: true },
  subCategory: { type: String },
  brand: { type: String },
  hsnSacCode: { type: String },
  tagForProduct: { type: String },
  perishableProduct: { type: String, enum: ['Yes', 'No'] },
  weightInGm: { type: Number },
  mrp: { type: Number },
  sizeInCm: { type: String },
  purchasePrice: { type: Number },
  dateOfManufacture: { type: Date },
  mfgLicenseNumber: { type: String },

  // Pricing Information
  unit: { type: String },
  sellingPrice: { type: Number },
  taxRate: { type: Number },
  countryOfOrigin: { type: String },
  discount: { type: Number },

  // Inventory & Warehouse
  currentStock: { type: Number, default: 0 },
  reorderLevel: { type: Number },
  warehouseLocation: { type: String },
  shipmentTime: { type: String },
  warrantyInventory: { type: String },
  counterfeitProduct: { type: String },
  inventoryLocation: { type: String },
  batchNumber: { type: String },
  binLocation: { type: String },
  region: { type: String },

  // Supplier Information
  supplierName: { type: String },
  invoiceNumber: { type: String },
  lastDate: { type: Date },
  supplierLicenseNumber: { type: String },
  supplierContactNumber: { type: String },
  invoiceDate: { type: Date },
  batchId: { type: String },

  // Product Specifications
  manufacturer: { type: String },
  color: { type: String },
  country: { type: String },
  modelName: { type: String },
  material: { type: String },
  speciality: { type: String },
  tasteFragrance: { type: String },

  // Product Image
  imageUrl: { type: String },
  imagePublicId: { type: String },
  galleryImages: [{
    url: { type: String },
    publicId: { type: String },
  }],

  // Product Status
  publishOnStore: { type: Boolean, default: true },
  allowPurchase: { type: Boolean, default: true },
  allowSales: { type: Boolean, default: true },

  // Legacy fields (kept for backward compatibility)
  sku: { type: String, unique: true, sparse: true },
  price: { type: Number },
  cost: { type: Number },
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 5 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  image: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
