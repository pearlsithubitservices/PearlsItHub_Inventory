import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronDown, Eye, Calendar,
  Package, TrendingUp, TrendingDown, ArrowUpDown,
  FileSpreadsheet, FileDown, RotateCcw,
  ChevronLeft, ChevronRight, Clock
} from 'lucide-react';
import ProductMovementDetail from '../../components/product_management/ProductMovementDetail';

const ACCENT = "#1e5fa5";
const ACCENT_2 = "#0a57c4";
const ITEMS_PER_PAGE = 10;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
};

const StatCard = ({ icon: Icon, label, value, tint, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3, ease: "easeOut" }}
    className="bg-white rounded-lg border border-slate-200/80 p-4 shadow-sm flex items-center gap-3"
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
      <Icon size={18} strokeWidth={2} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-slate-500 tracking-wide truncate">{label}</p>
      <p className="mt-0.5 text-xl font-extrabold text-slate-900 tracking-tight leading-none">{value}</p>
    </div>
  </motion.div>
);

const Dropdown = ({ label, onChange, options }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleMouseMove = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseMove);
    return () => document.removeEventListener('mousedown', handleMouseMove);
  }, [open]);

  return (
    <div className="relative dropdown-container z-20">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:border-slate-300 transition-colors"
      >
        <span className="truncate">{label}</span>
        <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30 max-h-56 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-[#0a57c4]/10 hover:text-[#1e5fa5] transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5fa5]/30 focus:border-[#1e5fa5]/30 transition-all";

const movementTypeBadge = (type) => {
  const styles = {
    'Stock In': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'Stock Out': 'bg-red-100 text-red-600 border border-red-200',
    'Transfer': 'bg-purple-100 text-purple-700 border border-purple-200',
    'Adjustment': 'bg-orange-100 text-orange-600 border border-orange-200',
    'Return In': 'bg-blue-100 text-blue-700 border border-blue-200',
  };
  return styles[type] || 'bg-slate-100 text-slate-600 border border-slate-200';
};

const movementData = [
  { id: 1, date: '06-28-2026 09:15 AM', productName: 'Seth Lakha 16 kg', sku: 'DL - 00 168', movementType: 'Stock In', referenceId: 'TRF-90340', quantity: 100, balanceStock: 88, user: 'Admin User', status: 'Completed', category: 'Electronics', unit: 'Nos', warehouse: 'Main Warehouse', location: 'Rack A, Shelf 2', bin: 'BIN-A2-79', previousStock: 0, newStock: 100, returns: 'Purchase from supplier', documentType: 'Purchase Order', supplierName: 'Tech Supplies Inc.', grnNo: 'GRN-2026-101', invoiceNo: 'INV-2026-155', documentDate: '31-07-2026', totalAmount: 600000, unitCost: 60000, discount: 0, tax: 108000, netAmount: 708000 },
  { id: 2, date: '06-28-2026 11:30 AM', productName: 'Seth Lakha 16 kg', sku: 'DL - 00 168', movementType: 'Stock Out', referenceId: 'TRF-90346', quantity: -40, balanceStock: 48, user: 'Admin User', status: 'Completed', category: 'Electronics', unit: 'Nos', warehouse: 'Chennai-WH', location: 'Rack B, Shelf 1', bin: 'BIN-B1-45', previousStock: 88, newStock: 48, returns: 'Customer Dispatch', documentType: 'Sales Order', supplierName: '-', grnNo: '-', invoiceNo: 'INV-2026-160', documentDate: '28-06-2026', totalAmount: 240000, unitCost: 60000, discount: 0, tax: 43200, netAmount: 283200 },
  { id: 3, date: '07-01-2026 02:45 PM', productName: 'Seth Lakha 16 kg', sku: 'DL - 00 168', movementType: 'Transfer', referenceId: 'TRF-90347', quantity: 60, balanceStock: 108, user: 'Admin User', status: 'Completed', category: 'Electronics', unit: 'Nos', warehouse: 'Mumbai-WH', location: 'Rack C, Shelf 3', bin: 'BIN-C3-12', previousStock: 48, newStock: 108, returns: 'Internal Transfer', documentType: 'Transfer Order', supplierName: '-', grnNo: 'GRN-2026-110', invoiceNo: '-', documentDate: '01-07-2026', totalAmount: 360000, unitCost: 60000, discount: 0, tax: 64800, netAmount: 424800 },
  { id: 4, date: '07-03-2026 10:00 AM', productName: 'Seth Lakha 16 kg', sku: 'DL - 00 168', movementType: 'Adjustment', referenceId: 'TRF-90348', quantity: 50, balanceStock: 158, user: 'Admin User', status: 'Completed', category: 'Electronics', unit: 'Nos', warehouse: 'Chennai-WH', location: 'Rack A, Shelf 4', bin: 'BIN-A4-22', previousStock: 108, newStock: 158, returns: 'Audit Correction', documentType: 'Adjustment Note', supplierName: '-', grnNo: '-', invoiceNo: '-', documentDate: '03-07-2026', totalAmount: 300000, unitCost: 60000, discount: 0, tax: 54000, netAmount: 354000 },
  { id: 5, date: '07-05-2026 03:20 PM', productName: 'Seth Lakha 16 kg', sku: 'DL - 00 168', movementType: 'Return In', referenceId: 'TRF-90349', quantity: 40, balanceStock: 198, user: 'Admin User', status: 'Completed', category: 'Electronics', unit: 'Nos', warehouse: 'Chennai-WH', location: 'Rack B, Shelf 2', bin: 'BIN-B2-33', previousStock: 158, newStock: 198, returns: 'Customer Return', documentType: 'Return Order', supplierName: '-', grnNo: 'GRN-2026-115', invoiceNo: 'INV-2026-165', documentDate: '05-07-2026', totalAmount: 240000, unitCost: 60000, discount: 0, tax: 43200, netAmount: 283200 },
  { id: 6, date: '07-06-2026 09:45 AM', productName: 'Seth Lakha 16 kg', sku: 'DL - 00 168', movementType: 'Stock In', referenceId: 'TRF-90350', quantity: 50, balanceStock: 248, user: 'Admin User', status: 'Completed', category: 'Electronics', unit: 'Nos', warehouse: 'Main Warehouse', location: 'Rack A, Shelf 1', bin: 'BIN-A1-05', previousStock: 198, newStock: 248, returns: 'Purchase from supplier', documentType: 'Purchase Order', supplierName: 'Global Traders', grnNo: 'GRN-2026-120', invoiceNo: 'INV-2026-170', documentDate: '06-07-2026', totalAmount: 300000, unitCost: 60000, discount: 0, tax: 54000, netAmount: 354000 },
  { id: 7, date: '07-08-2026 01:15 PM', productName: 'Seth Lakha 16 kg', sku: 'DL - 00 168', movementType: 'Stock Out', referenceId: 'TRF-90351', quantity: -25, balanceStock: 223, user: 'Admin User', status: 'Completed', category: 'Electronics', unit: 'Nos', warehouse: 'Pune-WH', location: 'Rack D, Shelf 1', bin: 'BIN-D1-08', previousStock: 248, newStock: 223, returns: 'Customer Dispatch', documentType: 'Sales Order', supplierName: '-', grnNo: '-', invoiceNo: 'INV-2026-175', documentDate: '08-07-2026', totalAmount: 150000, unitCost: 60000, discount: 0, tax: 27000, netAmount: 177000 },
  { id: 8, date: '07-09-2026 11:00 AM', productName: 'Seth Lakha 16 kg', sku: 'DL - 00 168', movementType: 'Stock In', referenceId: 'TRF-90352', quantity: 20, balanceStock: 243, user: 'Admin User', status: 'Pending', category: 'Electronics', unit: 'Nos', warehouse: 'Chennai-WH', location: 'Rack A, Shelf 3', bin: 'BIN-A3-15', previousStock: 223, newStock: 243, returns: 'Purchase from supplier', documentType: 'Purchase Order', supplierName: 'Regional Suppliers', grnNo: 'GRN-2026-125', invoiceNo: 'INV-2026-180', documentDate: '09-07-2026', totalAmount: 120000, unitCost: 60000, discount: 0, tax: 21600, netAmount: 141600 },
];

export default function ProductHistory() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [product, setProduct] = useState('');
  const [sku, setSku] = useState('');
  const [movementType, setMovementType] = useState('All Types');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [view, setView] = useState('list');
  const [selectedMovement, setSelectedMovement] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full py-32">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e5fa5] border-t-transparent" />
    </div>
  );

  const totalPages = Math.ceil(movementData.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = movementData.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const resetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setProduct('');
    setSku('');
    setMovementType('All Types');
    setReferenceNumber('');
    setCurrentPage(1);
  };

  if (view === 'detail' && selectedMovement) {
    return (
      <ProductMovementDetail
        movement={selectedMovement}
        onBack={() => { setView('list'); setSelectedMovement(null); }}
      />
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-[1400px] mx-auto space-y-4">
      <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-[20px] font-bold text-slate-900">Movement History</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const headers = ["#", "Date & Time", "Product Name", "SKU/Code", "Movement Type", "Reference ID", "Quantity", "Tax (Rs)", "Balance Stock", "User"];
              const rows = movementData.map((row, i) => [
                i + 1, row.date, row.productName, row.sku, row.movementType, row.referenceId, row.quantity, row.tax || 0, row.balanceStock, row.user
              ]);
              const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
              const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "movement-history.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" /> Export Excel
          </button>
          <button
            onClick={() => {
              const printWindow = window.open("", "_blank");
              const rows = movementData.map((row, i) => `
                <tr>
                  <td>${i + 1}</td><td>${row.date}</td><td>${row.productName}</td>
                  <td>${row.sku}</td><td>${row.movementType}</td><td>${row.referenceId}</td>
                  <td>${row.quantity}</td><td>₹${(row.tax || 0).toLocaleString()}</td><td>${row.balanceStock}</td><td>${row.user}</td>
                </tr>`).join("");
              printWindow.document.write(`<html><head><title>Movement History Report</title>
                <style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:12px}th{background:#1e5fa5;color:white}tr:nth-child(even){background:#f9f9f9}h1{color:#1e5fa5}</style></head>
                <body><h1>Movement History Report</h1><p>Date: ${new Date().toLocaleDateString()}</p>
                <table><thead><tr><th>#</th><th>Date & Time</th><th>Product Name</th><th>SKU/Code</th><th>Movement Type</th><th>Reference ID</th><th>Quantity</th><th>Tax (Rs)</th><th>Balance Stock</th><th>User</th></tr></thead>
                <tbody>${rows}</tbody></table></body></html>`);
              printWindow.document.close();
              printWindow.print();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <FileDown size={15} className="text-red-500" /> Export PDF
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Received" value="1,200 Units" tint="bg-blue-50 text-blue-600" delay={0} />
        <StatCard icon={TrendingDown} label="Total Returns" value="150 Units" tint="bg-red-50 text-red-600" delay={0.05} />
        <StatCard icon={ArrowUpDown} label="Total Adjustment" value="80 Units" tint="bg-emerald-50 text-emerald-600" delay={0.1} />
        <StatCard icon={TrendingUp} label="Total Transfers" value="320 Units" tint="bg-purple-50 text-purple-600" delay={0.15} />
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 mb-3">
          <Field label="Date From">
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
          </Field>
          <Field label="Date To">
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
          </Field>
          <Field label="Product">
            <input
              type="text"
              placeholder="Enter product name"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="SKU / CODE">
            <input
              type="text"
              placeholder="Enter SKU/ code"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Movement Type">
            <Dropdown
              label={movementType}
              onChange={setMovementType}
              options={['All Types', 'Stock In', 'Stock Out', 'Transfer', 'Adjustment', 'Return In']}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 mb-3">
          <Field label="Reference Number">
            <input
              type="text"
              placeholder="e.g. TRF-90340"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200/70 transition-colors"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-semibold shadow-md hover:opacity-95 transition-all"
            style={{ background: `linear-gradient(135deg, ${ACCENT_2} 0%, ${ACCENT} 100%)` }}
          >
            <Search size={13} /> Search
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-lg border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Movements History list</h3>
        </div>
        <div className="overflow-x-auto px-2 pb-2 pt-1">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-y border-slate-200/70 bg-slate-50/60">
                {["DATE & TIME", "PRODUCT NAME", "SKU/CODE", "MOVEMENT TYPE", "REFERENCE ID", "QUANTITY", "TAX (Rs)", "BALANCE STOCK", "USER", "ACTION"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-[9px] font-extrabold text-slate-600 uppercase tracking-wider text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, idx) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-3 py-2.5 text-[12px] font-semibold text-slate-700 whitespace-nowrap">{row.date}</td>
                  <td className="px-3 py-2.5 text-[12px] font-semibold text-slate-800">{row.productName}</td>
                  <td className="px-3 py-2.5 text-[11px] font-bold text-slate-600 font-mono tracking-wide">{row.sku}</td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${movementTypeBadge(row.movementType)}`}>
                      {row.movementType}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[11px] font-bold text-slate-700 font-mono">{row.referenceId}</td>
                  <td className={`px-3 py-2.5 text-[12px] font-extrabold ${row.quantity < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {row.quantity > 0 ? '+' : ''}{row.quantity}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] font-semibold text-slate-700">
                    ₹{row.tax ? row.tax.toLocaleString() : '0'}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] font-bold text-slate-800">{row.balanceStock}</td>
                  <td className="px-3 py-2.5 text-[12px] font-semibold text-slate-600">{row.user}</td>
                  <td className="px-3 py-2.5">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { setSelectedMovement(row); setView('detail'); }}
                      className="w-6 h-6 rounded bg-blue-50 text-blue-500 border border-blue-200 flex items-center justify-center hover:bg-blue-100 transition-all"
                      title="View"
                    >
                      <Eye size={12} />
                    </motion.button>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-sm text-slate-400 font-semibold">
                    No movement records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 pt-2 pb-4 flex items-center justify-end">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <ChevronLeft size={13} />
            </button>
            {(() => {
              const pages = [];
              const maxVisible = 5;
              let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              let end = Math.min(totalPages, start + maxVisible - 1);
              if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
              if (start > 1) {
                pages.push(
                  <button key={1} onClick={() => setCurrentPage(1)} className="w-8 h-8 rounded text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60 transition-all">1</button>
                );
                if (start > 2) pages.push(<span key="s-ellipsis" className="text-slate-400 font-bold px-1">...</span>);
              }
              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 rounded text-xs font-bold transition-all ${currentPage === i ? "text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60"}`}
                    style={currentPage === i ? { background: `linear-gradient(135deg, ${ACCENT_2} 0%, ${ACCENT} 100%)` } : undefined}
                  >
                    {i}
                  </button>
                );
              }
              if (end < totalPages) {
                if (end < totalPages - 1) pages.push(<span key="e-ellipsis" className="text-slate-400 font-bold px-1">...</span>);
                pages.push(
                  <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className="w-8 h-8 rounded text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60 transition-all">{totalPages}</button>
                );
              }
              return pages;
            })()}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
