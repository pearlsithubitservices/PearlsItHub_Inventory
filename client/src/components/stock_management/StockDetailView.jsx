import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Package, Download } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5000/api";

export default function ProductDetailView({ productId, onBack }) {
  const [product, setProduct] = useState(null);
  const [warehouseStock, setWarehouseStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    if (!productId) {
      setError("No product ID provided");
      setLoading(false);
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const token = getToken();
        const url = `${API_URL}/products/stock/${productId}`;
        console.log("Fetching product from:", url);
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Response data:", data);
        if (res.ok && data.success) {
          setProduct(data.product);
          setWarehouseStock(data.warehouseStock || []);
        } else {
          const errorMsg = data.message || "Product not found";
          console.error("Failed to fetch product:", errorMsg);
          setError(errorMsg);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e5fa5] border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-32">
        <p className="text-slate-500">{error || "Product not found"}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded bg-[#1e5fa5] text-white text-sm font-semibold hover:bg-[#0a57c4] transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const stock = product.currentStock ?? product.stock ?? 0;

  return (
    <div className="max-w-[1400px] mx-auto space-y-3">
      {/* Product Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 mb-0.5">
              {product.name}
            </h1>
            <p className="text-xs text-slate-500">
              SKU: {product.sku || product.barcode || "N/A"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5">
              <Download size={12} />
              print
            </button>
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={12} />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
        <div className="flex gap-6">
          {/* Left Column - Product Images */}
          <div className="flex-shrink-0" style={{ width: "240px" }}>
            {/* Main Image */}
            <div className="aspect-square rounded bg-slate-50 border border-slate-200 overflow-hidden mb-2">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={56} className="text-slate-300" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded bg-slate-50 border border-slate-200 overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
                >
                  {product.imageUrl && i === 1 ? (
                    <img
                      src={product.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={16} className="text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-3 content-start">
            <div>
              <p className="text-[9px] font-semibold text-slate-500 mb-0.5">
                Product name
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {product.name}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-slate-500 mb-0.5">
                Barcode
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {product.barcode || product.productId || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-slate-500 mb-0.5">
                SKU / Code
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {product.sku || "DL-1001"}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-slate-500 mb-0.5">
                Category
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {product.category || "Electronics"}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-slate-500 mb-0.5">
                Sub Category
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {product.subCategory || "Laptops"}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-slate-500 mb-0.5">
                Unit of Measurement
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {product.unit || "Nos"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Wise Stock Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">
            Warehouse Wise Stock
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-2 text-left text-[9px] font-bold text-slate-600 uppercase">
                  Warehouse
                </th>
                <th className="px-4 py-2 text-left text-[9px] font-bold text-slate-600 uppercase">
                  Racks ID, Shelf ID
                </th>
                <th className="px-4 py-2 text-center text-[9px] font-bold text-slate-600 uppercase">
                  On Hand
                </th>
                <th className="px-4 py-2 text-center text-[9px] font-bold text-slate-600 uppercase">
                  Available
                </th>
                <th className="px-4 py-2 text-center text-[9px] font-bold text-slate-600 uppercase">
                  Reserved
                </th>
                <th className="px-4 py-2 text-center text-[9px] font-bold text-slate-600 uppercase">
                  Reorder Level
                </th>
                <th className="px-4 py-2 text-right text-[9px] font-bold text-slate-600 uppercase">
                  Stock Value($)
                </th>
                <th className="px-4 py-2 text-center text-[9px] font-bold text-slate-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-[9px] font-bold text-slate-600 uppercase">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {warehouseStock.length > 0 ? (
                warehouseStock.map((ws, idx) => {
                  const quantity = ws.quantity || 0;
                  const price = product.sellingPrice || product.price || 0;
                  const value = (quantity * price).toFixed(2);
                  const statusColor =
                    quantity === 0
                      ? "bg-red-100 text-red-700"
                      : quantity <= 10
                        ? "bg-orange-100 text-orange-700"
                        : "bg-emerald-100 text-emerald-700";
                  const statusLabel =
                    quantity === 0 ? "Out" : quantity <= 10 ? "Low" : "Active";

                  return (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="px-4 py-2 text-sm font-medium text-slate-900">
                        {ws.warehouse?.name || "Main Warehouse"}
                      </td>
                      <td className="px-4 py-2 text-sm text-slate-600">
                        {ws.aisle || "A-05"}, {ws.shelf || "Shelf-01"}
                      </td>
                      <td className="px-4 py-2 text-center text-sm font-medium text-slate-900">
                        {quantity}
                      </td>
                      <td className="px-4 py-2 text-center text-sm text-slate-600">
                        {quantity}
                      </td>
                      <td className="px-4 py-2 text-center text-sm text-slate-600">
                        0 Nos
                      </td>
                      <td className="px-4 py-2 text-center text-sm text-slate-600">
                        {ws.reorderLevel || product.reorderLevel || 10} Nos
                      </td>
                      <td className="px-4 py-2 text-right text-sm font-medium text-slate-900">
                        ₹{" "}
                        {parseFloat(value).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-semibold ${statusColor}`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center text-xs text-slate-500">
                        {new Date(
                          ws.updatedAt || Date.now(),
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-[12px] text-slate-400"
                  >
                    No warehouse stock data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section - Stock Summary and Recent Transaction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Stock Summary */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Stock Summary</h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Opening Stock</span>
                <span className="text-sm font-semibold text-slate-900">
                  20 Nos
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Total Purchase</span>
                <span className="text-sm font-semibold text-slate-900">
                  50 Nos
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Available Stock</span>
                <span className="text-sm font-semibold text-slate-900">
                  45 Nos
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Reserved Stock</span>
                <span className="text-sm font-semibold text-slate-900">
                  5 Nos
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Reorder Quantity</span>
                <span className="text-sm font-semibold text-slate-900">
                  50 Nos
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Minimum Stock Level
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  100 Nos
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Maximum Stock Level
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  10 Nos
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Stock Value</span>
                <span className="text-sm font-semibold text-slate-900">
                  ₹ 30,00,000.00
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Lead Time</span>
                <span className="text-sm font-semibold text-slate-900">
                  5 Days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Shelf Life (Days)
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  365
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Warranty period (Month)
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  12 Months
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transaction */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Recent Transaction
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {[
                {
                  id: "STK-06-00001",
                  date: "04/08/2024",
                  type: "Stock In",
                  qty: "+500",
                  color: "emerald",
                },
                {
                  id: "INV-TRF-00001",
                  date: "04/08/2024",
                  type: "Transfer",
                  qty: "+15 Nos",
                  color: "emerald",
                },
                {
                  id: "INV-TRF-00001",
                  date: "04/08/2024",
                  type: "Transfer",
                  qty: "+15 Nos",
                  color: "emerald",
                },
                {
                  id: "INV-TRF-00001",
                  date: "04/08/2024",
                  type: "Transfer",
                  qty: "+15 Nos",
                  color: "emerald",
                },
                {
                  id: "STK-ADJ-00001",
                  date: "04/08/2024",
                  type: "Stock Adjust",
                  qty: "-7 Nos",
                  color: "red",
                },
              ].map((txn, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      {txn.id}
                    </p>
                    <p className="text-[9px] text-slate-500">{txn.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-700 mb-0.5">
                      {txn.type}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                        txn.color === "emerald"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {txn.qty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
