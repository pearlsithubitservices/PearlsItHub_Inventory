const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    totalPurchases: { type: Number, default: 0 },
    lastPurchase: { type: Date },
    notes: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Customer", customerSchema);
