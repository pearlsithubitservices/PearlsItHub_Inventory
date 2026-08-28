const Product = require("../../models/Product");
const StockHistory = require("../../models/StockHistory");
const Purchase = require("../../models/Purchase");
const WarehouseStock = require("../../models/WarehouseStock");
const Warehouse = require("../../models/Warehouse");

const getStockOverview = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalStock = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$currentStock' } } }
    ]);

    const lowStockProducts = await Product.countDocuments({
      $expr: { $lte: ['$currentStock', '$reorderLevel'] }
    });

    const outOfStockProducts = await Product.countDocuments({ currentStock: 0 });

    const stockByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalStock: { $sum: '$currentStock' },
          productCount: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$currentStock', '$sellingPrice'] } }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    const stockByWarehouse = await WarehouseStock.aggregate([
      {
        $lookup: {
          from: 'warehouses',
          localField: 'warehouse',
          foreignField: '_id',
          as: 'warehouseInfo'
        }
      },
      { $unwind: '$warehouseInfo' },
      {
        $group: {
          _id: '$warehouse',
          name: { $first: '$warehouseInfo.name' },
          location: { $first: '$warehouseInfo.location' },
          totalStock: { $sum: '$quantity' },
          productCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      overview: {
        totalProducts,
        totalStock: totalStock[0]?.total || 0,
        lowStockProducts,
        outOfStockProducts,
        stockByCategory,
        stockByWarehouse
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStockMovement = async (req, res) => {
  try {
    const { startDate, endDate, productId, warehouseId } = req.query;

    let matchQuery = {};
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }
    if (productId) matchQuery.product = productId;
    if (warehouseId) matchQuery.warehouse = warehouseId;

    const movements = await StockHistory.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$transactionType'
          },
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantityChange' },
          totalValue: { $sum: '$totalValue' }
        }
      },
      { $sort: { '_id.date': -1 } }
    ]);

    const byTransactionType = await StockHistory.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$transactionType',
          count: { $sum: 1 },
          totalQuantity: { $sum: { $abs: '$quantityChange' } },
          totalValue: { $sum: { $abs: '$totalValue' } }
        }
      }
    ]);

    res.json({
      success: true,
      movements,
      byTransactionType
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLowStockAlerts = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$currentStock', '$reorderLevel'] }
    }).select('name sku currentStock reorderLevel category brand supplier')
      .populate('supplier', 'name contactPerson phone')
      .sort({ currentStock: 1 })
      .limit(50);

    res.json({ success: true, products: lowStockProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPurchaseAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let matchQuery = {};

    if (startDate || endDate) {
      matchQuery.orderDate = {};
      if (startDate) matchQuery.orderDate.$gte = new Date(startDate);
      if (endDate) matchQuery.orderDate.$lte = new Date(endDate);
    }

    const purchaseStats = await Purchase.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const topSuppliers = await Purchase.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$supplier',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' }
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: '_id',
          foreignField: '_id',
          as: 'supplierInfo'
        }
      },
      { $unwind: '$supplierInfo' },
      {
        $project: {
          _id: 1,
          name: '$supplierInfo.name',
          orderCount: 1,
          totalSpent: 1
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      purchaseStats,
      topSuppliers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInventoryValue = async (req, res) => {
  try {
    const inventoryValue = await Product.aggregate([
      {
        $project: {
          category: 1,
          brand: 1,
          totalValue: { $multiply: ['$currentStock', '$sellingPrice'] },
          costValue: { $multiply: ['$currentStock', '$purchasePrice'] }
        }
      },
      {
        $group: {
          _id: null,
          totalSellingValue: { $sum: '$totalValue' },
          totalCostValue: { $sum: '$costValue' },
          potentialProfit: { $sum: { $subtract: ['$totalValue', '$costValue'] } }
        }
      }
    ]);

    const valueByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalValue: { $sum: { $multiply: ['$currentStock', '$sellingPrice'] } },
          productCount: { $sum: 1 }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    res.json({
      success: true,
      inventoryValue: inventoryValue[0] || {},
      valueByCategory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStockOverview,
  getStockMovement,
  getLowStockAlerts,
  getPurchaseAnalytics,
  getInventoryValue,
};
