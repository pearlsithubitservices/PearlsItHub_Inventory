const Warehouse = require("../../models/Warehouse");
const WarehouseStock = require("../../models/WarehouseStock");

const getWarehouses = async (req, res) => {
  try {
    const { status, type } = req.query;
    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;

    const warehouses = await Warehouse.find(query).sort({ name: 1 });
    res.json({ success: true, warehouses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.json({ success: true, warehouse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWarehouseStock = async (req, res) => {
  try {
    const { page = 1, limit = 20, lowStock } = req.query;

    let query = { warehouse: req.params.id };
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$quantity', '$reorderLevel'] };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await WarehouseStock.countDocuments(query);
    const stock = await WarehouseStock.find(query)
      .populate('product', 'name sku category brand imageUrl')
      .skip(skip)
      .limit(limitNum)
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: stock.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      stock
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json({ success: true, warehouse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.json({ success: true, warehouse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    const stockCount = await WarehouseStock.countDocuments({ warehouse: req.params.id });
    if (stockCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete warehouse with existing stock. Transfer stock first.'
      });
    }

    await warehouse.deleteOne();
    res.json({ success: true, message: 'Warehouse deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWarehouses,
  getWarehouse,
  getWarehouseStock,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
