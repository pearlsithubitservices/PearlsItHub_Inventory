import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Users, Mail, Phone, MapPin, ShoppingBag, Calendar, Filter } from 'lucide-react';
import { customerAPI, orderAPI } from '../../api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', country: '', notes: '', status: 'Active' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await customerAPI.getAll();
      setCustomers(res.data.customers || []);
    } catch (err) {
      setCustomers([
        { _id: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 555 123 4567', address: '123 Main St', city: 'New York', country: 'USA', totalPurchases: 12500, status: 'Active', createdAt: new Date('2026-01-15'), lastPurchase: new Date('2026-08-10') },
        { _id: '2', name: 'Bob Smith', email: 'bob@example.com', phone: '+1 555 234 5678', address: '456 Oak Ave', city: 'Los Angeles', country: 'USA', totalPurchases: 8200, status: 'Active', createdAt: new Date('2026-02-20'), lastPurchase: new Date('2026-08-05') },
        { _id: '3', name: 'Carol Davis', email: 'carol@example.com', phone: '+1 555 345 6789', address: '789 Pine Rd', city: 'Chicago', country: 'USA', totalPurchases: 15800, status: 'Active', createdAt: new Date('2026-01-05'), lastPurchase: new Date('2026-08-13') },
        { _id: '4', name: 'David Wilson', email: 'david@example.com', phone: '+1 555 456 7890', address: '321 Elm St', city: 'Houston', country: 'USA', totalPurchases: 3400, status: 'Inactive', createdAt: new Date('2026-03-10'), lastPurchase: new Date('2026-05-20') },
        { _id: '5', name: 'Emma Brown', email: 'emma@example.com', phone: '+1 555 567 8901', address: '654 Cedar Ln', city: 'Phoenix', country: 'USA', totalPurchases: 9700, status: 'Active', createdAt: new Date('2026-02-01'), lastPurchase: new Date('2026-08-11') },
        { _id: '6', name: 'Frank Miller', email: 'frank@example.com', phone: '+1 555 678 9012', address: '987 Maple Dr', city: 'Dallas', country: 'USA', totalPurchases: 5600, status: 'Active', createdAt: new Date('2026-04-01'), lastPurchase: new Date('2026-07-25') },
      ]);
    } finally { setLoading(false); }
  };

  const filtered = customers.filter(c =>
    (c.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.phone?.includes(search))
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', address: '', city: '', country: '', notes: '', status: 'Active' });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ ...c });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await customerAPI.update(editing._id, form);
      else await customerAPI.create(form);
      loadData();
      setShowModal(false);
    } catch (err) {
      if (editing) setCustomers(customers.map(c => c._id === editing._id ? { ...c, ...form } : c));
      else setCustomers([{ ...form, _id: Date.now().toString(), totalPurchases: 0 }, ...customers]);
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try { await customerAPI.delete(id); loadData(); }
    catch (err) { setCustomers(customers.filter(c => c._id !== id)); }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  const gradientColors = [
    'from-pink-400 to-rose-500', 'from-blue-400 to-indigo-500', 'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500', 'from-purple-400 to-violet-500', 'from-cyan-400 to-sky-500'
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Users size={28} className="text-primary-600" /> Customers</h1>
          <p className="text-slate-500 mt-1">Manage your customer relationships and contact information</p>
        </div>
        <motion.button whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(59,130,246,0.4)' }} whileTap={{ scale: 0.97 }} onClick={openCreate} className="btn-primary gap-2">
          <Plus size={18} /> Add Customer
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Customers', value: customers.length, icon: Users, color: 'from-primary-500 to-indigo-600' },
          { label: 'Active', value: customers.filter(c => c.status === 'Active').length, icon: Users, color: 'from-emerald-500 to-teal-600' },
          { label: 'Total Revenue', value: `$${customers.reduce((s, c) => s + (c.totalPurchases || 0), 0).toLocaleString()}`, icon: ShoppingBag, color: 'from-amber-500 to-orange-600' },
          { label: 'Avg Lifetime Value', value: `$${Math.round(customers.reduce((s, c) => s + (c.totalPurchases || 0), 0) / (customers.length || 1)).toLocaleString()}`, icon: Calendar, color: 'from-purple-500 to-violet-600' },
        ].map((s, i) => (
          <motion.div key={s.label} whileHover={{ y: -3 }} className="card p-4 flex items-center gap-4">
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ delay: i * 0.1, duration: 3, repeat: Infinity }} className={`p-3 rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
              <s.icon size={22} />
            </motion.div>
            <div>
              <p className="text-slate-500 text-sm">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="card p-4 mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search customers by name, email, or phone..." className="input pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.map((c, idx) => (
            <motion.div
              key={c._id}
              variants={itemVariants}
              layout
              whileHover={{ y: -6, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12)' }}
              className="card p-5 group relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientColors[idx % gradientColors.length]}`} />
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientColors[idx % gradientColors.length]} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                  >
                    {c.name?.charAt(0)}
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{c.name}</h3>
                    <span className={`badge ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} capitalize mt-1`}>
                      {c.status || "Active"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEdit(c)} className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                    <Edit2 size={15} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(c._id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={15} />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                {c.email && (
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Mail size={15} className="text-slate-400" />
                    <span className="truncate">{c.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Phone size={15} className="text-slate-400" />
                  <span>{c.phone}</span>
                </div>
                {(c.city || c.country) && (
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <MapPin size={15} className="text-slate-400" />
                    <span>{[c.address, c.city, c.country].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Total Spent</p>
                  <p className="font-bold text-slate-800 text-lg">${(c.totalPurchases || 0).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Last Purchase</p>
                  <p className="font-semibold text-slate-700 text-sm">{c.lastPurchase ? new Date(c.lastPurchase).toLocaleDateString() : '—'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-16 text-slate-400 card">No customers found</motion.div>
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
                <h2 className="text-xl font-bold text-slate-800">{editing ? 'Edit Customer' : 'Add Customer'}</h2>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/70"><X size={20} /></motion.button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label">Full Name *</label><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div><label className="label">Phone *</label><input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                  <div className="sm:col-span-2"><label className="label">Email</label><input type="email" className="input" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="sm:col-span-2"><label className="label">Address</label><input className="input" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                  <div><label className="label">City</label><input className="input" value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                  <div><label className="label">Country</label><input className="input" value={form.country || ''} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
                  <div className="sm:col-span-2"><label className="label">Notes</label><textarea rows={2} className="input resize-none" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
                  <div><label className="label">Status</label>
                    <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
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
