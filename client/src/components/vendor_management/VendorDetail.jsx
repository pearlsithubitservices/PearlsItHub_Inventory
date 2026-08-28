import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Printer,
  Edit3,
  Trash2,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";
const ITEMS_PER_PAGE = 10;

export default function VendorDetail({ vendor, onBack, onEdit, onDelete }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchProduct, setSearchProduct] = useState("");
  const [searchSubCategory, setSearchSubCategory] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    if (activeTab === "products") {
      fetchPurchases();
    }
  }, [activeTab, currentPage]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", ITEMS_PER_PAGE);
      params.append("supplier", vendor._id);
      if (searchProduct) params.append("search", searchProduct);

      const res = await fetch(`${API_URL}/purchases?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success) {
        setPurchases(data.purchases || []);
        setTotalPages(data.pages || 1);
        setTotalItems(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch purchases:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPurchases();
  };

  const handleReset = () => {
    setSearchProduct("");
    setSearchSubCategory("");
    setSearchBrand("");
    setSearchDate("");
    setCurrentPage(1);
  };

  // Flatten purchase items for the table
  const getAllItems = () => {
    const items = [];
    purchases.forEach((purchase) => {
      if (purchase.items && purchase.items.length > 0) {
        purchase.items.forEach((item) => {
          items.push({
            _id: item._id,
            productName: item.product?.name || item.name || "-",
            sku: item.product?.sku || item.sku || "-",
            subCategory: item.product?.category || "-",
            brand: item.product?.brand || "-",
            unit: item.product?.unit || "NOS",
            lastPurchasePrice: item.unitPrice || 0,
            purchaseDate: purchase.orderDate || purchase.createdAt,
            totalPurchased: item.quantity || 0,
          });
        });
      }
    });
    return items;
  };

  const allItems = getAllItems();

  if (!vendor) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">No vendor data found</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-bold text-slate-900">
              {vendor.name}
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              GSTIN : {vendor.gstin || "-"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[12px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Printer size={14} />
              Print
            </button>
            {activeTab === "overview" && (
              <button
                onClick={() => onEdit && onEdit(vendor)}
                className="px-4 py-2 rounded-lg bg-[#1e5fa5] text-white text-[12px] font-semibold hover:bg-[#0a57c4] transition-colors flex items-center gap-2"
              >
                <Edit3 size={14} />
                Edit Product
              </button>
            )}
            <button
              onClick={() => onDelete && onDelete(vendor._id)}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-[12px] font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Trash2 size={14} />
              Remove
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[12px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-[13px] font-semibold transition-colors ${
            activeTab === "overview"
              ? "text-[#1e5fa5] border-b-2 border-[#1e5fa5]"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Vendor Overview
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 text-[13px] font-semibold transition-colors ${
            activeTab === "products"
              ? "text-[#1e5fa5] border-b-2 border-[#1e5fa5]"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Purchase Products
        </button>
      </div>

      {/* Vendor Overview Tab */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor Information */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-[13px] font-bold text-slate-900 mb-4">
                Vendor Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[12px] text-slate-500">
                    Vendor Name
                  </span>
                  <span className="text-[12px] font-semibold text-slate-900">
                    {vendor.name || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-slate-500">
                    Vendor Code
                  </span>
                  <span className="text-[12px] font-semibold text-slate-900">
                    {vendor.vendorCode || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-slate-500">
                    Contact Person
                  </span>
                  <span className="text-[12px] font-semibold text-slate-900">
                    {vendor.contactPerson || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-slate-500">Phone</span>
                  <span className="text-[12px] font-semibold text-slate-900">
                    {vendor.phone || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-slate-500">Email</span>
                  <span className="text-[12px] font-semibold text-slate-900">
                    {vendor.email || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Vendor Address */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-[13px] font-bold text-slate-900 mb-4">
                Vendor Address
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[12px] text-slate-500">Address</span>
                  <span className="text-[12px] font-semibold text-slate-900 text-right max-w-[60%]">
                    {vendor.address || vendor.addressLine1 || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-slate-500">
                    Address Line 2
                  </span>
                  <span className="text-[12px] font-semibold text-slate-900">
                    {vendor.addressLine2 || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-slate-500">City</span>
                  <span className="text-[12px] font-semibold text-slate-900">
                    {vendor.city || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-slate-500">State</span>
                  <span className="text-[12px] font-semibold text-slate-900">
                    {vendor.state || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-slate-500">PIN Code</span>
                  <span className="text-[12px] font-semibold text-slate-900">
                    {vendor.pinCode || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-[13px] font-bold text-slate-900 mb-4">
              Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-between">
                <span className="text-[12px] text-slate-500">
                  Payment Terms
                </span>
                <span className="text-[12px] font-semibold text-slate-900">
                  {vendor.paymentTerms || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-slate-500">Payment Mode</span>
                <span className="text-[12px] font-semibold text-slate-900">
                  {vendor.paymentMode || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-slate-500">Currency</span>
                <span className="text-[12px] font-semibold text-slate-900">
                  {vendor.currency || "INR"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-slate-500">Credit Limit</span>
                <span className="text-[12px] font-semibold text-slate-900">
                  {vendor.creditLimit || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-slate-500">Credit Days</span>
                <span className="text-[12px] font-semibold text-slate-900">
                  {vendor.creditDays || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-slate-500">
                  Exchange Rate
                </span>
                <span className="text-[12px] font-semibold text-slate-900">
                  {vendor.exchangeRate || "1.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-[13px] font-bold text-slate-900 mb-4">
              Bank Details
            </h3>
            {vendor.bankDetails && vendor.bankDetails.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                        Bank Name
                      </th>
                      <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                        Account Holder Name
                      </th>
                      <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                        Account Number
                      </th>
                      <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                        IFSC Code
                      </th>
                      <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                        Branch
                      </th>
                      <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                        Account Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendor.bankDetails.map((bank, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-[12px] text-slate-900">
                          {bank.bankName || "-"}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-900">
                          {bank.accountHolderName || "-"}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-900">
                          {bank.accountNumber || "-"}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-900">
                          {bank.ifscCode || "-"}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-900">
                          {bank.branch || "-"}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-900">
                          {bank.accountType || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[12px] text-slate-400 text-center py-4">
                No bank details available
              </p>
            )}
          </div>
        </>
      )}

      {/* Purchase Products Tab */}
      {activeTab === "products" && (
        <>
          {/* Search Filters */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                  Search Product
                </label>
                <input
                  type="text"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  placeholder="Name, SKU"
                  className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                  Sub Category
                </label>
                <select
                  value={searchSubCategory}
                  onChange={(e) => setSearchSubCategory(e.target.value)}
                  className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
                >
                  <option value="">All</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Monitors">Monitors</option>
                  <option value="Storage">Storage</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                  Brands
                </label>
                <select
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                  className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
                >
                  <option value="">All</option>
                  <option value="Dell">Dell</option>
                  <option value="HP">HP</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="Samsung">Samsung</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                  Last Purchase Date
                </label>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
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

          {/* Products List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
              <h3 className="text-[14px] font-bold text-slate-900">
                Products List
              </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#1e5fa5] border-t-transparent" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                          PRODUCT NAME
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                          SKU/CODE
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                          SUB CATEGORY
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                          BRAND
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                          UNIT
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">
                          LAST PURCHASE PRICE
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                          PURCHASE DATE
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">
                          TOTAL PURCHASED
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allItems.length > 0 ? (
                        allItems.map((item, idx) => (
                          <tr
                            key={item._id || idx}
                            className="border-b border-slate-100 hover:bg-slate-50"
                          >
                            <td className="px-4 py-3 text-center text-[12px] text-slate-600">
                              {String(
                                (currentPage - 1) * ITEMS_PER_PAGE + idx + 1,
                              ).padStart(2, "0")}
                            </td>
                            <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">
                              {item.productName}
                            </td>
                            <td className="px-4 py-3 text-[12px] text-slate-600">
                              {item.sku}
                            </td>
                            <td className="px-4 py-3 text-[12px] text-slate-600">
                              {item.subCategory}
                            </td>
                            <td className="px-4 py-3 text-[12px] text-slate-600">
                              {item.brand}
                            </td>
                            <td className="px-4 py-3 text-[12px] text-slate-600">
                              {item.unit}
                            </td>
                            <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">
                              ₹{item.lastPurchasePrice.toLocaleString("en-IN")}
                            </td>
                            <td className="px-4 py-3 text-[12px] text-slate-600">
                              {item.purchaseDate
                                ? new Date(
                                    item.purchaseDate,
                                  ).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "-"}
                            </td>
                            <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">
                              {item.totalPurchased}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={9}
                            className="px-6 py-12 text-center text-[13px] text-slate-400"
                          >
                            No products found for this vendor
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
                      {allItems.length > 0
                        ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                        : 0}
                      -{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                    </span>{" "}
                    of{" "}
                    <span className="text-slate-800 font-bold">
                      {totalItems}
                    </span>{" "}
                    products
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

                      if (end < totalPages) {
                        if (end < totalPages - 1) {
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
                            key={totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all"
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
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
