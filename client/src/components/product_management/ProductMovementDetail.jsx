import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Warehouse,
  FileText,
  DollarSign,
  Box,
  Clock,
  User,
  Hash,
  MapPin,
  ClipboardList,
  ExternalLink,
} from "lucide-react";

const ACCENT = "#1e5fa5";

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const Section = ({ title, icon: Icon, headerAction, children }) => (
  <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(10,37,64,0.04)] p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
        <Icon size={16} className="text-[#1e5fa5]" /> {title}
      </h3>
      {headerAction}
    </div>
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

const movementTypeBadge = (type) => {
  const styles = {
    "Stock In": "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "Stock Out": "bg-red-100 text-red-600 border border-red-200",
    Transfer: "bg-purple-100 text-purple-700 border border-purple-200",
    Adjustment: "bg-orange-100 text-orange-600 border border-orange-200",
    "Return In": "bg-blue-100 text-blue-700 border border-blue-200",
  };
  return styles[type] || "bg-slate-100 text-slate-600 border border-slate-200";
};

const statusBadge = (status) => {
  const styles = {
    Completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    Pending: "bg-amber-100 text-amber-700 border border-amber-200",
    "In Transit": "bg-blue-100 text-blue-700 border border-blue-200",
    Cancelled: "bg-red-100 text-red-600 border border-red-200",
  };
  return (
    styles[status] || "bg-slate-100 text-slate-600 border border-slate-200"
  );
};

const categoryBadge = (cat) => {
  const styles = {
    Electronics: "bg-blue-50 text-blue-600 border border-blue-200",
    Furnitures: "bg-amber-50 text-amber-600 border border-amber-200",
    Accessories: "bg-purple-50 text-purple-600 border border-purple-200",
    Hardwares: "bg-red-50 text-red-600 border border-red-200",
  };
  return styles[cat] || "bg-slate-100 text-slate-600 border border-slate-200";
};

export default function ProductMovementDetail({ movement, onBack }) {
  const m = movement || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-[1400px] mx-auto"
    >
      {/* Breadcrumb */}
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight">
          Product Movement Details
        </h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={15} /> Back
        </motion.button>
      </div>

      {/* Top 4 Sections - 2 column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Movement Information */}
        <Section title="Movement Information" icon={ClipboardList}>
          <InfoRow
            label="Reference No"
            value={m.referenceId || "PO-2026-101"}
          />
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-[13px] text-slate-500 font-medium">
              Movement Type
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${movementTypeBadge(m.movementType || "Stock In")}`}
            >
              {m.movementType || "Stock In"}
            </span>
          </div>
          <InfoRow
            label="Movement Date & Time"
            value={m.date || "31-07-2026 09:15 AM"}
          />
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-[13px] text-slate-500 font-medium">
              Status
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusBadge(m.status || "Completed")}`}
            >
              {m.status || "Completed"}
            </span>
          </div>
          <InfoRow
            label="Returns"
            value={m.returns || "Purchase from supplier"}
          />
          <InfoRow label="Performed By" value={m.user || "Admin User"} />
        </Section>

        {/* Product Information */}
        <Section title="Product Information" icon={Package}>
          <div className="flex gap-5">
            <div className="w-36 h-36 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
              <Box size={48} className="text-slate-300" />
            </div>
            <div className="flex-1 min-w-0">
              <InfoRow
                label="Product Name"
                value={m.productName || "Seth Lakha 16 kg"}
              />
              <InfoRow label="SKU Code" value={m.sku || "DL - 00 168"} />
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-[13px] text-slate-500 font-medium">
                  Category
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${categoryBadge(m.category || "Electronics")}`}
                >
                  {m.category || "Electronics"}
                </span>
              </div>
              <InfoRow label="Unit" value={m.unit || "Nos"} />
            </div>
          </div>
        </Section>

        {/* Quantity & Stock Flow */}
        <Section title="Quantity & Stock Flow" icon={ArrowUpDown}>
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-[13px] text-slate-500 font-medium">
              Quantity
            </span>
            <span className="text-[14px] font-extrabold text-emerald-600">
              +{m.quantity || 100} Units
            </span>
          </div>
          <InfoRow
            label="Previous Stock"
            value={`${m.previousStock || 0} Units`}
          />
          <InfoRow label="New Stock" value={`${m.newStock || 100} Units`} />
          <InfoRow
            label="Balance Stock"
            value={`${m.balanceStock || 100} Units`}
          />
        </Section>

        {/* Warehouse Information */}
        <Section title="Warehouse Information" icon={Warehouse}>
          <InfoRow label="Warehouse" value={m.warehouse || "Main Warehouse"} />
          <InfoRow label="Location" value={m.location || "Rack A, Shelf 2"} />
          <InfoRow label="Bin" value={m.bin || "BIN-A2-79"} />
        </Section>
      </div>

      {/* Bottom 2 Sections - 2 column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Reference Document */}
        <Section
          title="Reference Document"
          icon={FileText}
          headerAction={
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 text-[11px] font-semibold hover:bg-blue-100 transition-colors">
              <ExternalLink size={12} /> View Document
            </button>
          }
        >
          <InfoRow
            label="Reference Number"
            value={m.referenceId || "PO-2026-101"}
          />
          <InfoRow
            label="Document Type"
            value={m.documentType || "Purchase Order"}
          />
          <InfoRow
            label="Supplier Name"
            value={m.supplierName || "Tech Supplies Inc."}
          />
          <InfoRow label="GRN No" value={m.grnNo || "GRN-2026-101"} />
          <InfoRow label="Invoice No" value={m.invoiceNo || "INV-2026-155"} />
          <InfoRow
            label="Document Date"
            value={m.documentDate || "31-07-2026"}
          />
          <InfoRow
            label="Total Amount"
            value={
              m.totalAmount
                ? `₹ ${m.totalAmount.toLocaleString()}.00`
                : "₹ 6,00,000.00"
            }
          />
        </Section>

        {/* Financial Information */}
        <Section title="Financial Information" icon={DollarSign}>
          <InfoRow
            label="Unit Cost(Rs)"
            value={
              m.unitCost ? `₹ ${m.unitCost.toLocaleString()}.00` : "₹ 60,000.00"
            }
          />
          <InfoRow
            label="Total Amount(Rs)"
            value={
              m.totalAmount
                ? `₹ ${m.totalAmount.toLocaleString()}.00`
                : "₹ 6,00,000.00"
            }
          />
          <InfoRow
            label="Discount(Rs)"
            value={
              m.discount ? `₹ ${m.discount.toLocaleString()}.00` : "₹ 0.00"
            }
          />
          <InfoRow
            label="Tax(Rs)"
            value={m.tax ? `₹ ${m.tax.toLocaleString()}.00` : "₹ 0.00"}
          />
          <div className="flex justify-between items-center py-3 mt-2 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200 px-3">
            <span className="text-[14px] font-bold text-slate-700">
              Net Amount(Rs)
            </span>
            <span className="text-[16px] font-extrabold text-[#1e5fa5]">
              {m.netAmount
                ? `₹ ${m.netAmount.toLocaleString()}.00`
                : "₹ 6,00,000.00"}
            </span>
          </div>
        </Section>
      </div>
    </motion.div>
  );
}
