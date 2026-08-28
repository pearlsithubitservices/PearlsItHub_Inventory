import { motion } from 'framer-motion';
import {
  ArrowLeft, Printer, Trash2, Box, Shield, FileText,
  Calendar, MapPin, User, Tag, Settings
} from 'lucide-react';

const ACCENT = "#1e5fa5";

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
    <span className="text-[13px] font-bold text-slate-800 text-right">{value || "-"}</span>
  </div>
);

const warrantyStatusBadge = (status) => {
  const styles = {
    'Active': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'Expiring Soon': 'bg-amber-100 text-amber-700 border border-amber-200',
    'Expired': 'bg-red-100 text-red-600 border border-red-200',
  };
  return styles[status] || 'bg-slate-100 text-slate-600 border border-slate-200';
};

const categoryBadge = (cat) => {
  const styles = {
    'Electronics': 'bg-blue-50 text-blue-600 border border-blue-200',
    'Furnitures': 'bg-amber-50 text-amber-600 border border-amber-200',
    'Accessories': 'bg-purple-50 text-purple-600 border border-purple-200',
    'Hardwares': 'bg-red-50 text-red-600 border border-red-200',
    'Clothing': 'bg-pink-50 text-pink-600 border border-pink-200',
    'Grocery': 'bg-green-50 text-green-600 border border-green-200',
  };
  return styles[cat] || 'bg-slate-100 text-slate-600 border border-slate-200';
};

