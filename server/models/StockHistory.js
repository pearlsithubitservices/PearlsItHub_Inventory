const mongoose = require("mongoose");

const stockHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
    transactionType: {
      type: String,
      required: true,
      enum: [
        "Purchase",
        "Sale",
        "Transfer",
        "Adjustment",
        "Return",
        "Damage",
        "Lost",
      ],
    },
    quantityChange: { type: Number, required: true }, // Positive for increase, negative for decrease
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    unitPrice: { type: Number },
    totalValue: { type: Number },
    reference: { type: String }, // Order ID, Transfer ID, etc.
    referenceModel: { type: String }, // 'Order', 'Transfer', etc.
    notes: { type: String },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    batchNumber: { type: String },
    expiryDate: { type: Date },
  },
  { timestamps: true },
);

// Index for faster queries
stockHistorySchema.index({ product: 1, createdAt: -1 });
stockHistorySchema.index({ warehouse: 1, createdAt: -1 });

module.exports = mongoose.model("StockHistory", stockHistorySchema);
