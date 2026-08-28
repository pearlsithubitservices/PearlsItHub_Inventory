import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit2, Trash2, X, Truck, Mail, Phone, MapPin,
  Building2, UserCircle2, Star, Filter
} from 'lucide-react';
import { supplierAPI } from '../../api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', address: '', city: '', country: '', contactPerson: '', notes: '', status: 'active' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await supplierAPI.getAll();
      setSuppliers(res.data.suppliers || []);
    } catch (err) {
      setSuppliers([
        { _id: '1', name: 'Tech Supply Co.', company: 'Tech Supply International', email: 'sales@techsupply.com', phone: '+1 800 123 4567', address: '100 Industrial Blvd', city: 'Seattle', country: 'USA', contactPerson: 'John Anderson', notes: 'Reliable tech components supplier. Ships within 2 days.', status: 'active', createdAt: new Date('2025-11-01') },
        { _id: '2', name: 'Gadgets World', company: 'Gadgets World Ltd.', email: 'info@gadgetsworld.com', phone: '+1 800 234 5678', address: '200 Commerce Way', city: 'San Jose', country: 'USA', contactPerson: 'Sarah Chen', notes: 'Specializes in wearables and smart devices.', status: 'active', createdAt: new Date('2025-12-15') },
        { _id: '3', name: 'Audio Masters', company: 'Audio Masters Pro', email: 'contact@audiomasters.com', phone: '+1 800 345 6789', address: '300 Sound St', city: 'Nashville', country: 'USA', contactPerson: 'Mike Johnson', notes: 'Premium audio equipment. Quality is excellent.', status: 'active', createdAt: new Date('2026-01-10') },
        { _id: '4', name: 'Office Pro Supplies', company: 'Office Pro Inc.', email: 'orders@officepro.com', phone: '+1 800 456 7890', address: '400 Business Ave', city: 'Atlanta', country: 'USA', contactPerson: 'Lisa Martinez', notes: 'Office equipment and ergonomic products.', status: 'inactive', createdAt: new Date('2025-09-20') },
        { _id: '5', name: 'Global Components', company: 'Global Tech Components', email: 'support@globalcomp.com', phone: '+1 800 567 8901', address: '500 Tech Park', city: 'Austin', country: 'USA', contactPerson: 'David Kim', notes: '', status: 'active', createdAt: new Date('2026-02-28') },
      ]);
    } finally { setLoading(false); }
  };

  const filtered = suppliers.filter(s =>
    (s.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (s.company?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (s.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (s.phone?.includes(search))
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', company: '', email: '', phone: '', address: '', city: '', country: '', contactPerson: '', notes: '', status: 'active' });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ ...s });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await supplierAPI.update(editing._id, form);
      else await supplierAPI.create(form);
      loadData();
      setShowModal(false);
    } catch (err) {
      if (editing) setSuppliers(suppliers.map(s => s._id === editing._id ? { ...s, ...form } : s));
      else setSuppliers([{ ...form, _id: Date.now().toString() }, ...suppliers]);
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try { await supplierAPI.delete(id); loadData(); }
    catch (err) { setSuppliers(suppliers.filter(s => s._id !== id)); }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  const gradients = [
    'from-rose-400 to-pink-500', 'from-orange-400 to-red-500', 'from-sky-400 to-blue-500',
    'from-lime-400 to-emerald-500', 'from-fuchsia-400 to-purple-500'
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Truck size={28} className="text-primary-600" /> Suppliers</h1>
          <p className="text-slate-500 mt-1">Manage your suppliers and vendor relationships</p>
        </div>
        <motion.button whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(59,130,246,0.4)' }} whileTap={{ scale: 0.97 }} onClick={openCreate} className="btn-primary gap-2">
          <Plus size={18} /> Add Supplier
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Suppliers', value: suppliers.length, icon: Truck, color: 'from-primary-500 to-indigo-600' },
          { label: 'Active', value: suppliers.filter(s => s.status === 'active').length, icon: Star, color: 'from-emerald-500 to-teal-600' },
          { label: 'Inactive', value: suppliers.filter(s => s.status === 'inactive').length, icon: Building2, color: 'from-slate-400 to-slate-600' },
        ].map((s, i) => (
          <motion.div key={s.label} whileHover={{ y: -3 }} className="card p-4 flex items-center gap-4">
            <motion.div animate={{ y: [0, -3, 0] }} transition={{ delay: i * 0.1, duration: 3, repeat: Infinity }} className={`p-3 rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
              <s.icon size={22} />
            </motion.div>
            <div>
              <p className="text-slate-500 text-sm">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="card p-4 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search suppliers by name, company, email, or phone..." className="input pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.map((s, idx) => (
            <motion.div
              key={s._id}
              variants={itemVariants}
              layout
              whileHover={{ y: -6, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12)' }}
              className="card p-5 group relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradients[idx % gradients.length]}`} />
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center text-white shadow-lg`}
                  >
                    <Truck size={26} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{s.name}</h3>
                    {s.company && <p className="text-sm text-slate-500">{s.company}</p>}
                    <span className={`badge ${s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} capitalize mt-2`}>
                      {s.status ? s.status.charAt(0).toUpperCase() + s.status.slice(1) : "Active"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEdit(s)} className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                    <Edit2 size={15} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(s._id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={15} />
                  </motion.button>
                </div>
              </div>

              {s.contactPerson && (
                <div className="flex items-center gap-2.5 mb-2.5 text-sm">
                  <UserCircle2 size={15} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600"><span className="text-slate-400">Contact:</span> {s.contactPerson}</span>
                </div>
              )}

              {s.email && (
                <div className="flex items-center gap-2.5 mb-2.5 text-sm">
                  <Mail size={15} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600 truncate">{s.email}</span>
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-2.5 text-sm">
                <Phone size={15} className="text-slate-400 flex-shrink-0" />
                <span className="text-slate-600">{s.phone}</span>
              </div>

              {(s.city || s.country || s.address) && (
                <div className="flex items-start gap-2.5 mb-3 text-sm">
                  <MapPin size={15} className="text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">{[s.address, s.city, s.country].filter(Boolean).join(', ')}</span>
                </div>
              )}

              {s.notes && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-sm text-slate-500 italic">"{s.notes}"</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Since {new Date(s.createdAt).toLocaleDateString()}</span>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="font-semibold text-primary-600 hover:text-primary-700">
                  View Products →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-16 text-slate-400 card">No suppliers found</motion.div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-primary-50 to-indigo-50">
                <h2 className="text-xl font-bold text-slate-800">{editing ? 'Edit Supplier' : 'Add Supplier'}</h2>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/70"><X size={20} /></motion.button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label">Supplier Name *</label><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div><label className="label">Company</label><input className="input" value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
                  <div><label className="label">Email</label><input type="email" className="input" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div><label className="label">Phone *</label><input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                  <div><label className="label">Contact Person</label><input className="input" value={form.contactPerson || ''} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} /></div>
                  <div><label className="label">Country</label><input className="input" value={form.country || ''} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
                  <div className="sm:col-span-2"><label className="label">Address</label><input className="input" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                  <div><label className="label">City</label><input className="input" value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                  <div><label className="label">Status</label>
                    <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2"><label className="label">Notes</label><textarea rows={2} className="input resize-none" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes about this supplier..." /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'}</motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
