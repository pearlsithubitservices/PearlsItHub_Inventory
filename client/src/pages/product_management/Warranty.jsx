import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Eye,
  Edit3,
  Calendar,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  FileDown,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Box,
  Package,
} from "lucide-react";
import WarrantyDetailView from "../../components/product_management/WarrantyDetailView";

const ACCENT = "#1e5fa5";
const ACCENT_2 = "#0a57c4";
const ITEMS_PER_PAGE = 10;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const StatCard = ({ icon: Icon, label, value, tint, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3, ease: "easeOut" }}
    className="bg-white rounded-lg border border-slate-200/80 p-4 shadow-sm flex items-center gap-3"
  >
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tint}`}
    >
      <Icon size={18} strokeWidth={2} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-slate-500 tracking-wide truncate">
        {label}
      </p>
      <p className="mt-0.5 text-xl font-extrabold text-slate-900 tracking-tight leading-none">
        {value}
      </p>
    </div>
  </motion.div>
);

const Dropdown = ({ label, onChange, options }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleMouseMove = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseMove);
    return () => document.removeEventListener("mousedown", handleMouseMove);
  }, [open]);

  return (
    <div className="relative dropdown-container z-20">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:border-slate-300 transition-colors"
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30 max-h-56 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
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
    <label className="block text-xs font-semibold text-slate-600 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5fa5]/30 focus:border-[#1e5fa5]/30 transition-all";

const warrantyStatusBadge = (status) => {
  const styles = {
    Active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "Expiring Soon": "bg-amber-100 text-amber-700 border border-amber-200",
    Expired: "bg-red-100 text-red-600 border border-red-200",
  };
  return (
    styles[status] || "bg-slate-100 text-slate-600 border border-slate-200"
  );
};

const warrantyData = [
  {
    id: 1,
    productName: "Dell Laptop 16",
    serialNo: "SN0020001",
    customer: "ABC Pvt Ltd",
    purchaseDate: "15-Jun-2025",
    expiryDate: "15-Jun-2027",
    status: "Active",
    sku: "DL-16-001",
    category: "Electronics",
    brand: "Dell",
    model: "Latitude 5420",
    configuration: "i5 | 8GB RAM | 512 GB",
    condition: "New",
    warrantyType: "Manufacture Warranty",
    warrantyProvider: "Dell India pvt ltd",
    warrantyPeriod: "2 year",
    coverageDetails: "Hardware Repair and Replacement",
    terms:
      "Standard manufacturer warranty covering manufacturing defects and hardware issues.",
    description: "Covers manufacturing defects and hardware issues.",
    invoiceNo: "INV-2026-1245",
    purchasePrice: "₹68,300.00",
    vendor: "Dell India pvt ltd",
    location: "Main Warehouse",
    purchasedBy: "Arun Kumar",
  },
  {
    id: 2,
    productName: "HP Laptop 14",
    serialNo: "SN0020002",
    customer: "Tech World",
    purchaseDate: "10-May-2025",
    expiryDate: "10-May-2027",
    status: "Active",
    sku: "HP-14-002",
    category: "Electronics",
    brand: "HP",
    model: "ProBook 440",
    configuration: "i7 | 16GB RAM | 512 GB",
    condition: "New",
    warrantyType: "Manufacture Warranty",
    warrantyProvider: "HP India pvt ltd",
    warrantyPeriod: "1 year",
    coverageDetails: "Hardware Repair and Replacement",
    terms:
      "Standard manufacturer warranty covering manufacturing defects and hardware issues.",
    description: "Covers manufacturing defects and hardware issues.",
    invoiceNo: "INV-2026-1246",
    purchasePrice: "₹72,500.00",
    vendor: "HP India pvt ltd",
    location: "Chennai Warehouse",
    purchasedBy: "Ravi Kumar",
  },
  {
    id: 3,
    productName: "Wireless Mouse",
    serialNo: "SN0020003",
    customer: "ABC Pvt Ltd",
    purchaseDate: "20-Apr-2025",
    expiryDate: "20-Apr-2027",
    status: "Active",
    sku: "WM-001",
    category: "Accessories",
    brand: "Logitech",
    model: "M331",
    configuration: "Wireless | 2.4GHz",
    condition: "New",
    warrantyType: "Standard",
    warrantyProvider: "Logitech India",
    warrantyPeriod: "1 year",
    coverageDetails: "Hardware Repair and Replacement",
    terms: "Standard manufacturer warranty.",
    description: "Covers manufacturing defects.",
    invoiceNo: "INV-2026-1247",
    purchasePrice: "₹1,200.00",
    vendor: "Logitech India",
    location: "Mumbai Warehouse",
    purchasedBy: "Suresh Patel",
  },
  {
    id: 4,
    productName: "T-shirt",
    serialNo: "SN0020004",
    customer: "Kumaran shop",
    purchaseDate: "05-Mar-2025",
    expiryDate: "05-Mar-2027",
    status: "Expiring Soon",
    sku: "TS-001",
    category: "Clothing",
    brand: "Nike",
    model: "Dri-Fit",
    configuration: "Cotton | Round Neck",
    condition: "New",
    warrantyType: "Limited",
    warrantyProvider: "Nike India",
    warrantyPeriod: "6 months",
    coverageDetails: "Manufacturing Defects Only",
    terms: "Covers manufacturing defects in fabric and stitching.",
    description: "Covers fabric and stitching defects.",
    invoiceNo: "INV-2026-1248",
    purchasePrice: "₹2,500.00",
    vendor: "Nike India",
    location: "Chennai Warehouse",
    purchasedBy: "Kumaran",
  },
  {
    id: 5,
    productName: "Ergonomic Chair",
    serialNo: "SN0020005",
    customer: "Infiniti retail store",
    purchaseDate: "01-Feb-2025",
    expiryDate: "01-Feb-2027",
    status: "Expiring Soon",
    sku: "EC-001",
    category: "Furnitures",
    brand: "Green Soul",
    model: "Monster",
    configuration: "Adjustable | Lumbar Support",
    condition: "New",
    warrantyType: "Manufacture Warranty",
    warrantyProvider: "Green Soul India",
    warrantyPeriod: "1 year",
    coverageDetails: "Frame and Mechanism",
    terms: "Covers frame and mechanism defects.",
    description: "Covers frame and mechanism defects.",
    invoiceNo: "INV-2026-1249",
    purchasePrice: "₹15,000.00",
    vendor: "Green Soul India",
    location: "Pune Warehouse",
    purchasedBy: "Rajesh Singh",
  },
  {
    id: 6,
    productName: "Shark Laser",
    serialNo: "SN0020006",
    customer: "G1 Infra Traders",
    purchaseDate: "15-Jan-2025",
    expiryDate: "15-Jan-2027",
    status: "Expired",
    sku: "SL-001",
    category: "Hardwares",
    brand: "Bosch",
    model: "GLM 50",
    configuration: "50m Range | Laser",
    condition: "Used",
    warrantyType: "Standard",
    warrantyProvider: "Bosch India",
    warrantyPeriod: "1 year",
    coverageDetails: "Manufacturing Defects",
    terms: "Standard manufacturer warranty.",
    description: "Covers manufacturing defects.",
    invoiceNo: "INV-2026-1250",
    purchasePrice: "₹4,500.00",
    vendor: "Bosch India",
    location: "Mumbai Warehouse",
    purchasedBy: "Ganesh",
  },
  {
    id: 7,
    productName: "GA Switch",
    serialNo: "SN0020007",
    customer: "Net Pin Lco",
    purchaseDate: "10-Dec-2024",
    expiryDate: "10-Dec-2026",
    status: "Expired",
    sku: "GS-001",
    category: "Electronics",
    brand: "TP-Link",
    model: "TL-SG105",
    configuration: "5 Port | Gigabit",
    condition: "New",
    warrantyType: "Manufacture Warranty",
    warrantyProvider: "TP-Link India",
    warrantyPeriod: "3 year",
    coverageDetails: "Hardware Replacement",
    terms: "Covers hardware defects.",
    description: "Covers hardware defects.",
    invoiceNo: "INV-2026-1251",
    purchasePrice: "₹1,800.00",
    vendor: "TP-Link India",
    location: "Chennai Warehouse",
    purchasedBy: "Priya",
  },
  {
    id: 8,
    productName: "India Gate Basmati Rice",
    serialNo: "SN0020008",
    customer: "Anjali Retail",
    purchaseDate: "05-Nov-2024",
    expiryDate: "05-Nov-2026",
    status: "Expired",
    sku: "IGBR-001",
    category: "Grocery",
    brand: "India Gate",
    model: "Basmati",
    configuration: "5kg Pack",
    condition: "New",
    warrantyType: "Limited",
    warrantyProvider: "India Gate",
    warrantyPeriod: "1 year",
    coverageDetails: "Quality Guarantee",
    terms: "Quality guarantee for packaged goods.",
    description: "Quality guarantee for packaged goods.",
    invoiceNo: "INV-2026-1252",
    purchasePrice: "₹650.00",
    vendor: "India Gate",
    location: "Delhi Warehouse",
    purchasedBy: "Anjali",
  },
];

export default function Warranty() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [warrantyType, setWarrantyType] = useState("All");
  const [category, setCategory] = useState("All");
  const [expiryDate, setExpiryDate] = useState("");
  const [view, setView] = useState("list");
  const [selectedWarranty, setSelectedWarranty] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e5fa5] border-t-transparent" />
      </div>
    );

  const totalPages = Math.ceil(warrantyData.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = warrantyData.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearch("");
    setWarrantyType("All");
    setCategory("All");
    setExpiryDate("");
    setCurrentPage(1);
  };

  const activeCount = warrantyData.filter((w) => w.status === "Active").length;
  const expiringCount = warrantyData.filter(
    (w) => w.status === "Expiring Soon",
  ).length;
  const expiredCount = warrantyData.filter(
    (w) => w.status === "Expired",
  ).length;

  if (view === "detail" && selectedWarranty) {
    return (
      <WarrantyDetailView
        warranty={selectedWarranty}
        onBack={() => {
          setView("list");
          setSelectedWarranty(null);
        }}
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1400px] mx-auto space-y-4"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <h1 className="text-[20px] font-bold text-slate-900">
          Manage All Warranties
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const headers = [
                "#",
                "Product Name",
                "Serial No",
                "Customer",
                "Purchase Date",
                "Expiry Date",
                "Status",
              ];
              const rows = warrantyData.map((row, i) => [
                i + 1,
                row.productName,
                row.serialNo,
                row.customer,
                row.purchaseDate,
                row.expiryDate,
                row.status,
              ]);
              const csv = [headers, ...rows]
                .map((r) =>
                  r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
                )
                .join("\n");
              const blob = new Blob(["\uFEFF" + csv], {
                type: "text/csv;charset=utf-8;",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "warranty-list.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" /> Export
            Excel
          </button>
          <button
            onClick={() => {
              const printWindow = window.open("", "_blank");
              const rows = warrantyData
                .map(
                  (row, i) => `
                <tr>
                  <td>${i + 1}</td><td>${row.productName}</td><td>${row.serialNo}</td>
                  <td>${row.customer}</td><td>${row.purchaseDate}</td><td>${row.expiryDate}</td><td>${row.status}</td>
                </tr>`,
                )
                .join("");
              printWindow.document
                .write(`<html><head><title>Warranty Report</title>
                <style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:12px}th{background:#1e5fa5;color:white}tr:nth-child(even){background:#f9f9f9}h1{color:#1e5fa5}</style></head>
                <body><h1>Warranty Report</h1><p>Date: ${new Date().toLocaleDateString()}</p>
                <table><thead><tr><th>#</th><th>Product Name</th><th>Serial No</th><th>Customer</th><th>Purchase Date</th><th>Expiry Date</th><th>Status</th></tr></thead>
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

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          icon={Shield}
          label="Total Warranties"
          value={warrantyData.length.toLocaleString()}
          tint="bg-blue-50 text-blue-600"
          delay={0}
        />
        <StatCard
          icon={CheckCircle2}
          label="Active"
          value={activeCount.toLocaleString()}
          tint="bg-emerald-50 text-emerald-600"
          delay={0.05}
        />
        <StatCard
          icon={AlertTriangle}
          label="Expiring Soon"
          value={expiringCount.toLocaleString()}
          tint="bg-amber-50 text-amber-600"
          delay={0.1}
        />
        <StatCard
          icon={XCircle}
          label="Expired"
          value={expiredCount.toLocaleString()}
          tint="bg-red-50 text-red-600"
          delay={0.15}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-3">
          <Field label="Search Product">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Name, SKU"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
          </Field>
          <Field label="Warranty Type">
            <Dropdown
              label={warrantyType}
              onChange={setWarrantyType}
              options={["All", "Standard", "Extended", "Limited"]}
            />
          </Field>
          <Field label="Category">
            <Dropdown
              label={category}
              onChange={setCategory}
              options={[
                "All",
                "Electronics",
                "Furnitures",
                "Accessories",
                "Hardwares",
                "Clothing",
                "Grocery",
              ]}
            />
          </Field>
          <Field label="Expiry Date">
            <div className="relative">
              <Calendar
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
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
            style={{
              background: `linear-gradient(135deg, ${ACCENT_2} 0%, ${ACCENT} 100%)`,
            }}
          >
            <Search size={13} /> Search
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg border border-slate-200/80 shadow-sm overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Products List
          </h3>
        </div>
        <div className="overflow-x-auto px-2 pb-2 pt-1">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-y border-slate-200/70 bg-slate-50/60">
                {[
                  "#",
                  "PRODUCT IMAGE",
                  "PRODUCT NAME",
                  "SERIAL NO",
                  "CUSTOMER",
                  "PURCHASE DATE",
                  "EXPIRY DATE",
                  "STOCK STATUS",
                  "ACTION",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-[9px] font-extrabold text-slate-600 uppercase tracking-wider text-left whitespace-nowrap"
                  >
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
                  <td className="px-3 py-2.5 text-[13px] font-bold text-slate-500">
                    {String(
                      (currentPage - 1) * ITEMS_PER_PAGE + idx + 1,
                    ).padStart(2, "0")}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0a57c4]/10 to-[#1e5fa5]/15 border border-[#1e5fa5]/10 flex items-center justify-center text-[#1e5fa5]">
                      <Box size={16} />
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[12px] font-semibold text-slate-800">
                    {row.productName}
                  </td>
                  <td className="px-3 py-2.5 text-[11px] font-bold text-slate-600 font-mono tracking-wide">
                    {row.serialNo}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] font-semibold text-slate-700">
                    {row.customer}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] font-semibold text-slate-600 whitespace-nowrap">
                    {row.purchaseDate}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] font-semibold text-slate-600 whitespace-nowrap">
                    {row.expiryDate}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${warrantyStatusBadge(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedWarranty(row);
                          setView("detail");
                        }}
                        className="w-6 h-6 rounded bg-blue-50 text-blue-500 border border-blue-200 flex items-center justify-center hover:bg-blue-100 transition-all"
                        title="View"
                      >
                        <Eye size={12} />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-sm text-slate-400 font-semibold"
                  >
                    No warranty records found.
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
              if (end - start + 1 < maxVisible)
                start = Math.max(1, end - maxVisible + 1);
              if (start > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className="w-8 h-8 rounded text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60 transition-all"
                  >
                    1
                  </button>,
                );
                if (start > 2)
                  pages.push(
                    <span
                      key="s-ellipsis"
                      className="text-slate-400 font-bold px-1"
                    >
                      ...
                    </span>,
                  );
              }
              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 rounded text-xs font-bold transition-all ${currentPage === i ? "text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60"}`}
                    style={
                      currentPage === i
                        ? {
                            background: `linear-gradient(135deg, ${ACCENT_2} 0%, ${ACCENT} 100%)`,
                          }
                        : undefined
                    }
                  >
                    {i}
                  </button>,
                );
              }
              if (end < totalPages) {
                if (end < totalPages - 1)
                  pages.push(
                    <span
                      key="e-ellipsis"
                      className="text-slate-400 font-bold px-1"
                    >
                      ...
                    </span>,
                  );
                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 rounded text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60 transition-all"
                  >
                    {totalPages}
                  </button>,
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
