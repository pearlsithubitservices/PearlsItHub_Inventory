import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Users,
  UserCheck,
  UserX,
  DollarSign,
  Search,
  RotateCcw,
  Plus,
  Eye,
  Edit3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AddVendor from "../../components/vendor_management/AddVendor";
import VendorDetail from "../../components/vendor_management/VendorDetail";
import EditVendor from "../../components/vendor_management/EditVendor";

const API_URL = "http://localhost:5000/api";
const ITEMS_PER_PAGE = 10;

const StatCard = ({ icon: Icon, label, value, iconBg, iconColor, delay = 0 }) => (
  <div
    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} strokeWidth={2.5} className={iconColor} />
      </div>
      <div>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-[20px] font-bold text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchGSTIN, setSearchGSTIN] = useState("");
  const [view, setView] = useState("list");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({
    totalVendors: 0,
    activeVendors: 0,
    inactiveVendors: 0,
    totalPayables: 0,
  });

  const getToken = () => localStorage.getItem("token");

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", ITEMS_PER_PAGE);
      if (searchName) params.append("search", searchName);
      if (searchGSTIN) params.append("gstin", searchGSTIN);

      const res = await fetch(`${API_URL}/suppliers?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success) {
        setVendors(data.suppliers || []);
        setTotalPages(data.pages || 1);
        setTotalItems(data.total || 0);
        setStats(data.stats || {
          totalVendors: 0,
          activeVendors: 0,
          inactiveVendors: 0,
          totalPayables: 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchName, searchGSTIN]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, searchGSTIN]);

  const handleSearch = () => {
    fetchVendors();
  };

  const handleReset = () => {
    setSearchName("");
    setSearchGSTIN("");
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "inactive":
        return "bg-red-100 text-red-700";
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
          Manage All Vendors
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("add")}
            className="px-4 py-2 rounded-lg bg-[#1e5fa5] text-white text-[12px] font-semibold hover:bg-[#0a57c4] transition-colors flex items-center gap-2"
          >
            <Plus size={14} />
            Add Vendor
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
          icon={Users}
          label="TOTAL VENDORS"
          value={stats.totalVendors}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          delay={0}
        />
        <StatCard
          icon={UserCheck}
          label="ACTIVE VENDORS"
          value={stats.activeVendors}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          delay={0.05}
        />
        <StatCard
          icon={UserX}
          label="INACTIVE VENDORS"
          value={stats.inactiveVendors}
          iconBg="bg-red-50"
          iconColor="text-red-600"
          delay={0.1}
        />
        <StatCard
          icon={DollarSign}
          label="TOTAL PAYABLES"
          value={vendors.filter((v) => v.payable > 0).length}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          delay={0.15}
        />
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
              Search Vendors
            </label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter name to search"
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
              GSTIN
            </label>
            <input
              type="text"
              value={searchGSTIN}
              onChange={(e) => setSearchGSTIN(e.target.value)}
              placeholder="Enter GSTIN"
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[12px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-lg bg-[#1e5fa5] text-white text-[12px] font-semibold hover:bg-[#0a57c4] transition-colors flex items-center gap-2"
            >
              <Search size={14} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Vendor List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
          <h3 className="text-[14px] font-bold text-slate-900">
            Vendor List
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
                  VENDOR NAME
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  CONTACT PERSON
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  PHONE
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  EMAIL
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  GSTIN
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">
                  PAYABLE (₹)
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase">
                  STOCK STATUS
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {vendors.length > 0 ? (
                vendors.map((vendor, idx) => (
                  <tr
                    key={vendor._id || idx}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-center text-[12px] text-slate-600">
                      {String((currentPage - 1) * ITEMS_PER_PAGE + idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">
                      {vendor.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-700">
                      {vendor.contactPerson || "-"}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">
                      {vendor.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">
                      {vendor.email || "-"}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">
                      {vendor.gstin || "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">
                      ₹{(vendor.payable || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${getStatusStyle(
                          vendor.status
                        )}`}
                      >
                        {vendor.status ? vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1) : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setView("detail");
                          }}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                        >
                          <Eye size={13} className="text-slate-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVendor(vendor);
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
                  <td colSpan={9} className="px-6 py-12 text-center text-[13px] text-slate-400">
                    No vendors found
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
              {vendors.length > 0
                ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                : 0}
              -{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
            </span>{" "}
            of{" "}
            <span className="text-slate-800 font-bold">
              {totalItems}
            </span>{" "}
            vendors
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
              let end = Math.min(totalPages, start + maxVisible - 1);
              if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

              if (start > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    1
                  </button>
                );
                if (start > 2) {
                  pages.push(
                    <span key="s-ellipsis" className="px-2 text-[11px] text-slate-500">...</span>
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
                  </button>
                );
              }

              if (end < totalPages) {
                if (end < totalPages - 1) {
                  pages.push(
                    <span key="e-ellipsis" className="px-2 text-[11px] text-slate-500">...</span>
                  );
                }
                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    {totalPages}
                  </button>
                );
              }

              return pages;
            })()}
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
        </>
      )}

      {/* Add Vendor View */}
      {view === "add" && (
        <AddVendor
          onBack={() => {
            setView("list");
            fetchVendors();
          }}
          onSave={(newVendor) => {
            setVendors((prev) => [newVendor, ...prev]);
            setView("list");
            fetchVendors();
          }}
        />
      )}

      {/* Vendor Detail View */}
      {view === "detail" && selectedVendor && (
        <VendorDetail
          vendor={selectedVendor}
          onBack={() => {
            setView("list");
            setSelectedVendor(null);
            fetchVendors();
          }}
          onEdit={(v) => {
            setSelectedVendor(v);
            setView("edit");
          }}
          onDelete={async (id) => {
            if (confirm("Are you sure you want to delete this vendor?")) {
              try {
                const token = getToken();
                await fetch(`${API_URL}/suppliers/${id}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                });
                setVendors((prev) => prev.filter((v) => v._id !== id));
                setView("list");
                setSelectedVendor(null);
                fetchVendors();
              } catch (err) {
                console.error("Failed to delete vendor:", err);
              }
            }
          }}
        />
      )}

      {/* Edit Vendor View */}
      {view === "edit" && selectedVendor && (
        <EditVendor
          vendor={selectedVendor}
          onBack={() => {
            setView("list");
            setSelectedVendor(null);
            fetchVendors();
          }}
          onSave={(updatedVendor) => {
            setVendors((prev) =>
              prev.map((v) => (v._id === updatedVendor._id ? updatedVendor : v))
            );
            setView("list");
            setSelectedVendor(null);
            fetchVendors();
          }}
        />
      )}
    </div>
  );
}
