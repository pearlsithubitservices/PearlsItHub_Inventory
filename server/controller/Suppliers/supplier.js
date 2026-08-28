const Supplier = require("../../models/Supplier");

const getSuppliers = async (req, res) => {
  try {
    const { search, status, gstin, page = 1, limit = 50 } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } }
      ];
    }

    if (gstin) {
      query.gstin = { $regex: gstin, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Supplier.countDocuments(query);
    const suppliers = await Supplier.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalVendors = await Supplier.countDocuments();
    const activeVendors = await Supplier.countDocuments({ status: 'active' });
    const inactiveVendors = await Supplier.countDocuments({ status: 'inactive' });
    const totalPayable = await Supplier.aggregate([
      { $group: { _id: null, total: { $sum: '$payable' } } }
    ]);

    res.json({
      success: true,
      count: suppliers.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      suppliers,
      stats: {
        totalVendors,
        activeVendors,
        inactiveVendors,
        totalPayables: totalPayable[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json({ success: true, supplier });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const supplierData = req.body;

    if (!supplierData.vendorCode) {
      const count = await Supplier.countDocuments();
      supplierData.vendorCode = `VEN-${String(count + 1).padStart(4, '0')}`;
    }

    const supplier = await Supplier.create(supplierData);
    res.status(201).json({ success: true, supplier });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    let supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, supplier });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    await supplier.deleteOne();
    res.json({ success: true, message: 'Supplier deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
