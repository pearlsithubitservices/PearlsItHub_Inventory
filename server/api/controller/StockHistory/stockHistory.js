const StockHistory = require("../../models/StockHistory");

const getStockHistory = async (req, res) => {
  try {
    const {
      product,
      warehouse,
      transactionType,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    let query = {};

    if (product) query.product = product;
    if (warehouse) query.warehouse = warehouse;
    if (transactionType) query.transactionType = transactionType;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await StockHistory.countDocuments(query);
    const history = await StockHistory.find(query)
      .populate('product', 'name sku imageUrl')
      .populate('warehouse', 'name location')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: history.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      history
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductHistory = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const history = await StockHistory.find({ product: req.params.productId })
      .populate('warehouse', 'name location')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStockAdjustment = async (req, res) => {
  try {
    const historyData = {
      ...req.body,
      performedBy: req.user._id
    };

    const history = await StockHistory.create(historyData);
    res.status(201).json({ success: true, history });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getStockHistory,
  getProductHistory,
  createStockAdjustment,
};
