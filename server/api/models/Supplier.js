const mongoose = require("mongoose");

const bankDetailSchema = new mongoose.Schema({
  bankName: { type: String },
  accountHolderName: { type: String },
  accountNumber: { type: String },
  ifscCode: { type: String },
  branch: { type: String },
  accountType: {
    type: String,
    enum: ["Current Account", "Savings Account"],
    default: "Current Account",
  },
});

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vendorCode: { type: String },
    company: { type: String },
    email: { type: String, sparse: true },
    phone: { type: String, required: true },
    contactPerson: { type: String },
    gstin: { type: String },
    address: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
    country: { type: String },
    paymentTerms: { type: String },
    paymentMode: { type: String },
    currency: { type: String, default: "INR" },
    creditLimit: { type: String },
    creditDays: { type: String },
    exchangeRate: { type: String, default: "1.00" },
    bankDetails: [bankDetailSchema],
    payable: { type: Number, default: 0 },
    notes: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Supplier", supplierSchema);
