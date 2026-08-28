import { useState } from "react";
import { ArrowLeft, Save, Plus, Trash } from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function AddVendor({ onBack, onSave }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    vendorCode: "",
    status: "Active",
    contactPerson: "",
    vendorEmail: "",
    vendorPhone: "",
    gstin: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
    paymentTerms: "",
    paymentMode: "",
    currency: "INR - Indian Rupee",
    creditLimit: "",
    creditDays: "",
    exchangeRate: "1.00",
  });

  const [bankDetails, setBankDetails] = useState([
    { bankName: "", accountHolderName: "", accountNumber: "", ifscCode: "", branch: "", accountType: "Current Account" },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (index, field, value) => {
    const updated = [...bankDetails];
    updated[index] = { ...updated[index], [field]: value };
    setBankDetails(updated);
  };

  const addBankRow = () => {
    setBankDetails([
      ...bankDetails,
      { bankName: "", accountHolderName: "", accountNumber: "", ifscCode: "", branch: "", accountType: "Current Account" },
    ]);
  };

  const removeBankRow = (index) => {
    if (bankDetails.length > 1) {
      setBankDetails(bankDetails.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const vendorData = {
        name: form.name,
        company: form.name,
        email: form.vendorEmail,
        phone: form.vendorPhone,
        contactPerson: form.contactPerson,
        gstin: form.gstin,
        address: `${form.addressLine1}, ${form.addressLine2}, ${form.city}, ${form.state} - ${form.pinCode}`,
        city: form.city,
        state: form.state,
        pinCode: form.pinCode,
        landmark: form.landmark,
        paymentTerms: form.paymentTerms,
        paymentMode: form.paymentMode,
        currency: form.currency,
        creditLimit: form.creditLimit,
        creditDays: form.creditDays,
        exchangeRate: form.exchangeRate,
        bankDetails: bankDetails,
        status: form.status === "Active" ? "active" : "inactive",
      };

      const res = await fetch(`${API_URL}/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vendorData),
      });

      const data = await res.json();

      if (data.success) {
        if (onSave) onSave(data.supplier);
        onBack();
      } else {
        alert(data.message || "Failed to create vendor");
      }
    } catch (err) {
      console.error("Failed to create vendor:", err);
      alert("Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-bold text-slate-900">Add Vendor</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[12px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            ✕ Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#1e5fa5] text-white text-[12px] font-semibold hover:bg-[#0a57c4] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={14} />
            {loading ? "Saving..." : "Save Vendor"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vendor Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[13px] font-bold text-slate-900 mb-4">
            Vendor Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter vendor name"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Vendor Code
              </label>
              <input
                type="text"
                name="vendorCode"
                value={form.vendorCode}
                onChange={handleChange}
                placeholder="Auto generate"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5] bg-slate-50"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                placeholder="Enter contact person name"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Vendor Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="vendorEmail"
                value={form.vendorEmail}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Vendor phone number
              </label>
              <input
                type="tel"
                name="vendorPhone"
                value={form.vendorPhone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                GSTIN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="gstin"
                value={form.gstin}
                onChange={handleChange}
                placeholder="Enter GSTIN"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              />
            </div>
          </div>
        </div>

        {/* Vendor Address */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[13px] font-bold text-slate-900 mb-4">
            Vendor Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addressLine1"
                value={form.addressLine1}
                onChange={handleChange}
                placeholder="Main Warehouse"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Address Line 2 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addressLine2"
                value={form.addressLine2}
                onChange={handleChange}
                placeholder="Main Warehouse"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Land Mark
              </label>
              <input
                type="text"
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                placeholder="Enter land mark"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter contact person name"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              >
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Bihar">Bihar</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Odisha">Odisha</option>
                <option value="Assam">Assam</option>
                <option value="Goa">Goa</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pinCode"
                value={form.pinCode}
                onChange={handleChange}
                placeholder="Enter PIN Code"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              />
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[13px] font-bold text-slate-900 mb-4">
            Payment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Payment Terms <span className="text-red-500">*</span>
              </label>
              <select
                name="paymentTerms"
                value={form.paymentTerms}
                onChange={handleChange}
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              >
                <option value="">Select payment terms</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Payment Mode <span className="text-red-500">*</span>
              </label>
              <select
                name="paymentMode"
                value={form.paymentMode}
                onChange={handleChange}
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              >
                <option value="">Select payment mode</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Online">Online</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              >
                <option value="INR - Indian Rupee">INR - Indian Rupee</option>
                <option value="USD - US Dollar">USD - US Dollar</option>
                <option value="EUR - Euro">EUR - Euro</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Credit Limit
              </label>
              <input
                type="text"
                name="creditLimit"
                value={form.creditLimit}
                onChange={handleChange}
                placeholder="Enter credit limit"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Credit days
              </label>
              <input
                type="text"
                name="creditDays"
                value={form.creditDays}
                onChange={handleChange}
                placeholder="Enter credit days"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Exchange Rate
              </label>
              <input
                type="text"
                name="exchangeRate"
                value={form.exchangeRate}
                onChange={handleChange}
                placeholder="1.00"
                className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e5fa5]"
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold text-slate-900">
              Bank Details
            </h3>
            <button
              type="button"
              onClick={addBankRow}
              className="px-3 py-1.5 rounded-lg bg-[#1e5fa5] text-white text-[11px] font-semibold hover:bg-[#0a57c4] transition-colors flex items-center gap-1"
            >
              <Plus size={12} />
              Add bank account
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                    Bank Name
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                    Account Holder Name
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                    Account Number
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                    IFSC Code
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                    Branch
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase">
                    Account Type
                  </th>
                  <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-600 uppercase w-20">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {bankDetails.map((bank, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={bank.bankName}
                        onChange={(e) => handleBankChange(idx, "bankName", e.target.value)}
                        placeholder="HDFC Bank Ltd"
                        className="w-full px-2 py-1.5 text-[11px] border border-slate-200 rounded focus:outline-none focus:border-[#1e5fa5]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={bank.accountHolderName}
                        onChange={(e) => handleBankChange(idx, "accountHolderName", e.target.value)}
                        placeholder="Get name per ANI"
                        className="w-full px-2 py-1.5 text-[11px] border border-slate-200 rounded focus:outline-none focus:border-[#1e5fa5]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={bank.accountNumber}
                        onChange={(e) => handleBankChange(idx, "accountNumber", e.target.value)}
                        placeholder="50100000000000"
                        className="w-full px-2 py-1.5 text-[11px] border border-slate-200 rounded focus:outline-none focus:border-[#1e5fa5]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={bank.ifscCode}
                        onChange={(e) => handleBankChange(idx, "ifscCode", e.target.value)}
                        placeholder="HDFC0001454"
                        className="w-full px-2 py-1.5 text-[11px] border border-slate-200 rounded focus:outline-none focus:border-[#1e5fa5]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={bank.branch}
                        onChange={(e) => handleBankChange(idx, "branch", e.target.value)}
                        placeholder="Chennai - Anna Salai"
                        className="w-full px-2 py-1.5 text-[11px] border border-slate-200 rounded focus:outline-none focus:border-[#1e5fa5]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={bank.accountType}
                        onChange={(e) => handleBankChange(idx, "accountType", e.target.value)}
                        className="w-full px-2 py-1.5 text-[11px] border border-slate-200 rounded focus:outline-none focus:border-[#1e5fa5]"
                      >
                        <option value="Current Account">Current Account</option>
                        <option value="Savings Account">Savings Account</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeBankRow(idx)}
                        className="w-6 h-6 rounded bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                      >
                        <Trash size={12} className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
}
