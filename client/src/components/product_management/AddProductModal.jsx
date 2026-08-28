import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const initialForm = {
  name: '',
  sku: '',
  productId: '',
  category: '',
  brand: '',
  source: '',
  weight: '',
  leadTime: '',
  material: '',
  unit: '',
  description: '',
  assignedTo: '',
};

export default function AddProductModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState(initialForm);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleReset = () => setForm(initialForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd?.(form);
    setForm(initialForm);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h2 className="text-[22px] font-extrabold text-slate-900 tracking-tight">Add Product Inventory</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Product Name" required>
                  <input type="text" value={form.name} onChange={handleChange('name')} required className={inputCls} placeholder="Enter product name" />
                </Field>
                <Field label="SKU Code" required>
                  <input type="text" value={form.sku} onChange={handleChange('sku')} required className={inputCls} placeholder="Enter SKU code" />
                </Field>
                <Field label="Product ID" required>
                  <input type="text" value={form.productId} onChange={handleChange('productId')} required className={inputCls} placeholder="e.g. PRD-1001" />
                </Field>
                <Field label="Product Category" required>
                  <select value={form.category} onChange={handleChange('category')} required className={inputCls}>
                    <option value="">Select category</option>
                    <option>Electronics</option>
                    <option>Furnitures</option>
                    <option>Accessories</option>
                    <option>Hardwares</option>
                  </select>
                </Field>
                <Field label="Brand" required>
                  <input type="text" value={form.brand} onChange={handleChange('brand')} required className={inputCls} placeholder="Enter brand" />
                </Field>
                <Field label="Source" required>
                  <input type="text" value={form.source} onChange={handleChange('source')} required className={inputCls} placeholder="Enter source" />
                </Field>
                <Field label="Weight (G)">
                  <input type="number" value={form.weight} onChange={handleChange('weight')} className={inputCls} placeholder="Enter weight" />
                </Field>
                <Field label="Lead Time">
                  <input type="text" value={form.leadTime} onChange={handleChange('leadTime')} className={inputCls} placeholder="e.g. 5 days" />
                </Field>
                <Field label="Material (optional)">
                  <input type="text" value={form.material} onChange={handleChange('material')} className={inputCls} placeholder="Enter material" />
                </Field>
                <Field label="Unit" required>
                  <select value={form.unit} onChange={handleChange('unit')} required className={inputCls}>
                    <option value="">Select unit</option>
                    <option>Piece</option>
                    <option>Box</option>
                    <option>Kg</option>
                    <option>Liter</option>
                  </select>
                </Field>
              </div>

              <Field label="Product Description">
                <textarea
                  value={form.description}
                  onChange={handleChange('description')}
                  rows={3}
                  className={`${inputCls} resize-none`}
                  placeholder="Enter product description"
                />
              </Field>

              <Field label="Assigned To">
                <input type="text" value={form.assignedTo} onChange={handleChange('assignedTo')} className={inputCls} placeholder="Enter assignee name" />
              </Field>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Reset
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -10px rgba(10,37,64,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold shadow-md"
                  style={{ background: 'linear-gradient(135deg, #0a57c4 0%, #1e5fa5 100%)' }}
                >
                  <span className="text-lg leading-none">+</span>
                  Add product to dashboard
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5fa5]/30 focus:border-[#1e5fa5]/30 focus:bg-white transition-all';

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-slate-600 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