export default function WarrantyDetailView({ warranty, onBack }) {
  const w = warranty || {};

  const printWarranty = () => {
    const html = `<!DOCTYPE html>
<html><head><title>${w.productName || "Warranty"}</title>
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
  .img-box { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; display:flex; align-items:center; justify-content:center; min-height:200px; color:#94a3b8; }
  @media print { body { padding:10px; background:#fff; } .card { box-shadow:none; } }
</style></head><body>
<h1>${w.productName || "Product"} <span class="badge badge-green">${w.status || "Active"}</span></h1>
<p class="sku">SKU: ${w.sku || "-"}</p>
<div class="grid">
  <div>
    <div class="img-box">Product Image</div>
    <div class="card" style="margin-top:16px"><h3>Warranty Information</h3>
      <div class="row"><span class="label">Warranty Type</span><span class="value">${w.warrantyType || "Manufacture Warranty"}</span></div>
      <div class="row"><span class="label">Warranty Provider</span><span class="value">${w.warrantyProvider || "Dell India pvt ltd"}</span></div>
      <div class="row"><span class="label">Warranty Period</span><span class="value">${w.warrantyPeriod || "1 year"}</span></div>
      <div class="row"><span class="label">Start Date</span><span class="value">${w.purchaseDate || "-"}</span></div>
      <div class="row"><span class="label">Expiry Date</span><span class="value">${w.expiryDate || "-"}</span></div>
      <div class="row"><span class="label">Warranty Status</span><span class="value">${w.status || "Active"}</span></div>
      <div class="row"><span class="label">Coverage Details</span><span class="value">${w.coverageDetails || "Hardware Repair and Replacement"}</span></div>
    </div>
  </div>
  <div>
    <div class="card"><h3>Product Information</h3>
      <div class="row"><span class="label">Product name</span><span class="value">${w.productName || "-"}</span></div>
      <div class="row"><span class="label">SKU / Code</span><span class="value">${w.sku || "-"}</span></div>
      <div class="row"><span class="label">Serial Number</span><span class="value">${w.serialNo || "-"}</span></div>
      <div class="row"><span class="label">Category</span><span class="value">${w.category || "-"}</span></div>
      <div class="row"><span class="label">Brand</span><span class="value">${w.brand || "-"}</span></div>
      <div class="row"><span class="label">Model</span><span class="value">${w.model || "-"}</span></div>
      <div class="row"><span class="label">Configuration</span><span class="value">${w.configuration || "-"}</span></div>
      <div class="row"><span class="label">Condition</span><span class="value">${w.condition || "New"}</span></div>
    </div>
    <div class="card" style="margin-top:16px"><h3>Purchase Information</h3>
      <div class="row"><span class="label">Customer</span><span class="value">${w.customer || "-"}</span></div>
      <div class="row"><span class="label">Invoice Number</span><span class="value">${w.invoiceNo || "-"}</span></div>
      <div class="row"><span class="label">Purchase Date</span><span class="value">${w.purchaseDate || "-"}</span></div>
      <div class="row"><span class="label">Purchase Price</span><span class="value">${w.purchasePrice || "-"}</span></div>
      <div class="row"><span class="label">Vendor / Supplier</span><span class="value">${w.vendor || "-"}</span></div>
      <div class="row"><span class="label">Location</span><span class="value">${w.location || "-"}</span></div>
      <div class="row"><span class="label">Purchased By</span><span class="value">${w.purchasedBy || "-"}</span></div>
    </div>
  </div>
</div>
</body></html>`;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-[1400px] mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-sm mb-5">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight">
                {w.productName || "Dell Laptop 15"}
              </h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${warrantyStatusBadge(w.status || 'Active')}`}>
                {w.status || 'Active'}
              </span>
            </div>
            <p className="text-[12px] text-slate-500 font-medium mt-0.5">
              SKU : {w.sku || "DL-1001"}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
            <p className="text-[11px] text-amber-700 font-semibold">Expires in</p>
            <p className="text-[18px] font-extrabold text-amber-800 leading-none">312 days</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={printWarranty}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold hover:bg-slate-50 transition-colors"
          >
            <Printer size={15} /> print
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-red-200 text-red-500 text-[13px] font-semibold hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} /> Remove
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </motion.button>
        </div>
      </div>

      {/* Top Section - Image + Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Product Image */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(10,37,64,0.04)] p-5">
          <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200/60 flex items-center justify-center">
            <div className="text-center">
              <Box size={64} className="text-slate-300 mx-auto mb-2" />
              <p className="text-[13px] text-slate-400 font-semibold">Product Image</p>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <Section title="product information" icon={Tag}>
          <InfoRow label="Product name" value={w.productName || "Dell Laptop 15''"} />
          <InfoRow label="SKU / Code" value={w.sku || "DL-1001"} />
          <InfoRow label="Serial Number" value={w.serialNo || "SN002000123"} />
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-[13px] text-slate-500 font-medium">Category</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${categoryBadge(w.category || 'Electronics')}`}>
              {w.category || 'Electronics'}
            </span>
          </div>
          <InfoRow label="Brand" value={w.brand || "84713D10"} />
          <InfoRow label="Model" value={w.model || "Latitude 5420"} />
          <InfoRow label="Configuration" value={w.configuration || "i5 | 8GB RAM | 512 GB"} />
          <InfoRow label="Condition" value={w.condition || "New"} />
        </Section>
      </div>

      {/* Bottom Section - Warranty Info + Purchase Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Warranty Information */}
        <Section title="Warranty Information" icon={Shield}>
          <InfoRow label="Warranty Type" value={w.warrantyType || "Manufacture Warranty"} />
          <InfoRow label="Warranty Provider" value={w.warrantyProvider || "Dell India pvt ltd"} />
          <InfoRow label="Warranty Period" value={w.warrantyPeriod || "1 year"} />
          <InfoRow label="Start Date" value={w.purchaseDate || "12 Jun 2026"} />
          <InfoRow label="Expiry Date" value={w.expiryDate || "12 Jun 2027"} />
          <InfoRow label="Warranty Status" value={w.status || "Active"} />
          <InfoRow label="Coverage Details" value={w.coverageDetails || "Hardware Repair and Replacement"} />
          <div className="py-2 border-b border-slate-100">
            <span className="text-[13px] text-slate-500 font-medium block mb-1">Terms & Conditions</span>
            <p className="text-[12px] text-slate-700 font-medium leading-relaxed">
              {w.terms || "Standard manufacturer warranty covering manufacturing defects and hardware issues."}
            </p>
          </div>
          <div className="py-2">
            <span className="text-[13px] text-slate-500 font-medium block mb-1">Description</span>
            <p className="text-[12px] text-slate-700 font-medium leading-relaxed">
              {w.description || "Covers manufacturing defects and hardware issues."}
            </p>
          </div>
        </Section>

        {/* Purchase Information */}
        <Section title="Purchase Information" icon={FileText}>
          <InfoRow label="Customer" value={w.customer || "ABC pvt ltd"} />
          <InfoRow label="Invoice Number" value={w.invoiceNo || "INV-2026-1245"} />
          <InfoRow label="Purchase Date" value={w.purchaseDate || "12 JUN 2026"} />
          <InfoRow label="Purchase Price" value={w.purchasePrice || "₹8,300.00"} />
          <InfoRow label="Vendor / Supplier" value={w.vendor || "Dell India pvt ltd"} />
          <InfoRow label="Location" value={w.location || "Main Warehouse"} />
          <InfoRow label="Purchased By" value={w.purchasedBy || "Arun Kumar"} />
        </Section>
      </div>
    </motion.div>
  );
}
