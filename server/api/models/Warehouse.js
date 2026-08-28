const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    manager: { type: String },
    contactNumber: { type: String },
    email: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    capacity: { type: Number }, // Total capacity in units
    currentOccupancy: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Maintenance"],
      default: "Active",
    },
    type: {
      type: String,
      enum: ["Main", "Regional", "Distribution", "Storage"],
    },
    operatingHours: {
      open: String,
      close: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Warehouse", warehouseSchema);
