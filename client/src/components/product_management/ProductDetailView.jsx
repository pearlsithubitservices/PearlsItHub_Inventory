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

const BadgeRow = ({ label, value, active, color }) => (
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

  const stockStatus =
    stock === 0 ? "Out of Stock" : stock <= 10 ? "Low Stock" : "In Stock";
  const stockColor =
    stock === 0
      ? "text-red-500"
      : stock <= 10
        ? "text-amber-500"
        : "text-emerald-600";
  const stockBadge =
    stock === 0
      ? "bg-red-50 text-red-600 border border-red-200"
      : stock <= 10
        ? "bg-amber-50 text-amber-600 border border-amber-200"
        : "bg-emerald-50 text-emerald-600 border border-emerald-200";

  const categoryBadgeColor = {
    Electronics: "background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe",
    Furnitures: "background:#fffbeb;color:#d97706;border:1px solid #fde68a",
    Accessories: "background:#faf5ff;color:#9333ea;border:1px solid #e9d5ff",
    Hardwares: "background:#fef2f2;color:#dc2626;border:1px solid #fecaca",
    Clothing: "background:#fdf2f8;color:#db2777;border:1px solid #fbcfe8",
    Grocery: "background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0",
    "Spare Parts": "background:#fff7ed;color:#ea580c;border:1px solid #fed7aa",
  };

  const printProduct = () => {
    const catStyle =
      categoryBadgeColor[p.category] ||
      "background:#f1f5f9;color:#475569;border:1px solid #e2e8f0";
    const statusActive = p.status === "active";
    const html = `<!DOCTYPE html>
<html><head><title>${p.name || "Product"}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; padding:30px; color:#1e293b; background:#f8fafc; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
  .header h1 { font-size:22px; font-weight:800; color:#0f172a; letter-spacing:-0.025em; }
  .header .sku { font-size:13px; color:#64748b; font-weight:500; margin-top:4px; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .col-left { display:flex; flex-direction:column; gap:16px; }
  .col-right { display:flex; flex-direction:column; gap:16px; }
  .card { background:#fff; border:1px solid rgba(226,232,240,0.8); border-radius:12px; padding:20px; box-shadow:0 1px 4px rgba(10,37,64,0.04); }
  .card h3 { font-size:15px; font-weight:800; color:#0f172a; letter-spacing:-0.025em; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
  .card h3 .icon { color:#1e5fa5; font-size:14px; }
  .row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #f1f5f9; }
  .row:last-child { border-bottom:none; }
  .label { font-size:13px; color:#64748b; font-weight:500; }
  .value { font-size:13px; font-weight:700; color:#0f172a; text-align:right; }
  .badge { display:inline-flex; align-items:center; padding:2px 10px; border-radius:9999px; font-size:11px; font-weight:700; }
  .badge-green { background:#ecfdf5; color:#059669; border:1px solid #a7f3d0; }
  .badge-red { background:#fef2f2; color:#dc2626; border:1px solid #fecaca; }
  .badge-slate { background:#f1f5f9; color:#64748b; border:1px solid #e2e8f0; }
  .cat-badge { display:inline-flex; padding:2px 10px; border-radius:9999px; font-size:11px; font-weight:700; }
  .img-box { background:linear-gradient(135deg,#f8fafc,#f1f5f9); border-radius:12px; display:flex; align-items:center; justify-content:center; min-height:280px; border:1px solid rgba(226,232,240,0.8); }
  .img-box .placeholder { text-align:center; color:#94a3b8; }
  .img-box .placeholder svg { width:80px; height:80px; margin:0 auto 12px; }
  .img-box .placeholder p { font-size:13px; font-weight:600; }
  .thumbnails { display:flex; gap:8px; }
  .thumb { width:64px; height:64px; border-radius:8px; background:#f1f5f9; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; color:#cbd5e1; }
  .stock-val { font-weight:700; }
  .stock-red { color:#ef4444; }
  .stock-amber { color:#f59e0b; }
  .stock-green { color:#059669; }
  .desc { padding-top:8px; }
  .desc .desc-label { font-size:13px; color:#64748b; font-weight:500; margin-bottom:4px; }
  .desc .desc-text { font-size:13px; color:#334155; font-weight:500; line-height:1.6; }
  @media print {
    body { padding:16px; background:#fff; }
    .card { box-shadow:none; }
  }
</style></head><body>
<div class="header">
  <div>
    <h1>${p.name || "Product"}</h1>
    <p class="sku">SKU: ${p.sku || p.barcode || "-"}</p>
  </div>
</div>
<div class="grid">
  <div class="col-left">
    <div class="card">
      <div class="img-box">
        ${
          p.imageUrl
            ? `<img src="${p.imageUrl}" alt="${p.name}" style="max-width:100%;max-height:300px;object-fit:contain;padding:16px;">`
            : `<div class="placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4M4 7l8 4M4 7v10l8 4m0-10v10"/></svg><p>Product Image</p></div>`
        }
      </div>
    </div>
    <div class="thumbnails">
      ${
        p.galleryImages && p.galleryImages.length > 0
          ? p.galleryImages
              .map(
                (img) =>
                  `<div class="thumb"><img src="${img.url}" alt="gallery" style="width:100%;height:100%;object-fit:cover;border-radius:8px;"></div>`,
              )
              .join("")
          : `<div class="thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4M4 7l8 4M4 7v10l8 4m0-10v10"/></svg></div>
          <div class="thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4M4 7l8 4M4 7v10l8 4m0-10v10"/></svg></div>
          <div class="thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4M4 7l8 4M4 7v10l8 4m0-10v10"/></svg></div>
          <div class="thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4M4 7l8 4M4 7v10l8 4m0-10v10"/></svg></div>`
      }
    </div>
  </div>
  <div class="col-right">
    <div class="card">
      <h3><span class="icon">&#9632;</span> Product Information</h3>
      <div class="row"><span class="label">Product Name</span><span class="value">${p.name || "-"}</span></div>
      <div class="row"><span class="label">SKU / Code</span><span class="value">${p.sku || p.barcode || "-"}</span></div>
      <div class="row"><span class="label">Barcode</span><span class="value">${p.barcode || "-"}</span></div>
      <div class="row"><span class="label">HSN / SAC Code</span><span class="value">${p.hsnSacCode || "-"}</span></div>
      ${p.description ? `<div class="desc"><p class="desc-label">Description</p><p class="desc-text">${p.description}</p></div>` : ""}
    </div>
    <div class="card">
      <h3><span class="icon">&#9632;</span> Classification</h3>
      <div class="row"><span class="label">Category</span><span class="value"><span class="cat-badge" style="${catStyle}">${p.category || "-"}</span></span></div>
      <div class="row"><span class="label">Sub Category</span><span class="value">${p.subCategory || "-"}</span></div>
      <div class="row"><span class="label">Brand</span><span class="value">${p.brand || "-"}</span></div>
      <div class="row"><span class="label">Tag</span><span class="value">${p.tagForProduct || "-"}</span></div>
    </div>
    <div class="card">
      <h3><span class="icon">&#9632;</span> Pricing Information</h3>
      <div class="row"><span class="label">Selling Price</span><span class="value">&#8377;${(p.sellingPrice || p.price || 0).toLocaleString()}.00</span></div>
      <div class="row"><span class="label">M.R.P</span><span class="value">&#8377;${(p.mrp || 0).toLocaleString()}.00</span></div>
      <div class="row"><span class="label">Purchase Price</span><span class="value">&#8377;${(p.purchasePrice || p.cost || 0).toLocaleString()}.00</span></div>
      <div class="row"><span class="label">Tax Rate</span><span class="value">${p.taxRate ? p.taxRate + "%" : "-"}</span></div>
      <div class="row"><span class="label">Discount</span><span class="value">${p.discount ? p.discount + "%" : "-"}</span></div>
      <div class="row"><span class="label">Unit</span><span class="value">${p.unit || "-"}</span></div>
    </div>
    <div class="card">
      <h3><span class="icon">&#9632;</span> Inventory &amp; Warehouse Information</h3>
      <div class="row"><span class="label">Current Stock</span><span class="value"><span class="stock-val ${stockColor}">${stock} ${p.unit || ""}</span></span></div>
      <div class="row"><span class="label">Stock Status</span><span class="value"><span class="badge ${stockBadge}">${stockStatus}</span></span></div>
      <div class="row"><span class="label">Reorder Level</span><span class="value">${p.reorderLevel || "-"}</span></div>
      <div class="row"><span class="label">Warehouse Location</span><span class="value">${p.warehouseLocation || "-"}</span></div>
      <div class="row"><span class="label">Bin Location</span><span class="value">${p.binLocation || "-"}</span></div>
      <div class="row"><span class="label">Batch Number</span><span class="value">${p.batchNumber || "-"}</span></div>
      <div class="row"><span class="label">Region</span><span class="value">${p.region || "-"}</span></div>
    </div>
    <div class="card">
      <h3><span class="icon">&#9632;</span> Supplier Information</h3>
      <div class="row"><span class="label">Supplier Name</span><span class="value">${p.supplierName || "-"}</span></div>
      <div class="row"><span class="label">Contact Number</span><span class="value">${p.supplierContactNumber || "-"}</span></div>
      <div class="row"><span class="label">Invoice Number</span><span class="value">${p.invoiceNumber || "-"}</span></div>
      <div class="row"><span class="label">Invoice Date</span><span class="value">${p.invoiceDate ? new Date(p.invoiceDate).toLocaleDateString() : "-"}</span></div>
    </div>
    <div class="card">
      <h3><span class="icon">&#9632;</span> Product Specifications</h3>
      <div class="row"><span class="label">Manufacturer</span><span class="value">${p.manufacturer || "-"}</span></div>
      <div class="row"><span class="label">Model Name</span><span class="value">${p.modelName || "-"}</span></div>
      <div class="row"><span class="label">Color</span><span class="value">${p.color || "-"}</span></div>
      <div class="row"><span class="label">Material</span><span class="value">${p.material || "-"}</span></div>
      <div class="row"><span class="label">Weight</span><span class="value">${p.weightInGm ? p.weightInGm + "g" : "-"}</span></div>
      <div class="row"><span class="label">Country</span><span class="value">${p.country || p.countryOfOrigin || "-"}</span></div>
    </div>
    <div class="card">
      <h3><span class="icon">&#9632;</span> Product Status</h3>
      <div class="row"><span class="label">Status</span><span class="value"><span class="badge ${statusActive ? "badge-green" : "badge-red"}">${statusActive ? "Active" : "Inactive"}</span></span></div>
      <div class="row"><span class="label">Publish on Store / POS</span><span class="value"><span class="badge ${p.publishOnStore ? "badge-green" : "badge-slate"}">${p.publishOnStore ? "Yes" : "No"}</span></span></div>
      <div class="row"><span class="label">Allow Purchase</span><span class="value"><span class="badge ${p.allowPurchase ? "badge-green" : "badge-slate"}">${p.allowPurchase ? "Yes" : "No"}</span></span></div>
      <div class="row"><span class="label">Allow Sales</span><span class="value"><span class="badge ${p.allowSales ? "badge-green" : "badge-slate"}">${p.allowSales ? "Yes" : "No"}</span></span></div>
    </div>
  </div>
</div>
</body></html>`;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div>
      {/* Header */}
      {/* <div className="flex items-center justify-between mb-6"> */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm mb-5">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight">
            {p.name || "Product"}
          </h1>
          <p className="text-[13px] text-blue-600 font-medium mt-0.5">
            SKU: {p.sku || p.barcode || "-"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={printProduct}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors"
          >
            <Printer size={15} /> Print
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(10,37,64,0.04)] overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="text-center">
                  <Box size={80} className="text-slate-300 mx-auto mb-3" />
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

        {/* Right Column - Info */}
        <div className="space-y-4">
          <Section title="Product Information" icon={Box}>
            <InfoRow label="Product Name" value={p.name} />
            <InfoRow label="SKU / Code" value={p.sku || p.barcode} />
            <InfoRow label="Barcode" value={p.barcode} />
            <InfoRow label="HSN / SAC Code" value={p.hsnSacCode} />
            {p.description && (
              <div className="pt-2">
                <p className="text-[13px] text-slate-500 font-medium mb-1">
                  Description
                </p>
                <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
                  {p.description}
                </p>
              </div>
            )}
          </Section>

          <Section title="Classification" icon={Tag}>
            <InfoRow
              label="Category"
              value={<CategoryBadge category={p.category} />}
            />
            <InfoRow label="Sub Category" value={p.subCategory} />
            <InfoRow label="Brand" value={p.brand} />
            <InfoRow label="Tag" value={p.tagForProduct} />
          </Section>

          <Section title="Pricing Information" icon={Tag}>
            <InfoRow
              label="Selling Price"
              value={`₹${(p.sellingPrice || p.price || 0).toLocaleString()}.00`}
            />
            <InfoRow
              label="M.R.P"
              value={`₹${(p.mrp || 0).toLocaleString()}.00`}
            />
            <InfoRow
              label="Purchase Price"
              value={`₹${(p.purchasePrice || p.cost || 0).toLocaleString()}.00`}
            />
            <InfoRow
              label="Tax Rate"
              value={p.taxRate ? `${p.taxRate}%` : "-"}
            />
            <InfoRow
              label="Discount"
              value={p.discount ? `${p.discount}%` : "-"}
            />
            <InfoRow label="Unit" value={p.unit} />
          </Section>

          <Section title="Inventory & Warehouse Information" icon={Warehouse}>
            <InfoRow
              label="Current Stock"
              value={
                <span className={stockColor}>
                  {stock} {p.unit || ""}
                </span>
              }
            />
            <InfoRow
              label="Stock Status"
              value={
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${stockBadge}`}
                >
                  {stockStatus}
                </span>
              }
            />
            <InfoRow label="Reorder Level" value={p.reorderLevel} />
            <InfoRow label="Warehouse Location" value={p.warehouseLocation} />
            <InfoRow label="Bin Location" value={p.binLocation} />
            <InfoRow label="Batch Number" value={p.batchNumber} />
            <InfoRow label="Region" value={p.region} />
          </Section>

          <Section title="Supplier Information" icon={FileText}>
            <InfoRow label="Supplier Name" value={p.supplierName} />
            <InfoRow label="Contact Number" value={p.supplierContactNumber} />
            <InfoRow label="Invoice Number" value={p.invoiceNumber} />
            <InfoRow
              label="Invoice Date"
              value={
                p.invoiceDate
                  ? new Date(p.invoiceDate).toLocaleDateString()
                  : "-"
              }
            />
          </Section>

          <Section title="Product Specifications" icon={Settings}>
            <InfoRow label="Manufacturer" value={p.manufacturer} />
            <InfoRow label="Model Name" value={p.modelName} />
            <InfoRow label="Color" value={p.color} />
            <InfoRow label="Material" value={p.material} />
            <InfoRow
              label="Weight"
              value={p.weightInGm ? `${p.weightInGm}g` : "-"}
            />
            <InfoRow label="Country" value={p.country || p.countryOfOrigin} />
          </Section>

          <Section title="Product Status" icon={Settings}>
            <InfoRow
              label="Status"
              value={<StatusBadge active={p.status === "active"} />}
            />
            <BadgeRow
              label="Publish on Store / POS"
              value={p.publishOnStore}
              active={p.publishOnStore}
            />
            <BadgeRow
              label="Allow Purchase"
              value={p.allowPurchase}
              active={p.allowPurchase}
            />
            <BadgeRow
              label="Allow Sales"
              value={p.allowSales}
              active={p.allowSales}
            />
          </Section>
        </div>
      </div>

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
