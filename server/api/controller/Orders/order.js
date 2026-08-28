const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Customer = require("../../models/Customer");

const getOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status) query.status = status;
    if (search) query.orderNumber = { $regex: search, $options: 'i' };
    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('items.product', 'sku image');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { customer, items, tax, discount, paymentMethod, notes } = req.body;
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      processedItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });
      product.stock -= item.quantity;
      await product.save();
    }

    const taxAmount = subtotal * (tax || 0) / 100;
    const discountAmount = subtotal * (discount || 0) / 100;
    const total = subtotal + taxAmount - discountAmount;

    const orderNumber = 'ORD-' + Date.now();

    const order = await Order.create({
      orderNumber,
      customer,
      items: processedItems,
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      total,
      paymentMethod,
      notes,
      status: 'confirmed'
    });

    const customerDoc = await Customer.findById(customer);
    if (customerDoc) {
      customerDoc.totalPurchases += total;
      customerDoc.lastPurchase = new Date();
      await customerDoc.save();
    }

    const populatedOrder = await Order.findById(order._id).populate('customer', 'name');
    res.status(201).json({ success: true, order: populatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status === 'cancelled' && status !== 'cancelled') {
      return res.status(400).json({ message: 'Cannot update cancelled order' });
    }
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }
    order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }
    await order.remove();
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
