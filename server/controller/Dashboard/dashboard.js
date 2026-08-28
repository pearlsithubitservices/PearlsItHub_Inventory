const Product = require("../../models/Product");
const Customer = require("../../models/Customer");
const Order = require("../../models/Order");
const Supplier = require("../../models/Supplier");

const getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();
    const totalOrders = await Order.countDocuments();

    const lowStockProducts = await Product.countDocuments({
      $expr: { $lte: ['$stock', '$minStock'] }
    });
    const outOfStock = await Product.countDocuments({ stock: 0 });

    const ordersResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' }
        }
      }
    ]);

    const revenue = ordersResult.length > 0 ? ordersResult[0].totalRevenue : 0;
    const avgOrder = ordersResult.length > 0 ? ordersResult[0].avgOrderValue : 0;

    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: last30Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.total' }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 }
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, value: { $sum: '$total' } } }
    ]);

    const statusMap = {};
    ordersByStatus.forEach(s => {
      statusMap[s._id] = { count: s.count, value: s.value };
    });

    const recentOrdersList = await Order.find()
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalCustomers,
        totalSuppliers,
        totalOrders,
        lowStockProducts,
        outOfStock,
        revenue,
        avgOrderValue: avgOrder
      },
      chartData: {
        salesChart: recentOrders,
        topProducts,
        ordersByStatus: statusMap
      },
      recentOrders: recentOrdersList
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard };
