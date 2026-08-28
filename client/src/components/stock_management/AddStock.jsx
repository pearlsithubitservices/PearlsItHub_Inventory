import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Save,
  Package,
  X,
} from "lucide-react";

const ACCENT = "#1e5fa5";
const ACCENT_2 = "#0a57c4";
const API_URL = "http://localhost:5000/api";

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[13px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5fa5]/30 focus:border-[#1e5fa5]/30 transition-all";

export default function AddStock({ onBack, onStockAdded }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(null);

  const [formData, setFormData] = useState({
    referenceNo: `STR-KN-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    status: "In Stock",
    sourceType: "",
    sourceDocument: "",
    expectedDeliveryDate: "",
    warehouse: "",
    storageLocation: "",
    user: "",
  });

  const [items, setItems] = useState([
    {
      product: null,
      productName: "",
      skuCode: "",
      unit: "",
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
      expiryDate: "",
    },
  ]);

  const [remarks, setRemarks] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [warehouseRes, productRes] = await Promise.all([
          fetch(`${API_URL}/warehouses`, { headers }),
          fetch(`${API_URL}/products?limit=100`, { headers }),
        ]);

        const warehouseData = await warehouseRes.json();
        const productData = await productRes.json();

        if (warehouseData.success)
          setWarehouses(warehouseData.warehouses || []);
        if (productData.success) setProducts(productData.products || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === "quantity" || field === "unitCost") {
        const qty =
          field === "quantity" ? Number(value) : updated[index].quantity;
        const cost =
          field === "unitCost" ? Number(value) : updated[index].unitCost;
        updated[index].totalCost = qty * cost;
      }
      return updated;
    });
  };

  const handleProductSelect = (index, product) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        product: product._id,
        productName: product.name,
        skuCode: product.sku || product.barcode || "",
        unit: product.unit || "Nos",
        unitCost: product.purchasePrice || product.cost || 0,
        totalCost:
          updated[index].quantity *
          (product.purchasePrice || product.cost || 0),
      };
      return updated;
    });
    setShowProductDropdown(null);
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product: null,
        productName: "",
        skuCode: "",
        unit: "",
        quantity: 1,
        unitCost: 0,
        totalCost: 0,
        expiryDate: "",
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const totalQuantity = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );
  const totalCost = items.reduce(
    (sum, item) => sum + (Number(item.totalCost) || 0),
    0,
  );

  const handleSave = async () => {
    if (!formData.warehouse) {
      alert("Please select a warehouse");
      return;
    }
    if (!formData.sourceType) {
      alert("Please select a source type");
      return;
    }
    if (items.every((item) => !item.product)) {
      alert("Please add at least one product");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/stock-entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...formData,
          items: items
            .filter((item) => item.product)
            .map((item) => ({
              product: item.product,
              quantity: Number(item.quantity),
              unitCost: Number(item.unitCost),
              expiryDate: item.expiryDate || null,
            })),
          totalQuantity,
          totalCost,
          remarks,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (onStockAdded) onStockAdded(data.stockEntry);
        onBack();
      } else {
        alert(data.message || "Failed to save stock entry");
      }
    } catch (err) {
      console.error("Failed to save stock entry:", err);
      alert("Failed to save stock entry");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e5fa5] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900">Add Stock</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-white text-[13px] font-semibold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${ACCENT_2} 0%, ${ACCENT} 100%)`,
            }}
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save Stock"}
          </button>
        </div>
      </div>

      {/* Stock Information */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Package size={16} className="text-[#1e5fa5]" /> Stock Information
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Reference No" required>
            <input
              type="text"
              value={formData.referenceNo}
              onChange={(e) => handleFormChange("referenceNo", e.target.value)}
              className={inputCls}
              placeholder="STR-KN-000461"
            />
          </Field>
          <Field label="Date" required>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleFormChange("date", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Status" required>
            <select
              value={formData.status}
              onChange={(e) => handleFormChange("status", e.target.value)}
              className={inputCls}
            >
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </Field>
          <Field label="Source Type" required>
            <select
              value={formData.sourceType}
              onChange={(e) => handleFormChange("sourceType", e.target.value)}
              className={inputCls}
            >
              <option value="">Select source type</option>
              <option value="Purchase Order">Purchase Order</option>
              <option value="Return">Return</option>
              <option value="Transfer">Transfer</option>
              <option value="Adjustment">Adjustment</option>
            </select>
          </Field>
          <Field label="Source Document">
            <input
              type="text"
              value={formData.sourceDocument}
              onChange={(e) =>
                handleFormChange("sourceDocument", e.target.value)
              }
              className={inputCls}
              placeholder="Enter document"
            />
          </Field>
          <Field label="Expected Delivery Date">
            <input
              type="date"
              value={formData.expectedDeliveryDate}
              onChange={(e) =>
                handleFormChange("expectedDeliveryDate", e.target.value)
              }
              className={inputCls}
            />
          </Field>
          <Field label="Warehouse" required>
            <select
              value={formData.warehouse}
              onChange={(e) => handleFormChange("warehouse", e.target.value)}
              className={inputCls}
            >
              <option value="">Select warehouse</option>
              {warehouses.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Storage Location">
            <input
              type="text"
              value={formData.storageLocation}
              onChange={(e) =>
                handleFormChange("storageLocation", e.target.value)
              }
              className={inputCls}
              placeholder="Enter storage location"
            />
          </Field>
          <Field label="User">
            <input
              type="text"
              value={formData.user}
              onChange={(e) => handleFormChange("user", e.target.value)}
              className={inputCls}
              placeholder="Enter user name"
            />
          </Field>
        </div>
      </div>

      {/* Items Details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-slate-900">
            Items Details
          </h3>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#1e5fa5] text-[#1e5fa5] text-[12px] font-semibold hover:bg-[#1e5fa5]/5 transition-colors"
          >
            <Plus size={14} /> Add Items
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                  #
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                  Product Name
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                  SKU/Code
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                  Unit
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                  Quantity
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                  Unit Cost
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                  Total Cost
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                  Expiry Date
                </th>
                <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100">
                  <td className="px-3 py-2 text-[12px] font-semibold text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="px-3 py-2 relative">
                    <input
                      type="text"
                      value={item.productName}
                      onChange={(e) => {
                        handleItemChange(idx, "productName", e.target.value);
                        handleItemChange(idx, "product", null);
                        setShowProductDropdown(idx);
                      }}
                      onFocus={() => setShowProductDropdown(idx)}
                      className="w-full px-2 py-1.5 rounded border border-slate-200 text-[12px] focus:outline-none focus:ring-1 focus:ring-[#1e5fa5]/30"
                      placeholder="Search product..."
                    />
                    {showProductDropdown === idx && item.productName && (
                      <div className="absolute z-10 top-full left-0 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                        {products
                          .filter((p) =>
                            p.name
                              .toLowerCase()
                              .includes(item.productName.toLowerCase()),
                          )
                          .slice(0, 10)
                          .map((p) => (
                            <button
                              key={p._id}
                              onClick={() => handleProductSelect(idx, p)}
                              className="w-full px-3 py-2 text-left text-[12px] hover:bg-slate-50 flex items-center justify-between"
                            >
                              <span className="font-medium">{p.name}</span>
                              <span className="text-slate-400">
                                {p.sku || p.barcode || ""}
                              </span>
                            </button>
                          ))}
                        {products.filter((p) =>
                          p.name
                            .toLowerCase()
                            .includes(item.productName.toLowerCase()),
                        ).length === 0 && (
                          <div className="px-3 py-2 text-[12px] text-slate-400">
                            No products found
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.skuCode}
                      onChange={(e) =>
                        handleItemChange(idx, "skuCode", e.target.value)
                      }
                      className="w-full px-2 py-1.5 rounded border border-slate-200 text-[12px] focus:outline-none focus:ring-1 focus:ring-[#1e5fa5]/30"
                      placeholder="SKU"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) =>
                        handleItemChange(idx, "unit", e.target.value)
                      }
                      className="w-full px-2 py-1.5 rounded border border-slate-200 text-[12px] focus:outline-none focus:ring-1 focus:ring-[#1e5fa5]/30"
                      placeholder="Unit"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, "quantity", e.target.value)
                      }
                      className="w-full px-2 py-1.5 rounded border border-slate-200 text-[12px] focus:outline-none focus:ring-1 focus:ring-[#1e5fa5]/30"
                      min="1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.unitCost}
                      onChange={(e) =>
                        handleItemChange(idx, "unitCost", e.target.value)
                      }
                      className="w-full px-2 py-1.5 rounded border border-slate-200 text-[12px] focus:outline-none focus:ring-1 focus:ring-[#1e5fa5]/30"
                      min="0"
                    />
                  </td>
                  <td className="px-3 py-2 text-[12px] font-semibold text-slate-900">
                    ₹{item.totalCost.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={item.expiryDate}
                      onChange={(e) =>
                        handleItemChange(idx, "expiryDate", e.target.value)
                      }
                      className="w-full px-2 py-1.5 rounded border border-slate-200 text-[12px] focus:outline-none focus:ring-1 focus:ring-[#1e5fa5]/30"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => removeItem(idx)}
                      className="w-7 h-7 rounded bg-red-50 text-red-500 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors"
                      disabled={items.length === 1}
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex items-center justify-end gap-6 mt-4 pt-4 border-t border-slate-200">
          <div className="text-[12px] font-semibold text-slate-600">
            Total Items: <span className="text-slate-900">{items.length}</span>
          </div>
          <div className="text-[12px] font-semibold text-slate-600">
            Total Quantity:{" "}
            <span className="text-slate-900">{totalQuantity}</span>
          </div>
          <div className="text-[13px] font-bold text-slate-900">
            Total Cost:{" "}
            <span className="text-[#1e5fa5]">
              ₹{totalCost.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">
          Additional Information
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Remarks">
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className={`${inputCls} h-24 resize-none`}
              placeholder="Enter remarks..."
            />
          </Field>
          <Field label="Notes (Optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputCls} h-24 resize-none`}
              placeholder="Enter notes..."
            />
          </Field>
        </div>

        <Field label="Attachments (Optional)">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-[#1e5fa5]/50 transition-colors cursor-pointer">
            <Upload size={32} className="text-slate-400 mx-auto mb-2" />
            <p className="text-[13px] text-slate-500 font-medium">
              Drag & Drop or{" "}
              <span className="text-[#1e5fa5] font-semibold">Choose file</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              PNG, JPG, PDF (max 5MB)
            </p>
          </div>
        </Field>
      </div>
    </div>
  );
}
