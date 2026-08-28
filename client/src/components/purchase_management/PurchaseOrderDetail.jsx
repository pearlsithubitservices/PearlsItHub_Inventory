import { ArrowLeft, Printer } from "lucide-react";

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

export default function PurchaseOrderDetail({ order, onBack }) {

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">No order data found</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-[18px] font-bold text-slate-900">
              {order.poNumber || order.referenceNo}
            </h1>
            <p className="text-[12px] text-slate-500">
              Reference No: {order.referenceNo || order.poNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-semibold ${getStatusStyle(
              order.status
            )}`}
          >
            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
          </span>
          <button className="px-4 py-2 rounded-lg bg-[#1e5fa5] text-white text-[12px] font-semibold hover:bg-[#0a57c4] transition-colors flex items-center gap-2">
            <Printer size={14} />
            Print PO
          </button>
        </div>
      </div>

      {/* Top Section - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Purchase Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[13px] font-bold text-slate-900 mb-4">
            Purchase Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">PO Number</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.poNumber || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Reference Number</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.referenceNo || order.poNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">PO Date</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.poDate
                  ? new Date(order.poDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Expected Delivery</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.expectedDelivery
                  ? new Date(order.expectedDelivery).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Created By</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.createdBy?.name || order.createdBy || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Vendor Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[13px] font-bold text-slate-900 mb-4">
            Vendor Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Vendor Name</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.supplier?.name || order.vendor || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Customer Support</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.supplier?.contactPerson || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Email</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.supplier?.email || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Phone</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.supplier?.phone || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery & Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Delivery Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[13px] font-bold text-slate-900 mb-4">
            Delivery Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Delivery To</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.deliveryAddress?.name || "Main Warehouse"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Address</span>
              <span className="text-[12px] font-semibold text-slate-900 text-right max-w-[60%]">
                {order.deliveryAddress?.address || "123, Industrial Area, Phase 1, City, State - 560001"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Contact Person</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.deliveryAddress?.contactPerson || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Phone</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.deliveryAddress?.phone || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Payment & Shipment */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[13px] font-bold text-slate-900 mb-4">
            Payment & Shipment
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Payment Terms</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.paymentTerms || "Net 30"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Due Date</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.dueDate
                  ? new Date(order.dueDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Shipping Preference</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.shippingPreference || "Standard"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Expected Delivery</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.expectedDelivery
                  ? new Date(order.expectedDelivery).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Details */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <h3 className="text-[13px] font-bold text-slate-900">
            Items Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  #
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  SKU
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase">
                  Qty
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">
                  Tax
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-[12px] text-slate-600">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-medium text-slate-900">
                      {item.product?.name || item.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">
                      {item.product?.sku || item.sku || "-"}
                    </td>
                    <td className="px-4 py-3 text-center text-[12px] text-slate-900">
                      {item.quantity || 0}
                    </td>
                    <td className="px-4 py-3 text-right text-[12px] text-slate-900">
                      ₹{(item.unitPrice || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right text-[12px] text-slate-900">
                      ₹{(item.tax || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">
                      ₹{((item.quantity || 0) * (item.unitPrice || 0) + (item.tax || 0)).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[12px] text-slate-400">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Additional Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[13px] font-bold text-slate-900 mb-4">
            Additional Information
          </h3>
          <div className="space-y-4">
            <div>
              <span className="text-[12px] text-slate-500">Notes</span>
              <p className="text-[12px] font-medium text-slate-900 mt-1">
                {order.notes || "Urgent order, please ensure quality and on-time delivery."}
              </p>
            </div>
            <div>
              <span className="text-[12px] text-slate-500">Terms & Conditions</span>
              <p className="text-[12px] font-medium text-slate-900 mt-1">
                {order.termsAndConditions || "1. Goods must match the purchase order.\n2. Payment will be processed after invoice approval."}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[13px] font-bold text-slate-900 mb-4">
            Order Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Status</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusStyle(
                  order.status
                )}`}
              >
            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Total Items</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.items?.length || order.totalItems || 0} Items
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Total Quantity</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.totalQuantity || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Subtotal</span>
              <span className="text-[12px] font-semibold text-slate-900">
                ₹{((order.totalAmount || 0) * 0.85).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Tax (GST 18%)</span>
              <span className="text-[12px] font-semibold text-slate-900">
                ₹{((order.totalAmount || 0) * 0.15).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Shipping</span>
              <span className="text-[12px] font-semibold text-slate-900">
                ₹{(order.shippingCharges || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between">
              <span className="text-[13px] font-bold text-slate-900">Grand Total</span>
              <span className="text-[13px] font-bold text-[#1e5fa5]">
                ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
