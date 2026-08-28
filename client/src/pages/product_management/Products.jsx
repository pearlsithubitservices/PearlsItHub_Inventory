import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Eye,
  Plus,
  Tag,
  Box,
  Edit3,
  Settings,
  Bell,
  CheckCircle2,
  XCircle,
  Shapes,
  FileSpreadsheet,
  FileDown,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
} from "lucide-react";
import AddProductForm from "../../components/product_management/AddProductForm";
import ProductDetailView from "../../components/product_management/ProductDetailView";
import EditProductView from "../../components/product_management/EditProductView";

const ACCENT = "#1e5fa5";
const ACCENT_2 = "#0a57c4";
const ITEMS_PER_PAGE = 10;
const API_URL = "http://localhost:5000/api/products";

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 mb-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5fa5]/30 focus:border-[#1e5fa5]/30 focus:bg-white transition-all";

const Dropdown = ({ label, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleMouseMove = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative z-20 w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:border-slate-300 transition-colors"
      >
        <span className="truncate">{label}</span>

        <ChevronDown
          size={14}
          className={`text-slate-400 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
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

const statusBadge = (status) => {
  if (status === "active")
    return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  return "bg-red-100 text-red-600 border border-red-200";
};

const stockStatusBadge = (s) => {
  if (s === "In Stock")
    return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  if (s === "Low Stock")
    return "bg-amber-100 text-amber-700 border border-amber-200";
  return "bg-red-100 text-red-700 border border-red-200";
};

const categoryColors = {
  Electronics: "bg-blue-50 text-blue-700 border border-blue-200",
  Furnitures: "bg-amber-50 text-amber-700 border border-amber-200",
  Accessories: "bg-purple-50 text-purple-700 border border-purple-200",
  Hardwares: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Clothing: "bg-pink-50 text-pink-700 border border-pink-200",
  Grocery: "bg-orange-50 text-orange-700 border border-orange-200",
  "Spare Parts": "bg-cyan-50 text-cyan-700 border border-cyan-200",
};

const getStockStatus = (p) => {
  const stock = p.currentStock ?? p.stock ?? 0;
  if (stock === 0) return "Out of Stock";
  if (stock <= 10) return "Low Stock";
  return "In Stock";
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [brandFilter, setBrandFilter] = useState("All Brands");
  const [stockStatusFilter, setStockStatusFilter] = useState("All Status");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [view, setView] = useState("list");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", ITEMS_PER_PAGE);
      if (search) params.append("search", search);
      if (category !== "All Categories") params.append("category", category);
      if (statusFilter !== "All Status")
        params.append(
          "status",
          statusFilter === "Active" ? "active" : "inactive",
        );
      if (brandFilter !== "All Brands") params.append("brand", brandFilter);
      if (stockStatusFilter !== "All Status")
        params.append("stockStatus", stockStatusFilter);

      const token = getToken();
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.total || 0);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [
    search,
    category,
    statusFilter,
    brandFilter,
    stockStatusFilter,
    currentPage,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, statusFilter, brandFilter, stockStatusFilter]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setStatusFilter("All Status");
    setBrandFilter("All Brands");
    setStockStatusFilter("All Status");
    setCurrentPage(1);
  };

  const brandOptions = [
    "All Brands",
    ...Array.from(new Set(products.map((p) => p.brand).filter(Boolean))),
  ];

  const activeCount = products.filter((p) => p.status === "active").length;
  const inactiveCount = products.filter((p) => p.status === "inactive").length;
  const categoryCount = new Set(products.map((p) => p.category).filter(Boolean))
    .size;
  const totalUnits = products.reduce(
    (sum, p) => sum + (p.currentStock ?? p.stock ?? 0),
    0,
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-full py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e5fa5] border-t-transparent" />
      </div>
    );

  const content = () => {
    if (view === "detail" && selectedProduct) {
      return (
        <ProductDetailView
          product={selectedProduct}
          onBack={() => {
            setView("list");
            setSelectedProduct(null);
          }}
          onEdit={(p) => {
            setSelectedProduct(p);
            setView("edit");
          }}
          onDelete={(id) => {
            setProducts((prev) => prev.filter((p) => p._id !== id));
            setTotalProducts((t) => Math.max(0, t - 1));
          }}
        />
      );
    }
    if (view === "edit" && selectedProduct) {
      return (
        <EditProductView
          product={selectedProduct}
          onBack={() => {
            setView("list");
            setSelectedProduct(null);
            fetchProducts();
          }}
        />
      );
    }
    if (view === "add") {
      return (
        <AddProductForm
          onBack={() => {
            setView("list");
            fetchProducts();
          }}
          onProductAdded={(p) => {
            setProducts((prev) => [p, ...prev]);
            setTotalProducts((t) => t + 1);
          }}
        />
      );
    }

    return (
      <div>
        {/* <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Product Management</h1>
            <p className="text-[14px] text-slate-500 mt-1 font-medium">Manage all your products, stock items and inventory details</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 25px -10px rgba(10,37,64,0.5)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView("add")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow-md transition-all"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_2} 0%, ${ACCENT} 100%)`,
              }}
            >
              <Plus size={18} /> Add Product
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a57c4] to-[#1e5fa5] flex items-center justify-center shadow-md"
            >
              <Bell size={20} className="text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.06, rotate: 30 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a57c4] to-[#1e5fa5] flex items-center justify-center shadow-md"
            >
              <Settings size={20} className="text-white" />
            </motion.button>
          </div>
        </motion.div> */}

        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <h1 className="text-[20px] font-bold text-slate-900">
            Manage All Product
          </h1>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 20px -8px rgba(10,37,64,0.5)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView("add")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-[13px] font-semibold shadow-md transition-all"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_2} 0%, ${ACCENT} 100%)`,
              }}
            >
              <Plus size={15} /> Add Product
            </motion.button>
            <button
              onClick={() => {
                const headers = [
                  "#",
                  "Product Name",
                  "SKU",
                  "Category",
                  "Sub Category",
                  "Brand",
                  "Unit",
                  "Selling Price",
                  "Stock",
                  "Status",
                  "Stock Status",
                ];
                const rows = products.map((p, i) => [
                  i + 1,
                  p.name,
                  p.sku || p.barcode || "",
                  p.category,
                  p.subCategory || "",
                  p.brand || "",
                  p.unit || "",
                  p.sellingPrice || p.price || 0,
                  p.currentStock ?? p.stock ?? 0,
                  p.status === "active" ? "Active" : "Inactive",
                  getStockStatus(p),
                ]);
                const csv = [headers, ...rows]
                  .map((r) =>
                    r
                      .map((c) => `"${String(c).replace(/"/g, '""')}"`)
                      .join(","),
                  )
                  .join("\n");
                const blob = new Blob(["\uFEFF" + csv], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "products.csv";
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
                const rows = products
                  .map(
                    (p, i) => `
                  <tr>
                    <td>${i + 1}</td><td>${p.name}</td><td>${p.sku || p.barcode || ""}</td>
                    <td>${p.category}</td><td>${p.subCategory || ""}</td><td>${p.brand || ""}</td>
                    <td>${p.unit || ""}</td><td>₹${(p.sellingPrice || p.price || 0).toLocaleString()}</td>
                    <td>${p.currentStock ?? p.stock ?? 0}</td>
                    <td>${p.status === "active" ? "Active" : "Inactive"}</td><td>${getStockStatus(p)}</td>
                  </tr>`,
                  )
                  .join("");
                printWindow.document
                  .write(`<html><head><title>Products Report</title>
                  <style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:12px}th{background:#1e5fa5;color:white}tr:nth-child(even){background:#f9f9f9}h1{color:#1e5fa5}</style></head>
                  <body><h1>Products Report</h1><p>Date: ${new Date().toLocaleDateString()}</p>
                  <table><thead><tr><th>#</th><th>Name</th><th>SKU</th><th>Category</th><th>Sub Category</th><th>Brand</th><th>Unit</th><th>Price</th><th>Stock</th><th>Status</th><th>Stock Status</th></tr></thead>
                  <tbody>${rows}</tbody></table></body></html>`);
                printWindow.document.close();
                printWindow.print();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              <FileDown size={15} className="text-red-500" /> Export PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          <StatCard
            icon={PackageCheck}
            label="Total Product"
            value={`${totalProducts.toLocaleString()} Units`}
            tint="bg-blue-50 text-blue-600"
            delay={0.0}
          />
          <StatCard
            icon={CheckCircle2}
            label="Active Product"
            value={activeCount.toLocaleString()}
            tint="bg-emerald-50 text-emerald-600"
            delay={0.05}
          />
          <StatCard
            icon={XCircle}
            label="Inactive Product"
            value={inactiveCount.toLocaleString()}
            tint="bg-red-50 text-red-600"
            delay={0.1}
          />
          <StatCard
            icon={Shapes}
            label="Categories"
            value={categoryCount.toLocaleString()}
            tint="bg-purple-50 text-purple-600"
            delay={0.15}
          />
        </div>

        <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 mb-3">
            <Field label="Search Product">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Name, SKU"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${inputCls} pl-10`}
                />
              </div>
            </Field>
            <Field label="Category">
              <Dropdown
                label={category}
                onChange={setCategory}
                options={[
                  "All Categories",
                  "Electronics",
                  "Furnitures",
                  "Accessories",
                  "Hardwares",
                  "Clothing",
                  "Grocery",
                  "Spare Parts",
                ]}
              />
            </Field>
            <Field label="Status">
              <Dropdown
                label={statusFilter}
                onChange={setStatusFilter}
                options={["All Status", "Active", "Inactive"]}
              />
            </Field>
            <Field label="Brands">
              <Dropdown
                label={brandFilter}
                onChange={setBrandFilter}
                options={brandOptions}
              />
            </Field>
            <Field label="Stock Status">
              <Dropdown
                label={stockStatusFilter}
                onChange={setStockStatusFilter}
                options={[
                  "All Status",
                  "In Stock",
                  "Low Stock",
                  "Out of Stock",
                ]}
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
              style={{
                background: `linear-gradient(135deg, ${ACCENT_2} 0%, ${ACCENT} 100%)`,
              }}
            >
              <Search size={13} /> Search
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Products List
            </h3>
          </div>
          <div className="overflow-x-auto px-2 pb-2 pt-1">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-y border-slate-200/70 bg-slate-50/60">
                  {[
                    "#",
                    "PRODUCT IMAGE",
                    "PRODUCT NAME",
                    "SKU/CODE",
                    "CATEGORY",
                    "SUB CATEGORY",
                    "BRAND",
                    "UNIT",
                    "SELLING PRICE(RS)",
                    "STOCK QTY",
                    "STATUS",
                    "STOCK STATUS",
                    "ACTION",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-2 py-2.5 text-[9px] font-extrabold text-slate-600 uppercase tracking-wider text-left whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => {
                  const stock = p.currentStock ?? p.stock ?? 0;
                  const sStatus = getStockStatus(p);
                  return (
                    <tr
                      key={p._id || idx}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-2 py-2 text-[13px] font-bold text-slate-500">
                        {String(
                          (currentPage - 1) * ITEMS_PER_PAGE + idx + 1,
                        ).padStart(2, "0")}
                      </td>
                      <td className="px-2 py-2">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0a57c4]/10 to-[#1e5fa5]/15 border border-[#1e5fa5]/10 flex items-center justify-center text-[#1e5fa5]">
                          <Box size={16} />
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <span className="text-[13px] font-semibold text-slate-800">
                          {p.name}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="text-[12px] font-bold text-slate-600 font-mono tracking-wide">
                          {p.sku || p.barcode || "-"}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${categoryColors[p.category] || "bg-slate-100 text-slate-600 border border-slate-200"}`}
                        >
                          {p.category}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="text-[12px] font-semibold text-slate-600">
                          {p.subCategory || "-"}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="text-[12px] font-semibold text-slate-600">
                          {p.brand || "-"}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="text-[12px] font-bold text-slate-500">
                          {p.unit || "-"}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="text-[13px] font-extrabold text-slate-900">
                          ₹{(p.sellingPrice || p.price || 0).toLocaleString()}
                          .00
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span
                          className={`text-[13px] font-bold ${stock === 0 ? "text-red-500" : stock <= 10 ? "text-amber-500" : "text-slate-800"}`}
                        >
                          {stock}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge(p.status)}`}
                        >
                          {p.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold ${stockStatusBadge(sStatus)}`}
                        >
                          {sStatus}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedProduct(p);
                              setView("detail");
                            }}
                            className="w-6 h-6 rounded bg-blue-50 text-blue-500 border border-blue-200 flex items-center justify-center hover:bg-blue-100 transition-all"
                            title="View"
                          >
                            <Eye size={12} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedProduct(p);
                              setView("edit");
                            }}
                            className="w-6 h-6 rounded bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center hover:bg-amber-100 transition-all"
                            title="Edit"
                          >
                            <Edit3 size={12} />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={13}
                      className="px-4 py-8 text-center text-sm text-slate-400 font-semibold"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 pt-2 pb-4 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm font-semibold text-slate-500">
              Showing{" "}
              <span className="text-[#1e5fa5]">
                {products.length > 0
                  ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                  : 0}
                -{Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)}
              </span>{" "}
              of{" "}
              <span className="text-slate-800 font-bold">
                {totalProducts.toLocaleString()}
              </span>{" "}
              products
            </p>
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
                let start = Math.max(
                  1,
                  currentPage - Math.floor(maxVisible / 2),
                );
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={view + (selectedProduct ? selectedProduct._id : "")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {content()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
