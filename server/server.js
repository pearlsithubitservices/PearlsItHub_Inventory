const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./api/routes/Auth/auth"));
app.use("/api/products", require("./api/routes/Products/product"));
app.use("/api/upload", require("./api/routes/Upload/upload"));
app.use("/api/customers", require("./api/routes/Customers/customer"));
app.use("/api/orders", require("./api/routes/Orders/order"));
app.use("/api/suppliers", require("./api/routes/Suppliers/supplier"));
app.use("/api/dashboard", require("./api/routes/Dashboard/dashboard"));
app.use("/api/warehouses", require("./api/routes/Warehouses/warehouse"));
app.use("/api/purchases", require("./api/routes/Purchases/purchase"));
app.use(
  "/api/stock-history",
  require("./api/routes/StockHistory/stockHistory"),
);
app.use(
  "/api/stock-transfers",
  require("./api/routes/StockTransfers/stockTransfer"),
);
app.use("/api/stock-entries", require("./api/routes/StockEntries/stockEntry"));
app.use("/api/analytics", require("./api/routes/Analytics/analytics"));

app.get("/", (req, res) => {
  res.json({ message: "Inventory API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
