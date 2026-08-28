const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  receivedQuantity: { type: Number, default: 0 },
  batchNumber: { type: String },
  expiryDate: { type: Date },
});

const purchaseSchema = new mongoose.Schema(
  {
    purchaseOrderNumber: { type: String, required: true, unique: true },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    orderDate: { type: Date, required: true, default: Date.now },
    expectedDeliveryDate: { type: Date },
    actualDeliveryDate: { type: Date },
    items: [purchaseItemSchema],
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "Draft",
        "Pending",
        "Approved",
        "Ordered",
        "Received",
        "Partially_Received",
        "Cancelled",
      ],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Partially_Paid", "Paid"],
      default: "Unpaid",
    },
    paidAmount: { type: Number, default: 0 },
    paymentMethod: { type: String },
    invoiceNumber: { type: String },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Purchase", purchaseSchema);
