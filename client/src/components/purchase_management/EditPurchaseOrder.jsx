import { ArrowLeft, X } from "lucide-react";

export default function EditPurchaseOrder({ order, onBack, onSave }) {
  if (!order) return null;

  return (
    <div className="max-w-[1200px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-bold text-slate-900">
          Edit Order
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[12px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <X size={14} />
            Cancel
          </button>
          <button
            onClick={() => onSave && onSave(order)}
            className="px-4 py-2 rounded-lg bg-[#1e5fa5] text-white text-[12px] font-semibold hover:bg-[#0a57c4] transition-colors flex items-center gap-2"
          >
            Save Product
          </button>
        </div>
      </div>

      {/* Vendor Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-[13px] font-bold text-slate-900 mb-4">
          Vendor Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Vendor name <span className="text-red-500">*</span></label>
            <input
              type="text"
              defaultValue={order.supplier?.name || order.vendor || ""}
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5] bg-slate-50"
              placeholder="Select vendor name"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">PO Number* <span className="text-red-500">*</span></label>
            <input
              type="text"
              defaultValue={order.poNumber || ""}
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5] bg-slate-50"
              placeholder="Auto generated"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">PO date*</label>
            <input
              type="date"
              defaultValue={order.poDate ? new Date(order.poDate).toISOString().split("T")[0] : ""}
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Customer Person</label>
            <input
              type="text"
              defaultValue={order.supplier?.contactPerson || ""}
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5] bg-slate-50"
              placeholder="Enter vendor contact person"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Billing Address Number</label>
            <input
              type="text"
              defaultValue={order.supplier?.phone || ""}
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5] bg-slate-50"
              placeholder="Enter vendor contact person"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Expected Delivery date</label>
            <input
              type="date"
              defaultValue={order.expectedDelivery ? new Date(order.expectedDelivery).toISOString().split("T")[0] : ""}
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Vendor Email* <span className="text-red-500">*</span></label>
            <input
              type="email"
              defaultValue={order.supplier?.email || ""}
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              placeholder="Email address"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Company*</label>
            <input
              type="text"
              defaultValue={order.supplier?.company || ""}
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5] bg-slate-50"
              placeholder="Drop ship name"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Payment Terms*</label>
            <select
              defaultValue={order.paymentTerms || "Net 30"}
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
            >
              <option>Select payment terms</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Net 60">Net 60</option>
              <option value="Due on Receipt">Due on Receipt</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Shipping Preference*</label>
            <select
              defaultValue={order.shippingPreference || "Standard"}
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
            >
              <option>Select Shipping Preference</option>
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
              <option value="Overnight">Overnight</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Currency*</label>
            <select
              defaultValue="INR"
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Budget (₹)</label>
            <input
              type="text"
              defaultValue="INR"
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5] bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-[13px] font-bold text-slate-900 mb-4">
          Delivery Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Delivery Warehouse</label>
            <select
              defaultValue="Main Warehouse"
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
            >
              <option>Main Warehouse</option>
              <option>Secondary Warehouse</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Delivery Person* <span className="text-red-500">*</span></label>
            <select
              defaultValue=""
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
            >
              <option value="">Select</option>
              <option>Admin User</option>
              <option>Manager</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Contact Number*</label>
            <input
              type="text"
              defaultValue={order.deliveryAddress?.phone || ""}
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              placeholder="Enter contact number"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-[11px] text-slate-500 block mb-1">Address* <span className="text-red-500">*</span></label>
          <textarea
            defaultValue={order.deliveryAddress?.address || ""}
            rows={2}
            className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
            placeholder="Enter full address"
          />
        </div>
      </div>

      {/* Items Details */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-bold text-slate-900">
            Items Details
          </h3>
          <button className="px-3 py-1 rounded-lg bg-[#1e5fa5] text-white text-[11px] font-semibold hover:bg-[#0a57c4] transition-colors">
            + Add Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  #
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">
                  Product
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
                  Tax (%)
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="px-4 py-3 text-[12px] text-slate-600">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        defaultValue={item.product?.name || item.name || ""}
                        className="w-full px-2 py-1 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        defaultValue={item.product?.sku || item.sku || ""}
                        className="w-full px-2 py-1 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        defaultValue={item.quantity || 0}
                        className="w-20 px-2 py-1 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5] text-center"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        defaultValue={item.unitPrice || 0}
                        className="w-24 px-2 py-1 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5] text-right"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        defaultValue={item.tax || 0}
                        className="w-20 px-2 py-1 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5] text-right"
                      />
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
        <div className="mt-4 text-right">
          <span className="text-[12px] text-slate-500">
            Sub Total (₹): <span className="font-bold text-slate-900">
              ₹{order.items?.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0).toLocaleString("en-IN") || "0"}
            </span>
          </span>
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
              <label className="text-[11px] text-slate-500 block mb-1">Notes (optional)</label>
              <textarea
                defaultValue={order.notes || ""}
                rows={3}
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
                placeholder="Enter notes..."
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Terms & Conditions (optional)</label>
              <textarea
                defaultValue={order.termsAndConditions || ""}
                rows={3}
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
                placeholder="Enter Terms & Conditions..."
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Attachments (optional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                <p className="text-[12px] text-slate-400">
                  Drag & Drop or Choose file
                </p>
              </div>
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
              <span className="text-[12px] text-slate-500">Total Items</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.items?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Total Quantity</span>
              <span className="text-[12px] font-semibold text-slate-900">
                {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Sub Total (₹)</span>
              <span className="text-[12px] font-semibold text-slate-900">
                ₹{order.items?.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0).toLocaleString("en-IN") || "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Discount</span>
              <span className="text-[12px] font-semibold text-slate-900">
                12 Months
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Tax (12%)</span>
              <span className="text-[12px] font-semibold text-slate-900">
                ₹{order.items?.reduce((sum, item) => sum + (item.tax || 0), 0).toLocaleString("en-IN") || "0.00"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-slate-500">Shipping / Handling (₹)</span>
              <input
                type="text"
                defaultValue="0"
                className="w-20 px-2 py-1 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5] text-right"
              />
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between">
              <span className="text-[13px] font-bold text-slate-900">Grand Total (₹)</span>
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
