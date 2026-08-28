const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/Auth/auth'));
app.use('/api/products', require('./routes/Products/product'));
app.use('/api/upload', require('./routes/Upload/upload'));
app.use('/api/customers', require('./routes/Customers/customer'));
app.use('/api/orders', require('./routes/Orders/order'));
app.use('/api/suppliers', require('./routes/Suppliers/supplier'));
app.use('/api/dashboard', require('./routes/Dashboard/dashboard'));
app.use('/api/warehouses', require('./routes/Warehouses/warehouse'));
app.use('/api/purchases', require('./routes/Purchases/purchase'));
app.use('/api/stock-history', require('./routes/StockHistory/stockHistory'));
app.use('/api/stock-transfers', require('./routes/StockTransfers/stockTransfer'));
app.use('/api/stock-entries', require('./routes/StockEntries/stockEntry'));
app.use('/api/analytics', require('./routes/Analytics/analytics'));

app.get('/', (req, res) => {
  res.json({ message: 'Inventory & CRM API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
