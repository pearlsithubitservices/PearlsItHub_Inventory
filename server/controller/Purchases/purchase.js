const Purchase = require("../../models/Purchase");
const Product = require("../../models/Product");
const WarehouseStock = require("../../models/WarehouseStock");
const StockHistory = require("../../models/StockHistory");

const getPurchases = async (req, res) => {
  try {
    const { status, supplier, warehouse, page = 1, limit = 10 } = req.query;
    let query = {};

    if (status) query.status = status;
    if (supplier) query.supplier = supplier;
    if (warehouse) query.warehouse = warehouse;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Purchase.countDocuments(query);
    const purchases = await Purchase.find(query)
      .populate('supplier', 'name contactPerson email')
      .populate('warehouse', 'name location')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: purchases.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      purchases
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate('supplier')
      .populate('warehouse')
      .populate('items.product')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email');

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json({ success: true, purchase });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPurchase = async (req, res) => {
  try {
    const purchaseData = { ...req.body, createdBy: req.user._id };

    if (!purchaseData.purchaseOrderNumber) {
      const count = await Purchase.countDocuments();
      purchaseData.purchaseOrderNumber = `PO-${Date.now()}-${count + 1}`;
    }

    const purchase = await Purchase.create(purchaseData);
    res.status(201).json({ success: true, purchase });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json({ success: true, purchase });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const receivePurchase = async (req, res) => {
  try {
    const { items } = req.body;
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    if (purchase.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot receive cancelled purchase' });
    }

    const session = await Purchase.startSession();
    session.startTransaction();

    try {
      for (const receivedItem of items) {
        const purchaseItem = purchase.items.find(
          item => item.product.toString() === receivedItem.productId
        );

        if (!purchaseItem) continue;

        const receivedQty = receivedItem.receivedQuantity;
        purchaseItem.receivedQuantity += receivedQty;

        if (receivedItem.batchNumber) purchaseItem.batchNumber = receivedItem.batchNumber;
        if (receivedItem.expiryDate) purchaseItem.expiryDate = receivedItem.expiryDate;

        let warehouseStock = await WarehouseStock.findOne({
          product: receivedItem.productId,
          warehouse: purchase.warehouse
        });

        const previousStock = warehouseStock ? warehouseStock.quantity : 0;

        if (warehouseStock) {
          warehouseStock.quantity += receivedQty;
          warehouseStock.lastRestocked = new Date();
          await warehouseStock.save({ session });
        } else {
          warehouseStock = await WarehouseStock.create([{
            product: receivedItem.productId,
            warehouse: purchase.warehouse,
            quantity: receivedQty,
            lastRestocked: new Date()
          }], { session });
        }

        await Product.findByIdAndUpdate(
          receivedItem.productId,
          { $inc: { currentStock: receivedQty } },
          { session }
        );

        await StockHistory.create([{
          product: receivedItem.productId,
          warehouse: purchase.warehouse,
          transactionType: 'purchase',
          quantityChange: receivedQty,
          previousStock,
          newStock: previousStock + receivedQty,
          unitPrice: purchaseItem.unitPrice,
          totalValue: purchaseItem.unitPrice * receivedQty,
          reference: purchase._id,
          referenceModel: 'Purchase',
          performedBy: req.user._id,
          batchNumber: receivedItem.batchNumber
        }], { session });
      }

      const allReceived = purchase.items.every(
        item => item.receivedQuantity >= item.quantity
      );
      const partiallyReceived = purchase.items.some(
        item => item.receivedQuantity > 0
      );

      if (allReceived) {
        purchase.status = 'received';
        purchase.actualDeliveryDate = new Date();
      } else if (partiallyReceived) {
        purchase.status = 'partially_received';
      }

      await purchase.save({ session });
      await session.commitTransaction();

      res.json({ success: true, purchase });
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

const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    if (purchase.status === 'received' || purchase.status === 'partially_received') {
      return res.status(400).json({
        message: 'Cannot delete purchase with received stock'
      });
    }

    await purchase.deleteOne();
    res.json({ success: true, message: 'Purchase deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  receivePurchase,
  deletePurchase,
};
