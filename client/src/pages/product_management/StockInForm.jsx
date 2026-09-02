import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2, Package, Calendar, MapPin, FileText } from 'lucide-react';

const ACCENT = "#1e5fa5";
const ACCENT_2 = "#0a57c4";

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(10,37,64,0.04)] p-5">
    <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
      <Icon size={16} className="text-[#1e5fa5]" /> {title}
    </h3>
    {children}
  </div>
);

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-600 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[12px] font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5fa5]/30 focus:border-[#1e5fa5]/30 transition-all";

export default function StockInForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    productName: '',
    sku: '',
    quantity: '',
    unitCost: '',
    totalCost: '',
    warehouse: '',
    supplier: '',
    grnNo: '',
    invoiceNo: '',
    documentDate: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'quantity' || name === 'unitCost') {
        const qty = parseFloat(name === 'quantity' ? value : prev.quantity) || 0;
        const cost = parseFloat(name === 'unitCost' ? value : prev.unitCost) || 0;
        updated.totalCost = (qty * cost).toFixed(2);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Stock In entry created successfully!');
      navigate('/product-history');
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-[1200px] mx-auto space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/product-history')}
            className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} />
          </motion.button>
          <div>
            <h1 className="text-[18px] font-extrabold text-slate-900 tracking-tight">Add Stock In</h1>
            <p className="text-[11px] text-slate-500 font-semibold">Record new stock incoming entry</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/product-history')}
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[12px] font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-[12px] font-semibold shadow-md hover:opacity-95 transition-all disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${ACCENT_2} 0%, ${ACCENT} 100%)` }}
          >
            <Save size={14} />
            {loading ? 'Saving...' : 'Save Entry'}
          </motion.button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Information */}
        <Section title="Product Information" icon={Package}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Product Name" required>
              <input type="text" name="productName" value={form.productName} onChange={handleChange} placeholder="Enter product name" className={inputCls} required />
            </Field>
            <Field label="SKU / Code" required>
              <input type="text" name="sku" value={form.sku} onChange={handleChange} placeholder="Enter SKU code" className={inputCls} required />
            </Field>
            <Field label="Quantity" required>
              <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="0" min="1" className={inputCls} required />
            </Field>
            <Field label="Unit Cost (₹)" required>
              <input type="number" name="unitCost" value={form.unitCost} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className={inputCls} required />
            </Field>
            <Field label="Total Cost (₹)">
              <input type="text" name="totalCost" value={form.totalCost} readOnly className={`${inputCls} bg-slate-50`} />
            </Field>
            <Field label="Warehouse" required>
              <select name="warehouse" value={form.warehouse} onChange={handleChange} className={inputCls} required>
                <option value="">Select warehouse</option>
                <option value="Main Warehouse">Main Warehouse</option>
                <option value="Chennai-WH">Chennai-WH</option>
                <option value="Mumbai-WH">Mumbai-WH</option>
                <option value="Pune-WH">Pune-WH</option>
              </select>
            </Field>
          </div>
        </Section>

        {/* Supplier & Document Details */}
        <Section title="Supplier & Document Details" icon={FileText}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Supplier Name" required>
              <input type="text" name="supplier" value={form.supplier} onChange={handleChange} placeholder="Enter supplier name" className={inputCls} required />
            </Field>
            <Field label="GRN No">
              <input type="text" name="grnNo" value={form.grnNo} onChange={handleChange} placeholder="e.g. GRN-2026-101" className={inputCls} />
            </Field>
            <Field label="Invoice No">
              <input type="text" name="invoiceNo" value={form.invoiceNo} onChange={handleChange} placeholder="e.g. INV-2026-155" className={inputCls} />
            </Field>
            <Field label="Document Date" required>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="date" name="documentDate" value={form.documentDate} onChange={handleChange} className={`${inputCls} pl-9`} required />
              </div>
            </Field>
          </div>
        </Section>

        {/* Notes */}
        <Section title="Additional Notes" icon={MapPin}>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Enter any additional notes or remarks..."
            className={`${inputCls} resize-none`}
          />
        </Section>
      </form>
    </motion.div>
  );
}
