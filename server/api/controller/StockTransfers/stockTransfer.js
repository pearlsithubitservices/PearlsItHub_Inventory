const StockTransfer = require("../../models/StockTransfer");
const WarehouseStock = require("../../models/WarehouseStock");
const StockHistory = require("../../models/StockHistory");

const getStockTransfers = async (req, res) => {
  try {
    const { status, fromWarehouse, toWarehouse, page = 1, limit = 10 } = req.query;
    let query = {};

    if (status) query.status = status;
    if (fromWarehouse) query.fromWarehouse = fromWarehouse;
    if (toWarehouse) query.toWarehouse = toWarehouse;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await StockTransfer.countDocuments(query);
    const transfers = await StockTransfer.find(query)
      .populate('fromWarehouse', 'name location')
      .populate('toWarehouse', 'name location')
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: transfers.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      transfers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStockTransfer = async (req, res) => {
  try {
    const transfer = await StockTransfer.findById(req.params.id)
      .populate('fromWarehouse')
      .populate('toWarehouse')
      .populate('items.product')
      .populate('requestedBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('shippedBy', 'name email')
      .populate('receivedBy', 'name email');

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }
    res.json({ success: true, transfer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStockTransfer = async (req, res) => {
  try {
    const transferData = { ...req.body, requestedBy: req.user._id };

    if (!transferData.transferNumber) {
      const count = await StockTransfer.countDocuments();
      transferData.transferNumber = `TR-${Date.now()}-${count + 1}`;
    }

    const transfer = await StockTransfer.create(transferData);
    res.status(201).json({ success: true, transfer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const shipTransfer = async (req, res) => {
  try {
    const transfer = await StockTransfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    if (transfer.status !== 'approved') {
      return res.status(400).json({ message: 'Transfer must be approved before shipping' });
    }

    const session = await StockTransfer.startSession();
    session.startTransaction();

    try {
      for (const item of transfer.items) {
        const warehouseStock = await WarehouseStock.findOne({
          product: item.product,
          warehouse: transfer.fromWarehouse
        });

        if (!warehouseStock || warehouseStock.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.product}`);
        }

        const previousStock = warehouseStock.quantity;
        warehouseStock.quantity -= item.quantity;
        await warehouseStock.save({ session });

        await StockHistory.create([{
          product: item.product,
          warehouse: transfer.fromWarehouse,
          transactionType: 'transfer',
          quantityChange: -item.quantity,
          previousStock,
          newStock: warehouseStock.quantity,
          reference: transfer._id,
          referenceModel: 'StockTransfer',
          performedBy: req.user._id,
          notes: `Transfer to ${transfer.toWarehouse}`
        }], { session });
      }

      transfer.status = 'in_transit';
      transfer.shippedDate = new Date();
      transfer.shippedBy = req.user._id;
      if (req.body.trackingNumber) transfer.trackingNumber = req.body.trackingNumber;

      await transfer.save({ session });
      await session.commitTransaction();

      res.json({ success: true, transfer });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const receiveTransfer = async (req, res) => {
  try {
    const { items } = req.body;
    const transfer = await StockTransfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    if (transfer.status !== 'in_transit') {
      return res.status(400).json({ message: 'Transfer must be in transit to receive' });
    }

    const session = await StockTransfer.startSession();
    session.startTransaction();

    try {
      for (const receivedItem of items) {
        const transferItem = transfer.items.find(
          item => item.product.toString() === receivedItem.productId
        );

        if (!transferItem) continue;

        const receivedQty = receivedItem.receivedQuantity;
        transferItem.receivedQuantity += receivedQty;

        let warehouseStock = await WarehouseStock.findOne({
          product: receivedItem.productId,
          warehouse: transfer.toWarehouse
        });

        const previousStock = warehouseStock ? warehouseStock.quantity : 0;

        if (warehouseStock) {
          warehouseStock.quantity += receivedQty;
          await warehouseStock.save({ session });
        } else {
          await WarehouseStock.create([{
            product: receivedItem.productId,
            warehouse: transfer.toWarehouse,
            quantity: receivedQty
          }], { session });
        }

        await StockHistory.create([{
          product: receivedItem.productId,
          warehouse: transfer.toWarehouse,
          transactionType: 'transfer',
          quantityChange: receivedQty,
          previousStock,
          newStock: previousStock + receivedQty,
          reference: transfer._id,
          referenceModel: 'StockTransfer',
          performedBy: req.user._id,
          notes: `Transfer from ${transfer.fromWarehouse}`
        }], { session });
      }

      const allReceived = transfer.items.every(
        item => item.receivedQuantity >= item.quantity
      );

      transfer.status = allReceived ? 'received' : 'partially_received';
      if (allReceived) {
        transfer.receivedDate = new Date();
        transfer.receivedBy = req.user._id;
      }

      await transfer.save({ session });
      await session.commitTransaction();

      res.json({ success: true, transfer });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTransfer = async (req, res) => {
  try {
    const transfer = await StockTransfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    if (transfer.status !== 'pending') {
      return res.status(400).json({ message: 'Can only update pending transfers' });
    }

    Object.assign(transfer, req.body);
    await transfer.save();

    res.json({ success: true, transfer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const approveTransfer = async (req, res) => {
  try {
    const transfer = await StockTransfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    transfer.status = 'approved';
    transfer.approvedBy = req.user._id;
    await transfer.save();

    res.json({ success: true, transfer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelTransfer = async (req, res) => {
  try {
    const transfer = await StockTransfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    if (transfer.status === 'received' || transfer.status === 'in_transit') {
      return res.status(400).json({
        message: 'Cannot delete transfer that is in transit or received'
      });
    }

    transfer.status = 'cancelled';
    await transfer.save();

    res.json({ success: true, message: 'Transfer cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStockTransfers,
  getStockTransfer,
  createStockTransfer,
  shipTransfer,
  receiveTransfer,
  updateTransfer,
  approveTransfer,
  cancelTransfer,
};
