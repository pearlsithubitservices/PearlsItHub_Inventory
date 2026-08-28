import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Package,
  CheckCircle,
  DollarSign,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PurchaseOrderDetail from "../../components/purchase_management/PurchaseOrderDetail";
import EditPurchaseOrder from "../../components/purchase_management/EditPurchaseOrder";

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
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={18} strokeWidth={2.5} className={iconColor} />
      </div>
      <div>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-[20px] font-bold text-slate-900">{value}</p>
      </div>
    </div>
  </motion.div>
);

export default function PurchaseOrders() {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchPO, setSearchPO] = useState("");
  const [vendor, setVendor] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [view, setView] = useState("list");
  const [selectedPO, setSelectedPO] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const fetchPurchaseOrders = useCallback(async () => {
    try {
      const token = getToken();
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", ITEMS_PER_PAGE);
      if (searchPO) params.append("search", searchPO);
      if (vendor) params.append("supplier", vendor);
      if (statusFilter !== "All Status") params.append("status", statusFilter.toLowerCase());
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const res = await fetch(`${API_URL}/purchases?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success) {
        setPurchaseOrders(data.purchases || []);
        setTotalPages(data.pages || 1);
        setTotalItems(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch purchase orders:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchPO, vendor, statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchPO, vendor, statusFilter, dateFrom, dateTo]);

  // Use API data
  const displayData = purchaseOrders;
  const displayTotal = totalItems;
  const displayTotalPages = totalPages;

  // Calculate stats from API data
  const totalPOs = totalItems;
  const orderedPOs = purchaseOrders.filter((po) => po.status?.toLowerCase() === "ordered").length;
  const receivedPOs = purchaseOrders.filter((po) => po.status?.toLowerCase() === "received" || po.status?.toLowerCase() === "completed").length;
  const totalOrderValue = purchaseOrders.reduce((sum, po) => sum + (po.totalAmount || 0), 0);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "received":
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "ordered":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e5fa5] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      {/* Header */}
      {view === "list" && (
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-bold text-slate-900">
          Purchase Orders
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/add-order")}
            className="px-4 py-2 rounded-lg bg-[#1e5fa5] text-white text-[12px] font-semibold hover:bg-[#0a57c4] transition-colors flex items-center gap-2"
          >
            <Plus size={14} />
            Add Order
          </button>
          <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[12px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
            <FileText size={14} className="text-emerald-600" />
            Export Excel
          </button>
          <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[12px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
            <FileText size={14} className="text-red-600" />
            Export PDF
          </button>
        </div>
      </div>
      )}

      {/* List View */}
      {view === "list" && (
        <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="TOTAL POS"
          value={totalPOs}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          delay={0}
        />
        <StatCard
          icon={Package}
          label="ORDERED"
          value={String(orderedPOs).padStart(2, "0")}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          delay={0.05}
        />
        <StatCard
          icon={CheckCircle}
          label="RECEIVED"
          value={String(receivedPOs).padStart(2, "0")}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          delay={0.1}
        />
        <StatCard
          icon={DollarSign}
          label="ORDER VALUE"
          value={`1,24,5,000`}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          delay={0.15}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-1.5">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[12px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-1.5">
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[12px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-1.5">
              Search PO Number
            </label>
            <input
              type="text"
              value={searchPO}
              onChange={(e) => setSearchPO(e.target.value)}
              placeholder="Enter PO Number"
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[12px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-1.5">
              Vendor
            </label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="Enter Vendor"
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[12px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-1.5">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option>All Status</option>
              <option>Received</option>
              <option>Pending</option>
              <option>Ordered</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-end justify-end gap-2">
            <button
              onClick={() => {
                setDateFrom("");
                setDateTo("");
                setSearchPO("");
                setVendor("");
                setStatusFilter("All Status");
              }}
              className="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 text-[12px] font-semibold hover:bg-slate-200 transition-colors"
            >
              Reset
            </button>
            <button className="px-6 py-2 rounded-lg bg-[#1e5fa5] text-white text-[12px] font-semibold hover:bg-[#0a57c4] transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Purchase Orders List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
          <h3 className="text-[14px] font-bold text-slate-900">
            Purchase Orders List
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase">
                  #
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  PO NUMBER
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  VENDOR
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  PO DATE
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  EXPECTED DELIVERY
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase">
                  ITEMS
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  TOTAL QUANTITY
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">
                  TOTAL AMOUNT(₹)
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  Created By
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase">
                  STATUS
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.length > 0 ? (
                displayData.map((po, idx) => (
      <tr
        key={po._id || idx}
        className="border-b border-slate-100 hover:bg-slate-50"
      >
        <td className="px-4 py-3 text-center text-[12px] text-slate-600">
          {String(
            (currentPage - 1) * ITEMS_PER_PAGE + idx + 1
          ).padStart(2, "0")}
        </td>

        <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">
          {po.poNumber || po.referenceNo || "-"}
        </td>

        <td className="px-4 py-3 text-[12px] text-slate-700">
          {po.supplier?.name || po.vendor || "-"}
        </td>

        <td className="px-4 py-3 text-[12px] text-slate-600">
          {po.poDate
            ? new Date(po.poDate).toLocaleDateString()
            : "-"}
        </td>

        <td className="px-4 py-3 text-[12px] text-slate-600">
          {po.expectedDelivery
            ? new Date(po.expectedDelivery).toLocaleDateString()
            : "-"}
        </td>

        <td className="px-4 py-3 text-center text-[12px] font-medium text-slate-900">
          {po.items?.length || po.totalItems || 0}
        </td>

        <td className="px-4 py-3 text-[12px] text-slate-600">
          {po.totalQuantity || "-"}
        </td>

        <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">
          ₹{(po.totalAmount || 0).toLocaleString("en-IN")}
        </td>

        <td className="px-4 py-3 text-[12px] text-slate-600">
          {po.createdBy?.name || po.createdBy || "-"}
        </td>

        <td className="px-4 py-3 text-center">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${getStatusStyle(
              po.status
            )}`}
          >
            {po.status ? po.status.charAt(0).toUpperCase() + po.status.slice(1) : "Pending"}
          </span>
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => {
                setSelectedPO(po);
                setView("detail");
              }}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <Eye size={13} className="text-slate-600" />
            </button>

            <button
              onClick={() => {
                setSelectedPO(po);
                setView("edit");
              }}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <Edit3 size={13} className="text-slate-600" />
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan={11}
        className="px-6 py-12 text-center text-[13px] text-slate-400"
      >
        No purchase orders found
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[12px] font-semibold text-slate-500">
            Showing{" "}
            <span className="text-[#1e5fa5]">
              {displayData.length > 0
                ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                : 0}
              -{Math.min(currentPage * ITEMS_PER_PAGE, displayTotal)}
            </span>{" "}
            of{" "}
            <span className="text-slate-800 font-bold">
              {displayTotal}
            </span>{" "}
            orders
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            {(() => {
              const pages = [];
              const maxVisible = 5;
              let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              let end = Math.min(displayTotalPages, start + maxVisible - 1);
              if (end - start + 1 < maxVisible)
                start = Math.max(1, end - maxVisible + 1);

              if (start > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    1
                  </button>,
                );
                if (start > 2) {
                  pages.push(
                    <span
                      key="s-ellipsis"
                      className="px-2 text-[11px] text-slate-500"
                    >
                      ...
                    </span>,
                  );
                }
              }

              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 rounded-lg text-[11px] font-semibold transition-all ${
                      currentPage === i
                        ? "bg-[#1e5fa5] text-white"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {i}
                  </button>,
                );
              }

              if (end < displayTotalPages) {
                if (end < displayTotalPages - 1) {
                  pages.push(
                    <span
                      key="e-ellipsis"
                      className="px-2 text-[11px] text-slate-500"
                    >
                      ...
                    </span>,
                  );
                }
                pages.push(
                  <button
                    key={displayTotalPages}
                    onClick={() => setCurrentPage(displayTotalPages)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    {displayTotalPages}
                  </button>,
                );
              }

              return pages;
            })()}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(displayTotalPages, p + 1))
              }
              disabled={currentPage === displayTotalPages}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Purchase Order Detail View */}
      {view === "detail" && selectedPO && (
        <PurchaseOrderDetail
          order={selectedPO}
          onBack={() => {
            setView("list");
            setSelectedPO(null);
          }}
        />
      )}

      {/* Purchase Order Edit View */}
      {view === "edit" && selectedPO && (
        <EditPurchaseOrder
          order={selectedPO}
          onBack={() => {
            setView("list");
            setSelectedPO(null);
            fetchPurchaseOrders();
          }}
          onSave={(updatedOrder) => {
            console.log("Saved:", updatedOrder);
            setView("list");
            setSelectedPO(null);
            fetchPurchaseOrders();
          }}
        />
      )}
    </div>
  );
}
