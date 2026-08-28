import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Trash } from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function AddOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    vendor: "",
    vendorEmail: "",
    vendorPhone: "",
    contactPerson: "",
    poDate: new Date().toISOString().split("T")[0],
    expectedDelivery: "",
    paymentTerms: "Net 30",
    shippingPreference: "Standard",
    currency: "INR",
    deliveryWarehouse: "Main Warehouse",
    deliveryPerson: "",
    deliveryContact: "",
    deliveryAddress: "",
    notes: "",
    termsAndConditions: "",
    shippingCost: 0,
  });

  const [orderItems, setOrderItems] = useState([
    { product: "", name: "", sku: "", unit: "Nos", quantity: "", rate: "", discount: "", taxRate: "", amount: 0 },
  ]);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchSuppliers();
    fetchWarehouses();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/suppliers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setSuppliers(data.suppliers || []);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/warehouses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setWarehouses(data.warehouses || []);
    } catch (err) {
      console.error("Failed to fetch warehouses:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (field === "quantity" || field === "rate" || field === "discount" || field === "taxRate") {
      const qty = parseFloat(updatedItems[index].quantity) || 0;
      const rate = parseFloat(updatedItems[index].rate) || 0;
      const discount = parseFloat(updatedItems[index].discount) || 0;
      const taxRate = parseFloat(updatedItems[index].taxRate) || 0;
      const subtotal = qty * rate - discount;
      const tax = subtotal * (taxRate / 100);
      updatedItems[index].amount = subtotal + tax;
    }

    if (field === "product") {
      const selectedProduct = products.find((p) => p._id === value);
      if (selectedProduct) {
        updatedItems[index].name = selectedProduct.name;
        updatedItems[index].sku = selectedProduct.sku;
        updatedItems[index].rate = selectedProduct.price || 0;
      }
    }

    setOrderItems(updatedItems);
  };

  const addItem = () => {
    setOrderItems([
      ...orderItems,
      { product: "", name: "", sku: "", unit: "Nos", quantity: "", rate: "", discount: "", taxRate: "", amount: 0 },
    ]);
  };

  const removeItem = (index) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const totalItems = orderItems.filter((item) => item.product || item.name).length;
    const totalQuantity = orderItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
    const subtotal = orderItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), 0);
    const totalDiscount = orderItems.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0);
    const totalTax = orderItems.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const discount = parseFloat(item.discount) || 0;
      const taxRate = parseFloat(item.taxRate) || 0;
      return sum + ((qty * rate - discount) * taxRate / 100);
    }, 0);
    const shippingCost = parseFloat(form.shippingCost) || 0;
    const grandTotal = subtotal - totalDiscount + totalTax + shippingCost;

    return { totalItems, totalQuantity, subtotal, totalDiscount, totalTax, shippingCost, grandTotal };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getToken();
      const totals = calculateTotals();

      const purchaseData = {
        supplier: form.vendor,
        warehouse: form.deliveryWarehouse,
        orderDate: form.poDate,
        expectedDeliveryDate: form.expectedDelivery,
        items: orderItems
          .filter((item) => item.product || item.name)
          .map((item) => ({
            product: item.product,
            quantity: parseFloat(item.quantity) || 0,
            unitPrice: parseFloat(item.rate) || 0,
            taxRate: parseFloat(item.taxRate) || 0,
            discount: parseFloat(item.discount) || 0,
            totalAmount: item.amount,
          })),
        subtotal: totals.subtotal,
        taxAmount: totals.totalTax,
        shippingCost: totals.shippingCost,
        totalAmount: totals.grandTotal,
        notes: form.notes,
        status: "pending",
      };

      const res = await fetch(`${API_URL}/purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(purchaseData),
      });

      const data = await res.json();

      if (data.success) {
        navigate("/purchase-orders");
      } else {
        alert(data.message || "Failed to create purchase order");
      }
    } catch (err) {
      console.error("Failed to create purchase order:", err);
      alert("Failed to create purchase order");
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-bold text-slate-900">Add Order</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/purchase-orders")}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-[12px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <X size={14} />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#1e5fa5] text-white text-[12px] font-semibold hover:bg-[#0a57c4] transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Order"}
          </button>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Vendor Information */}
        <div>
          <h3 className="text-[13px] font-bold text-slate-900 mb-4">
            Vendor Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <select
                name="vendor"
                value={form.vendor}
                onChange={handleFormChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Select vendor name</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                PO Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Auto-generated"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] bg-slate-50"
                disabled
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                PO Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="poDate"
                value={form.poDate}
                onChange={handleFormChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Contact Person
              </label>
              <input
                type="text"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleFormChange}
                placeholder="Enter contact person name"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Expected Delivery date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="expectedDelivery"
                value={form.expectedDelivery}
                onChange={handleFormChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Vendor Email
              </label>
              <input
                type="email"
                name="vendorEmail"
                value={form.vendorEmail}
                onChange={handleFormChange}
                placeholder="Email address"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Vendor phone
              </label>
              <input
                type="tel"
                name="vendorPhone"
                value={form.vendorPhone}
                onChange={handleFormChange}
                placeholder="Enter phone number"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Payment Terms <span className="text-red-500">*</span>
              </label>
              <select
                name="paymentTerms"
                value={form.paymentTerms}
                onChange={handleFormChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Shipping Preference <span className="text-red-500">*</span>
              </label>
              <select
                name="shippingPreference"
                value={form.shippingPreference}
                onChange={handleFormChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Standard">Standard</option>
                <option value="Express">Express</option>
                <option value="Overnight">Overnight</option>
              </select>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div>
          <h3 className="text-[13px] font-bold text-slate-900 mb-4">
            Delivery Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Delivery Warehouse <span className="text-red-500">*</span>
              </label>
              <select
                name="deliveryWarehouse"
                value={form.deliveryWarehouse}
                onChange={handleFormChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Select warehouse</option>
                {warehouses.map((w) => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="deliveryPerson"
                value={form.deliveryPerson}
                onChange={handleFormChange}
                placeholder="Enter contact person"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Contact Number
              </label>
              <input
                type="tel"
                name="deliveryContact"
                value={form.deliveryContact}
                onChange={handleFormChange}
                placeholder="Enter contact number"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="deliveryAddress"
                value={form.deliveryAddress}
                onChange={handleFormChange}
                placeholder="Enter your address"
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Items Details */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold text-slate-900">
              Items Details
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="px-3 py-1.5 rounded-lg bg-[#1e5fa5] text-white text-[11px] font-semibold hover:bg-[#0a57c4] transition-colors flex items-center gap-1"
            >
              <Plus size={12} />
              Add Item
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase w-8">#</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">Product</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">SKU</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">Unit</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">Quantity</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">Rate (₹)</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">Discount (₹)</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">Tax (%)</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">Amount (₹)</th>
                  <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-600 uppercase w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="px-3 py-2 text-[11px] text-slate-600">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={item.product}
                        onChange={(e) => handleItemChange(idx, "product", e.target.value)}
                        className="w-full px-2 py-1.5 rounded border border-slate-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                      >
                        <option value="">Select product</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={item.sku}
                        readOnly
                        placeholder="SKU"
                        className="w-full px-2 py-1.5 rounded border border-slate-200 text-[11px] bg-slate-50"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                        className="w-20 px-2 py-1.5 rounded border border-slate-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                        placeholder="0"
                        className="w-20 px-2 py-1.5 rounded border border-slate-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                        placeholder="0.00"
                        className="w-24 px-2 py-1.5 rounded border border-slate-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => handleItemChange(idx, "discount", e.target.value)}
                        placeholder="0"
                        className="w-20 px-2 py-1.5 rounded border border-slate-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.taxRate}
                        onChange={(e) => handleItemChange(idx, "taxRate", e.target.value)}
                        placeholder="0"
                        className="w-20 px-2 py-1.5 rounded border border-slate-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.amount.toFixed(2)}
                        readOnly
                        className="w-28 px-2 py-1.5 rounded border border-slate-200 text-[11px] bg-slate-50"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="w-6 h-6 rounded bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                      >
                        <Trash size={12} className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex items-center justify-end gap-8 mt-4 text-[12px]">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-600">TOTAL ITEMS: {totals.totalItems}</span>
              <span className="font-semibold text-slate-600">TOTAL QUANTITY: {totals.totalQuantity}</span>
              <span className="font-bold text-slate-900">TOTAL COST: ₹{totals.subtotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Additional Information */}
          <div>
            <h3 className="text-[13px] font-bold text-slate-900 mb-4">
              Additional Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                  Notes (Internal)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  placeholder="Enter your remarks..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                  Terms & Conditions
                </label>
                <textarea
                  name="termsAndConditions"
                  value={form.termsAndConditions}
                  onChange={handleFormChange}
                  placeholder="Enter Terms & Conditions..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                  Attachments (optional)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[12px] text-blue-600 font-semibold">Drag & Drop or Choose File</p>
                      <p className="text-[10px] text-slate-400 mt-1">Supported formats: JPEG, PNG, GIF, PDF, TXT, PPT, ZIP</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-[13px] font-bold text-slate-900 mb-4">
              Order Summary
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-600">Total Items</span>
                <span className="text-[12px] font-semibold text-slate-900">{totals.totalItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-600">Total Quantity</span>
                <span className="text-[12px] font-semibold text-slate-900">{totals.totalQuantity}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="text-[12px] text-slate-600">Sub Total (₹)</span>
                <span className="text-[12px] font-semibold text-slate-900">₹{totals.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-600">Discount (₹)</span>
                <span className="text-[12px] font-semibold text-slate-900">₹{totals.totalDiscount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-600">Tax (₹)</span>
                <span className="text-[12px] font-semibold text-slate-900">₹{totals.totalTax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-600">Shipping / Handling (₹)</span>
                <input
                  type="number"
                  name="shippingCost"
                  value={form.shippingCost}
                  onChange={handleFormChange}
                  placeholder="0.00"
                  className="w-20 px-2 py-1 rounded border border-slate-200 text-[11px] text-right focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex items-center justify-between border-t-2 border-slate-300 pt-3">
                <span className="text-[13px] font-bold text-slate-900">Grand Total</span>
                <span className="text-[14px] font-bold text-[#1e5fa5]">₹{totals.grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
