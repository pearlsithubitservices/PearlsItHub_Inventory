import { useState } from "react";
import {
  ArrowLeft,
  Printer,
  Edit3,
  Trash2,
  Box,
  Tag,
  Warehouse,
  FileText,
  Settings,
} from "lucide-react";
import ConfirmDialog from "../common/ConfirmDialog";

const API_URL = "http://localhost:5000/api/products";

const ACCENT = "#1e5fa5";
const ACCENT_2 = "#0a57c4";

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(10,37,64,0.04)] p-5">
    <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
      <Icon size={16} className="text-[#1e5fa5]" /> {title}
    </h3>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
    <span className="text-[13px] text-slate-500 font-medium">{label}</span>
    <span className="text-[13px] font-bold text-slate-800 text-right">
      {value || "-"}
    </span>
  </div>
);

const BadgeRow = ({ label, value, active }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
    <span className="text-[13px] text-slate-500 font-medium">{label}</span>
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
        active
          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
          : "bg-slate-100 text-slate-500 border border-slate-200"
      }`}
    >
      {value ? "Yes" : "No"}
    </span>
  </div>
);

const CategoryBadge = ({ category }) => {
  const colors = {
    Electronics: "bg-blue-50 text-blue-600 border border-blue-200",
    Furnitures: "bg-amber-50 text-amber-600 border border-amber-200",
    Accessories: "bg-purple-50 text-purple-600 border border-purple-200",
    Hardwares: "bg-red-50 text-red-600 border border-red-200",
    Clothing: "bg-pink-50 text-pink-600 border border-pink-200",
    Grocery: "bg-green-50 text-green-600 border border-green-200",
    "Spare Parts": "bg-orange-50 text-orange-600 border border-orange-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${colors[category] || "bg-slate-100 text-slate-600 border border-slate-200"}`}
    >
      {category}
    </span>
  );
};

const StatusBadge = ({ active }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
      active
        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
        : "bg-red-50 text-red-600 border border-red-200"
    }`}
  >
    {active ? "Active" : "Inactive"}
  </span>
);

export default function ProductDetailView({
  product,
  onBack,
  onEdit,
  onDelete,
}) {
  const p = product || {};
  const stock = p.currentStock ?? p.stock ?? 0;
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${p._id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json();
      if (data.success) {
        setShowConfirm(false);
        if (onDelete) onDelete(p._id);
        onBack();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const printProduct = () => {
    const html = `<!DOCTYPE html>
