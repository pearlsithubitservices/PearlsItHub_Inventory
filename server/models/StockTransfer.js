const mongoose = require("mongoose");

const transferItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  receivedQuantity: { type: Number, default: 0 },
  batchNumber: { type: String },
});

const stockTransferSchema = new mongoose.Schema(
  {
    transferNumber: { type: String, required: true, unique: true },
    fromWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    toWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    items: [transferItemSchema],
    requestedDate: { type: Date, required: true, default: Date.now },
    shippedDate: { type: Date },
    receivedDate: { type: Date },
    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "In_Transit",
        "Received",
        "Partially_Received",
        "Cancelled",
      ],
      default: "Pending",
    },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    shippedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    shippingMethod: { type: String },
    trackingNumber: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("StockTransfer", stockTransferSchema);
