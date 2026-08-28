import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Plus,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  XCircle,
  Archive,
  Edit3,
  Trash2,
  ShoppingCart,
  DollarSign,
  FileText,
} from "lucide-react";
import ProductDetailView from "../../components/stock_management/StockDetailView";
import AddStock from "../../components/stock_management/AddStock";
import EditStock from "../../components/stock_management/EditStock";

const ACCENT = "#1e5fa5";
const ACCENT_2 = "#0a57c4";
const API_URL = "http://localhost:5000/api";
const ITEMS_PER_PAGE = 10;

const StatCard = ({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
  >
    <div className="flex items-start gap-3">
      <div
        className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={20} strokeWidth={2.5} className={iconColor} />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-slate-500 mb-0.5 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-[20px] font-bold text-slate-900">{value}</p>
      </div>
    </div>
  </motion.div>
);

const Dropdown = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 text-[13px] font-medium text-slate-700 hover:border-slate-300 transition-colors flex items-center justify-between"
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [warehouseFilter, setWarehouseFilter] = useState("All Brands");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedTab, setSelectedTab] = useState("Stock List");
  const [viewProductId, setViewProductId] = useState(null);
  const [view, setView] = useState("list");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", ITEMS_PER_PAGE);
      if (searchTerm) params.append("search", searchTerm);
      if (categoryFilter !== "All Categories")
        params.append("category", categoryFilter);

      const token = getToken();
      const res = await fetch(`${API_URL}/products?${params.toString()}`, {
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
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Calculate statistics
  const totalStock = products.reduce(
    (sum, p) => sum + (p.currentStock ?? p.stock ?? 0),
    0,
  );
  const availableStock = products.reduce((sum, p) => {
    const stock = p.currentStock ?? p.stock ?? 0;
    return stock > 0 ? sum + stock : sum;
  }, 0);
  const outOfStockItems = products.filter(
    (p) => (p.currentStock ?? p.stock ?? 0) === 0,
  ).length;
  const lowStockItems = products.filter((p) => {
    const stock = p.currentStock ?? p.stock ?? 0;
    const reorder = p.reorderLevel || p.minStock || 10;
    return stock > 0 && stock <= reorder;
  }).length;
  const reservedStock = 200; // Placeholder
  const totalValue = products.reduce((sum, p) => {
    const stock = p.currentStock ?? p.stock ?? 0;
    const price = p.sellingPrice || p.price || 0;
    return sum + stock * price;
  }, 0);

  const getStockStatus = (stock, reorder = 10) => {
    if (stock === 0)
      return {
        label: "Out of Stock",
        dotColor: "bg-red-500",
        textColor: "text-red-600",
      };
    if (stock <= reorder)
      return {
        label: "Low Stock",
        dotColor: "bg-orange-500",
        textColor: "text-orange-600",
      };
    return {
      label: "In Stock",
      dotColor: "bg-emerald-500",
      textColor: "text-emerald-600",
    };
  };

  // Filter products based on selected tab
  const filteredProducts = products.filter((product) => {
    const stock = product.currentStock ?? product.stock ?? 0;
    const reorderLevel = product.reorderLevel || product.minStock || 10;

    if (selectedTab === "Stock List") return true;
    if (selectedTab === "Low Stocks") return stock > 0 && stock <= reorderLevel;
    if (selectedTab === "Out of Stock") return stock === 0;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e5fa5] border-t-transparent" />
      </div>
    );
  }

  // Show add stock form
  if (view === "add") {
    return (
      <AddStock
        onBack={() => setView("list")}
        onStockAdded={(entry) => {
          console.log("Stock entry added:", entry);
          setView("list");
          fetchProducts();
        }}
      />
    );
  }

  // Show edit stock form
  if (view === "edit" && selectedProduct) {
    return (
      <EditStock
        product={selectedProduct}
        onBack={() => {
          setView("list");
          setSelectedProduct(null);
          fetchProducts();
        }}
        onStockUpdated={(updated) => {
          setView("list");
          setSelectedProduct(null);
          fetchProducts();
        }}
      />
    );
  }

  // Show product detail view if a product is selected
  if (viewProductId) {
    return (
      <ProductDetailView
        productId={viewProductId}
        onBack={() => setViewProductId(null)}
      />
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-slate-900">
          Manage All Stocks
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("add")}
            className="px-4 py-2 rounded-lg text-white text-[13px] font-semibold shadow-md transition-all"
            style={{
              background: `linear-gradient(135deg, ${ACCENT_2} 0%, ${ACCENT} 100%)`,
            }}
          >
            <Plus size={15} className="inline mr-1" />
            Add Stock
          </button>
          <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
            <FileText size={15} className="text-blue-600" />
            Export Excel
          </button>
          <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
            <FileText size={15} className="text-red-600" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Statistics Cards - 6 cards in 2 rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1 */}
        <StatCard
          icon={Package}
          label="Total Stock"
          value={`${totalStock} Nos`}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          delay={0}
        />
        <StatCard
          icon={Archive}
          label="Available Stock"
          value={`${availableStock} Nos`}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          delay={0.05}
        />
        <StatCard
          icon={XCircle}
          label="Out of Stock"
          value={`${outOfStockItems} Nos`}
          iconBg="bg-red-50"
          iconColor="text-red-600"
          delay={0.1}
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={`${lowStockItems} Nos`}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Row 2 */}
        <StatCard
          icon={ShoppingCart}
          label="Reserved Stock"
          value={`${reservedStock} Nos`}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          delay={0.2}
        />
        <StatCard
          icon={DollarSign}
          label="Stock Value"
          value={`${totalValue.toLocaleString("en-IN")}`}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          delay={0.25}
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
              Search Product
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search SKU"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white border border-slate-200 text-[13px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
              Category
            </label>
            <Dropdown
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                "All Categories",
                "Electronics",
                "Furnitures",
                "Accessories",
                "Hardwares",
                "Clothing",
              ]}
              placeholder="All Categories"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
              Status
            </label>
            <Dropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={["All Status", "In Stock", "Low Stock", "Out of Stock"]}
              placeholder="All Status"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
              Warehouse
            </label>
            <Dropdown
              value={warehouseFilter}
              onChange={setWarehouseFilter}
              options={["All Brands", "Main Warehouse", "Regional Warehouse"]}
              placeholder="All Brands"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("All Categories");
              setStatusFilter("All Status");
              setWarehouseFilter("All Brands");
            }}
            className="px-5 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold hover:bg-slate-200 transition-colors"
          >
            Reset
          </button>
          <button className="px-6 py-2.5 rounded-lg bg-[#1e5fa5] text-white text-[13px] font-semibold hover:bg-[#0a57c4] transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 pt-4 border-b border-slate-200">
          {["Stock List", "Low Stocks", "Out of Stock"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`pb-3 text-[13px] font-semibold transition-colors relative ${
                selectedTab === tab
                  ? "text-[#1e5fa5]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
              {selectedTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e5fa5]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Product Image
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  SKU Code
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Qty Added
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Reserved
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Reorder Level
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Stock Status
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Stock Value($)
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, idx) => {
                const stock = product.currentStock ?? product.stock ?? 0;
                const reorderLevel =
                  product.reorderLevel || product.minStock || 10;
                const status = getStockStatus(stock, reorderLevel);
                const price = product.sellingPrice || product.price || 0;
                const stockValue = (stock * price).toFixed(2);

                return (
                  <tr
                    key={product._id || idx}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-[12px] font-semibold text-slate-600">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} className="text-slate-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-slate-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-mono text-slate-600">
                      {product.sku || product.barcode || "-"}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">
                      {product.warehouseLocation || "Main Warehouse"}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">
                      {stock}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">
                      {stock}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">0</td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">
                      {reorderLevel}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${status.dotColor}`}
                        />
                        <span
                          className={`text-[11px] font-semibold ${status.textColor}`}
                        >
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">
                      ${stockValue}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewProductId(product._id)}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                        >
                          <Eye size={14} className="text-slate-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setView("edit");
                          }}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                        >
                          <Edit3 size={14} className="text-slate-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-end">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => i + 1,
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-[12px] font-semibold transition-all ${
                  currentPage === page
                    ? "bg-[#1e5fa5] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-2 text-[12px] text-slate-500">...</span>
            <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
              {totalPages}
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Stock Summary by Warehouse */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-300 shadow-md overflow-hidden">
        <div className="px-6 py-3 bg-white border-b-2 border-slate-200">
          <h3 className="text-[15px] font-bold text-slate-800">
            Stock Summary by Warehouse
          </h3>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Warehouse
                  </th>
                  <th className="px-6 py-3 text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    On Hand
                  </th>
                  <th className="px-6 py-3 text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Reserved
                  </th>
                  <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Stock Value($)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-700">
                    Main Warehouse
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] text-slate-600">
                    7,500
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] text-slate-600">
                    7,000
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] text-slate-600">
                    500
                  </td>
                  <td className="px-6 py-4 text-right text-[13px] font-medium text-slate-700">
                    ₹ 85,00,000.00
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-700">
                    Secondary Warehouse
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] text-slate-600">
                    1,000
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] text-slate-600">
                    1,000
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] text-slate-600">
                    93
                  </td>
                  <td className="px-6 py-4 text-right text-[13px] font-medium text-slate-700">
                    ₹ 74,00,000.00
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-700">
                    Branch A
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] text-slate-600">
                    2,393
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] text-slate-600">
                    2,300
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] text-slate-600">
                    93
                  </td>
                  <td className="px-6 py-4 text-right text-[13px] font-medium text-slate-700">
                    ₹ 84,50,000.00
                  </td>
                </tr>
                <tr className="bg-slate-50 border-t-2 border-slate-300">
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-900">
                    TOTAL
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] font-bold text-slate-900">
                    12,000
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] font-bold text-slate-900">
                    11,00
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] font-bold text-slate-900">
                    320
                  </td>
                  <td className="px-6 py-4 text-right text-[13px] font-bold text-slate-900">
                    ₹ 1,48,00,000.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