<html><head><title>${p.name || "Product"}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',-apple-system,sans-serif; padding:20px; color:#1e293b; background:#f8fafc; }
  h1 { font-size:20px; font-weight:800; color:#0f172a; margin-bottom:4px; }
  .sku { font-size:12px; color:#64748b; margin-bottom:16px; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .card { background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:16px; }
  .card h3 { font-size:14px; font-weight:700; color:#0f172a; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #f1f5f9; }
  .row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f8fafc; }
  .row:last-child { border-bottom:none; }
  .label { font-size:12px; color:#64748b; }
  .value { font-size:12px; font-weight:600; color:#0f172a; }
  .badge { display:inline-flex; padding:2px 8px; border-radius:9999px; font-size:10px; font-weight:600; }
  .badge-green { background:#ecfdf5; color:#059669; border:1px solid #a7f3d0; }
  .badge-slate { background:#f1f5f9; color:#64748b; border:1px solid #e2e8f0; }
  .status-row { display:flex; gap:24px; padding:12px 0; }
  .status-item { display:flex; align-items:center; gap:8px; }
  .status-label { font-size:12px; color:#64748b; }
  @media print { body { padding:10px; background:#fff; } .card { box-shadow:none; } }
</style></head><body>
<h1>${p.name || "Product"}</h1>
<p class="sku">SKU: ${p.sku || p.barcode || "-"}</p>
<div class="grid">
  <div>
    <div class="card"><h3>Product Information</h3>
      <div class="row"><span class="label">Product Name</span><span class="value">${p.name || "-"}</span></div>
      <div class="row"><span class="label">SKU / Code</span><span class="value">${p.sku || "-"}</span></div>
      <div class="row"><span class="label">Barcode</span><span class="value">${p.barcode || "-"}</span></div>
      <div class="row"><span class="label">HSN / SAC Code</span><span class="value">${p.hsnSacCode || "-"}</span></div>
    </div>
    <div class="card" style="margin-top:16px"><h3>Classification</h3>
      <div class="row"><span class="label">Category</span><span class="value">${p.category || "-"}</span></div>
      <div class="row"><span class="label">Subcategory</span><span class="value">${p.subCategory || "-"}</span></div>
      <div class="row"><span class="label">Brand</span><span class="value">${p.brand || "-"}</span></div>
      <div class="row"><span class="label">Unit of Measurement</span><span class="value">${p.unit || "-"}</span></div>
      <div class="row"><span class="label">Tax Rate(%)</span><span class="value">${p.taxRate ? p.taxRate + "%" : "-"}</span></div>
      <div class="row"><span class="label">Country of Origin</span><span class="value">${p.country || p.countryOfOrigin || "-"}</span></div>
    </div>
  </div>
  <div>
    <div class="card"><h3>Pricing Information</h3>
      <div class="row"><span class="label">Cost Price (Rs)</span><span class="value">${(p.purchasePrice || p.cost || 0).toLocaleString()}.00</span></div>
      <div class="row"><span class="label">Selling Price (Rs)</span><span class="value">${(p.sellingPrice || p.price || 0).toLocaleString()}.00</span></div>
      <div class="row"><span class="label">M.R.P (Rs)</span><span class="value">${(p.mrp || 0).toLocaleString()}.00</span></div>
      <div class="row"><span class="label">Tax Type</span><span class="value">${p.taxType || "-"}</span></div>
      <div class="row"><span class="label">Discount Percentage (%)</span><span class="value">${p.discount ? p.discount + "%" : "-"}</span></div>
      <div class="row"><span class="label">Discount Value (Rs)</span><span class="value">${p.discountValue ? p.discountValue.toLocaleString() : "-"}</span></div>
      <div class="row"><span class="label">Minimum Selling Price (Rs)</span><span class="value">${p.minSellingPrice ? p.minSellingPrice.toLocaleString() : "-"}</span></div>
    </div>
  </div>
</div>
<div class="grid" style="margin-top:16px">
  <div class="card"><h3>Inventory & Warehouse Information</h3>
    <div class="row"><span class="label">In Stock Quantity</span><span class="value">${stock}</span></div>
    <div class="row"><span class="label">Minimum Stock Level</span><span class="value">${p.minStockLevel || "-"}</span></div>
    <div class="row"><span class="label">Maximum Stock Level</span><span class="value">${p.maxStockLevel || "-"}</span></div>
    <div class="row"><span class="label">Reorder Level</span><span class="value">${p.reorderLevel || "-"}</span></div>
    <div class="row"><span class="label">Reorder Quantity</span><span class="value">${p.reorderQuantity || "-"}</span></div>
    <div class="row"><span class="label">Shelf Life (Days)</span><span class="value">${p.shelfLife || "-"}</span></div>
    <div class="row"><span class="label">Warranty period</span><span class="value">${p.warrantyPeriod || "-"}</span></div>
    <div class="row"><span class="label">Warehouse</span><span class="value">${p.warehouseLocation || "-"}</span></div>
    <div class="row"><span class="label">Storage Location</span><span class="value">${p.storageLocation || "-"}</span></div>
    <div class="row"><span class="label">Rack / Bin Location</span><span class="value">${p.binLocation || "-"}</span></div>
    <div class="row"><span class="label">Bin Code</span><span class="value">${p.binCode || "-"}</span></div>
  </div>
  <div>
    <div class="card"><h3>Supplier Information</h3>
      <div class="row"><span class="label">Primary Supplier</span><span class="value">${p.supplierName || "-"}</span></div>
      <div class="row"><span class="label">Supplier GSTN</span><span class="value">${p.supplierGstn || "-"}</span></div>
      <div class="row"><span class="label">Lead Time</span><span class="value">${p.leadTime || "-"}</span></div>
      <div class="row"><span class="label">Last Purchase Price (Rs)</span><span class="value">${p.lastPurchasePrice ? p.lastPurchasePrice.toLocaleString() : "-"}</span></div>
    </div>
    <div class="card" style="margin-top:16px"><h3>Product Specifications</h3>
      <div class="row"><span class="label">Manufacturer</span><span class="value">${p.manufacturer || "-"}</span></div>
      <div class="row"><span class="label">Model No</span><span class="value">${p.modelName || "-"}</span></div>
      <div class="row"><span class="label">Serial Number</span><span class="value">${p.serialNumber || "-"}</span></div>
      <div class="row"><span class="label">Size / Dimensions</span><span class="value">${p.dimensions || "-"}</span></div>
      <div class="row"><span class="label">Weight</span><span class="value">${p.weightInGm ? p.weightInGm + " g" : "-"}</span></div>
    </div>
  </div>
</div>
<div class="card" style="margin-top:16px">
  <h3>Product Status</h3>
  <div class="status-row">
    <div class="status-item"><span class="status-label">Allow Purchase</span> <span class="badge ${p.allowPurchase ? "badge-green" : "badge-slate"}">${p.allowPurchase ? "Yes" : "No"}</span></div>
    <div class="status-item"><span class="status-label">Allow Sales</span> <span class="badge ${p.allowSales ? "badge-green" : "badge-slate"}">${p.allowSales ? "Yes" : "No"}</span></div>
    <div class="status-item"><span class="status-label">Publish on Store / POS</span> <span class="badge ${p.publishOnStore ? "badge-green" : "badge-slate"}">${p.publishOnStore ? "Yes" : "No"}</span></div>
    <div class="status-item"><span class="status-label">Status</span> <span class="badge ${p.status === "active" ? "badge-green" : "badge-slate"}">${p.status === "active" ? "Active" : "Inactive"}</span></div>
  </div>
</div>
</body></html>`;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 400);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-sm mb-5">
        <div>
          <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight">
            {p.name || "Product"}
          </h1>
          <p className="text-[12px] text-slate-500 font-medium mt-0.5">
            SKU : {p.sku || p.barcode || "-"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={printProduct}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors"
          >
            <Printer size={15} /> print
          </button>
          <button
            onClick={() => onEdit && onEdit(p)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors"
          >
            <Edit3 size={15} /> Edit Product
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-red-200 text-red-500 text-[13px] font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 size={15} /> Remove
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>
        </div>
      </div>

      {/* Top Section - Image + Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(10,37,64,0.04)] overflow-hidden">
            <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="text-center">
                  <Box size={64} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-[13px] text-slate-400 font-semibold">
                    Product Image
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Thumbnails */}
          {p.galleryImages && p.galleryImages.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {p.galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden"
                >
                  <img
                    src={img.url}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center"
                >
                  <Box size={20} className="text-slate-300" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <Section title="product information" icon={Box}>
          <InfoRow label="Product name" value={p.name} />
          <InfoRow label="SKU / Code" value={p.sku || p.barcode} />
          <InfoRow label="Barcode" value={p.barcode} />
          <InfoRow label="HSN / SAC Code" value={p.hsnSacCode} />
          {p.description && (
            <div className="pt-2">
              <p className="text-[13px] text-slate-500 font-medium mb-1">
                Description
              </p>
              <p className="text-[12px] text-slate-700 font-medium leading-relaxed">
                {p.description}
              </p>
            </div>
          )}
        </Section>
      </div>

      {/* Middle Section - Classification + Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <Section title="Classification" icon={Tag}>
          <InfoRow
            label="Category"
            value={<CategoryBadge category={p.category} />}
          />
          <InfoRow label="Subcategory" value={p.subCategory} />
          <InfoRow label="Brand" value={p.brand} />
          <InfoRow label="Unit of Measurement" value={p.unit} />
          <InfoRow
            label="Tax Rate(%)"
            value={p.taxRate ? `${p.taxRate}%` : "-"}
          />
          <InfoRow
            label="Country of Origin"
            value={p.country || p.countryOfOrigin}
          />
        </Section>

        <Section title="Pricing Information" icon={Tag}>
          <InfoRow
            label="Cost Price (Rs)"
            value={`₹${(p.purchasePrice || p.cost || 0).toLocaleString()}.00`}
          />
          <InfoRow
            label="Selling Price (Rs)"
            value={`₹${(p.sellingPrice || p.price || 0).toLocaleString()}.00`}
          />
          <InfoRow
            label="M.R.P (Rs)"
            value={`₹${(p.mrp || 0).toLocaleString()}.00`}
          />
          <InfoRow label="Tax Type" value={p.taxType} />
          <InfoRow
            label="Discount Percentage (%)"
            value={p.discount ? `${p.discount}%` : "-"}
          />
          <InfoRow
            label="Discount Value (Rs)"
            value={p.discountValue ? `₹${p.discountValue.toLocaleString()}` : "-"}
          />
          <InfoRow
            label="Minimum Selling Price (Rs)"
            value={p.minSellingPrice ? `₹${p.minSellingPrice.toLocaleString()}` : "-"}
          />
        </Section>
      </div>

      {/* Bottom Section - Inventory + Supplier + Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <Section title="Inventory & Warehouse Information" icon={Warehouse}>
          <InfoRow label="In Stock Quantity" value={stock} />
          <InfoRow label="Minimum Stock Level" value={p.minStockLevel} />
          <InfoRow label="Maximum Stock Level" value={p.maxStockLevel} />
          <InfoRow label="Reorder Level" value={p.reorderLevel} />
          <InfoRow label="Reorder Quantity" value={p.reorderQuantity} />
          <InfoRow label="Shelf Life (Days)" value={p.shelfLife} />
          <InfoRow label="Warranty period" value={p.warrantyPeriod} />
          <InfoRow label="Warehouse" value={p.warehouseLocation} />
          <InfoRow label="Storage Location" value={p.storageLocation} />
          <InfoRow label="Rack / Bin Location" value={p.binLocation} />
          <InfoRow label="Bin Code" value={p.binCode} />
        </Section>

        <div className="space-y-5">
          <Section title="Supplier Information" icon={FileText}>
            <InfoRow label="Primary Supplier" value={p.supplierName} />
            <InfoRow label="Supplier GSTN" value={p.supplierGstn} />
            <InfoRow label="Lead Time" value={p.leadTime} />
            <InfoRow
              label="Last Purchase Price (Rs)"
              value={p.lastPurchasePrice ? `₹${p.lastPurchasePrice.toLocaleString()}` : "-"}
            />
          </Section>

          <Section title="Product Specifications" icon={Settings}>
            <InfoRow label="Manufacturer" value={p.manufacturer} />
            <InfoRow label="Model No" value={p.modelName} />
            <InfoRow label="Serial Number" value={p.serialNumber} />
            <InfoRow label="Size / Dimensions" value={p.dimensions} />
            <InfoRow
              label="Weight"
              value={p.weightInGm ? `${p.weightInGm} g` : "-"}
            />
          </Section>
        </div>
      </div>

      {/* Product Status - Full Width */}
      <Section title="Product Status" icon={Settings}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
            <span className="text-[12px] text-slate-500 font-medium">Allow Purchase</span>
            <BadgeRow label="" value={p.allowPurchase} active={p.allowPurchase} />
          </div>
          <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
            <span className="text-[12px] text-slate-500 font-medium">Allow Sales</span>
            <BadgeRow label="" value={p.allowSales} active={p.allowSales} />
          </div>
          <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
            <span className="text-[12px] text-slate-500 font-medium">Publish on Store / POS</span>
            <BadgeRow label="" value={p.publishOnStore} active={p.publishOnStore} />
          </div>
          <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
            <span className="text-[12px] text-slate-500 font-medium">Status</span>
            <StatusBadge active={p.status === "active"} />
          </div>
        </div>
      </Section>

      <ConfirmDialog
        open={showConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${p.name}"? This action cannot be undone and all data will be permanently removed.`}
        confirmText="Delete Product"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
