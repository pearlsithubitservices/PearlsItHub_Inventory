import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit2, Trash2, X, ShoppingCart, Truck, CheckCircle,
  Clock, Package, DollarSign, Calendar, Eye, Filter, UserCircle2
} from 'lucide-react';
import { orderAPI, productAPI, customerAPI } from '../../api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

const statusStyle = (s) => ({
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
  shipped: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Truck },
  delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: X },
}[s] || { bg: 'bg-slate-100', text: 'text-slate-700', icon: Package });

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderForm, setOrderForm] = useState({ customer: '', paymentMethod: 'cash', tax: 0, discount: 0, notes: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [oRes, pRes, cRes] = await Promise.all([orderAPI.getAll(), productAPI.getAll(), customerAPI.getAll()]);
      setOrders(oRes.data.orders || []);
      setProducts(pRes.data.products || []);
      setCustomers(cRes.data.customers || []);
    } catch (err) {
      setOrders([
        { _id: '1', orderNumber: 'ORD-1723648200', customer: { _id: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 555 123 4567' }, items: [{ name: 'Wireless Headphones', quantity: 1, price: 299, total: 299 }, { name: 'USB-C Hub', quantity: 2, price: 59, total: 118 }], subtotal: 417, tax: 33.36, discount: 0, total: 450.36, status: 'delivered', paymentMethod: 'card', createdAt: new Date('2026-08-13'), notes: '' },
        { _id: '2', orderNumber: 'ORD-1723561800', customer: { _id: '2', name: 'Bob Smith' }, items: [{ name: 'Smart Watch Pro', quantity: 1, price: 399, total: 399 }], subtotal: 399, tax: 31.92, discount: 0, total: 430.92, status: 'shipped', paymentMethod: 'bank_transfer', createdAt: new Date('2026-08-12') },
        { _id: '3', orderNumber: 'ORD-1723475400', customer: { _id: '3', name: 'Carol Davis' }, items: [{ name: 'Ergonomic Mouse', quantity: 2, price: 79, total: 158 }, { name: 'Keyboard RGB', quantity: 1, price: 149, total: 149 }], subtotal: 307, tax: 24.56, discount: 15, total: 316.56, status: 'confirmed', paymentMethod: 'cash', createdAt: new Date('2026-08-11') },
        { _id: '4', orderNumber: 'ORD-1723389000', customer: { _id: '4', name: 'David Wilson' }, items: [{ name: 'Bluetooth Speaker', quantity: 3, price: 89, total: 267 }], subtotal: 267, tax: 21.36, discount: 0, total: 288.36, status: 'pending', paymentMethod: 'credit', createdAt: new Date('2026-08-10') },
        { _id: '5', orderNumber: 'ORD-1723302600', customer: { _id: '5', name: 'Emma Brown' }, items: [{ name: 'Mechanical Keyboard', quantity: 2, price: 149, total: 298 }], subtotal: 298, tax: 23.84, discount: 10, total: 311.84, status: 'delivered', paymentMethod: 'card', createdAt: new Date('2026-08-09') },
      ]);
      setProducts([
        { _id: 'p1', name: 'Wireless Headphones Pro', sku: 'AUD-001', price: 299, stock: 45 },
        { _id: 'p2', name: 'Smart Watch Series 5', sku: 'WCH-002', price: 399, stock: 28 },
        { _id: 'p3', name: 'Bluetooth Speaker Mini', sku: 'AUD-003', price: 89, stock: 3 },
        { _id: 'p4', name: 'USB-C Hub 7-in-1', sku: 'ACC-004', price: 59, stock: 12 },
        { _id: 'p5', name: 'Ergonomic Wireless Mouse', sku: 'ACC-005', price: 79, stock: 62 },
        { _id: 'p6', name: 'Mechanical Keyboard RGB', sku: 'ACC-006', price: 149, stock: 18 },
      ]);
      setCustomers([
        { _id: '1', name: 'Alice Johnson' }, { _id: '2', name: 'Bob Smith' },
        { _id: '3', name: 'Carol Davis' }, { _id: '4', name: 'David Wilson' },
        { _id: '5', name: 'Emma Brown' }
      ]);
    } finally { setLoading(false); }
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || (o.orderNumber?.toLowerCase().includes(search.toLowerCase())) || (o.customer?.name?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const addToCart = (product) => {
    const existing = cart.find(i => i.product === product._id);
    if (existing) {
      if (existing.quantity >= product.stock) return;
      setCart(cart.map(i => i.product === product._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { product: product._id, name: product.name, quantity: 1, price: product.price, stock: product.stock }]);
    }
  };

  const updateQty = (id, qty) => {
    if (qty < 1) { setCart(cart.filter(i => i.product !== id)); return; }
    const item = cart.find(i => i.product === id);
    if (item && qty > item.stock) return;
    setCart(cart.map(i => i.product === id ? { ...i, quantity: qty } : i));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const taxAmount = subtotal * (orderForm.tax || 0) / 100;
  const discountAmount = subtotal * (orderForm.discount || 0) / 100;
  const grandTotal = subtotal + taxAmount - discountAmount;

  const submitOrder = async (e) => {
    e.preventDefault();
    if (!orderForm.customer || cart.length === 0) return;
    try {
      await orderAPI.create({
        customer: orderForm.customer,
        items: cart.map(i => ({ product: i.product, quantity: i.quantity })),
        tax: orderForm.tax, discount: orderForm.discount,
        paymentMethod: orderForm.paymentMethod, notes: orderForm.notes
      });
      loadData();
    } catch (err) {
      const newOrder = {
        _id: Date.now().toString(),
        orderNumber: 'ORD-' + Date.now(),
        customer: customers.find(c => c._id === orderForm.customer) || { name: 'New' },
        items: cart.map(i => ({ ...i, total: i.price * i.quantity })),
        subtotal, tax: taxAmount, discount: discountAmount, total: grandTotal,
        status: 'confirmed', paymentMethod: orderForm.paymentMethod, createdAt: new Date()
      };
      setOrders([newOrder, ...orders]);
    }
    setCart([]);
    setOrderForm({ customer: '', paymentMethod: 'cash', tax: 0, discount: 0, notes: '' });
    setShowModal(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, status);
      loadData();
    } catch (err) {
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try { await orderAPI.delete(id); loadData(); }
    catch (err) { setOrders(orders.filter(o => o._id !== id)); }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ShoppingCart size={28} className="text-primary-600" /> Orders</h1>
          <p className="text-slate-500 mt-1">Track and manage customer orders</p>
        </div>
        <motion.button whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(59,130,246,0.4)' }} whileTap={{ scale: 0.97 }} onClick={() => setShowModal(true)} className="btn-primary gap-2">
          <Plus size={18} /> New Order
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'from-primary-500 to-indigo-600' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'from-amber-500 to-orange-600' },
          { label: 'Revenue', value: `$${totalRevenue.toFixed(0).toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-teal-600' },
          { label: 'Avg Order', value: `$${(totalRevenue / (orders.length || 1)).toFixed(0)}`, icon: Package, color: 'from-purple-500 to-violet-600' },
        ].map((s, i) => (
          <motion.div key={s.label} whileHover={{ y: -3 }} className="card p-4 flex items-center gap-4">
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ delay: i * 0.1, duration: 4, repeat: Infinity }} className={`p-3 rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
              <s.icon size={22} />
            </motion.div>
            <div>
              <p className="text-slate-500 text-sm">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by order # or customer..." className="input pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input sm:w-48" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </motion.div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((o, idx) => {
            const st = statusStyle(o.status);
            const Icon = st.icon;
            return (
              <motion.div
                key={o._id}
                variants={itemVariants}
                layout
                whileHover={{ scale: 1.005, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                className="card p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-14 h-14 bg-gradient-to-br from-primary-100 to-indigo-100 rounded-2xl flex items-center justify-center text-primary-700 shadow-sm flex-shrink-0"
                    >
                      <ShoppingCart size={24} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 font-mono">{o.orderNumber}</h3>
                        <span className={`badge ${st.bg} ${st.text} capitalize flex items-center gap-1`}>
                          <Icon size={12} /> {o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1) : "Pending"}
                        </span>
                        <span className="badge bg-slate-100 text-slate-600 capitalize">{o.paymentMethod?.replace('_', ' ')}</span>
                      </div>
                      <p className="text-slate-600 font-medium">{o.customer?.name}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(o.createdAt).toLocaleString()}</span>
                        <span>•</span>
                        <span>{o.items?.length || 0} items</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="text-right sm:pr-4 sm:border-r border-slate-200">
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="text-2xl font-bold text-slate-800">${o.total?.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-1.5 justify-center sm:justify-start">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setViewOrder(o)} className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg" title="View Details">
                        <Eye size={16} />
                      </motion.button>
                      {o.status !== 'delivered' && o.status !== 'cancelled' && (
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                          className="px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                          {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                      )}
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(o._id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-slate-400 card">No orders found</motion.div>
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-primary-50 to-indigo-50">
                <h2 className="text-xl font-bold text-slate-800">Create New Order</h2>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => { setShowModal(false); setCart([]); }} className="p-2 rounded-lg hover:bg-white/70"><X size={20} /></motion.button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label">Customer *</label>
                    <select required className="input" value={orderForm.customer} onChange={(e) => setOrderForm({ ...orderForm, customer: e.target.value })}>
                      <option value="">Select customer</option>
                      {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div><label className="label">Payment Method *</label>
                    <select className="input" value={orderForm.paymentMethod} onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                  <div><label className="label">Tax %</label><input type="number" min="0" className="input" value={orderForm.tax} onChange={(e) => setOrderForm({ ...orderForm, tax: Number(e.target.value) })} /></div>
                  <div><label className="label">Discount %</label><input type="number" min="0" className="input" value={orderForm.discount} onChange={(e) => setOrderForm({ ...orderForm, discount: Number(e.target.value) })} /></div>
                </div>

                <div>
                  <label className="label">Add Products</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {products.map(p => (
                      <motion.button
                        key={p._id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addToCart(p)}
                        disabled={p.stock === 0}
                        className="p-2.5 text-left border border-slate-200 rounded-xl hover:border-primary-300 hover:bg-primary-50/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                        <div className="flex justify-between mt-1 text-xs">
                          <span className="text-primary-600 font-medium">${p.price}</span>
                          <span className={`${p.stock <= 3 ? 'text-amber-600' : 'text-slate-500'}`}>{p.stock} in stock</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {cart.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr><th className="px-4 py-2.5 text-left">Product</th><th className="px-4 py-2.5 text-right">Price</th><th className="px-4 py-2.5 text-center w-32">Qty</th><th className="px-4 py-2.5 text-right">Total</th><th className="px-2 py-2.5 w-10"></th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {cart.map(i => (
                            <tr key={i.product} className="hover:bg-slate-50">
                              <td className="px-4 py-2.5 font-medium">{i.name}</td>
                              <td className="px-4 py-2.5 text-right text-slate-600">${i.price.toFixed(2)}</td>
                              <td className="px-4 py-2.5">
                                <div className="flex items-center justify-center gap-1">
                                  <button type="button" onClick={() => updateQty(i.product, i.quantity - 1)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">−</button>
                                  <input type="number" min="1" max={i.stock} value={i.quantity} onChange={(e) => updateQty(i.product, Number(e.target.value))} className="w-12 text-center border border-slate-200 rounded-md py-1 text-sm" />
                                  <button type="button" onClick={() => updateQty(i.product, i.quantity + 1)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">+</button>
                                </div>
                              </td>
                              <td className="px-4 py-2.5 text-right font-semibold text-slate-800">${(i.price * i.quantity).toFixed(2)}</td>
                              <td className="px-2 py-2.5"><button type="button" onClick={() => setCart(cart.filter(x => x.product !== i.product))} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">✕</button></td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-50 text-sm">
                          <tr><td colSpan={3} className="px-4 py-2 text-right text-slate-600">Subtotal</td><td className="px-4 py-2 text-right font-semibold">${subtotal.toFixed(2)}</td><td></td></tr>
                          {taxAmount > 0 && <tr><td colSpan={3} className="px-4 py-2 text-right text-slate-600">Tax ({orderForm.tax}%)</td><td className="px-4 py-2 text-right font-semibold text-amber-600">+${taxAmount.toFixed(2)}</td><td></td></tr>}
                          {discountAmount > 0 && <tr><td colSpan={3} className="px-4 py-2 text-right text-slate-600">Discount ({orderForm.discount}%)</td><td className="px-4 py-2 text-right font-semibold text-emerald-600">−${discountAmount.toFixed(2)}</td><td></td></tr>}
                          <tr><td colSpan={3} className="px-4 py-2.5 text-right text-lg font-bold text-slate-800">Total</td><td className="px-4 py-2.5 text-right text-xl font-bold text-primary-600">${grandTotal.toFixed(2)}</td><td></td></tr>
                        </tfoot>
                      </table>
                    </motion.div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-200 flex gap-3 bg-slate-50">
                <button type="button" onClick={() => { setShowModal(false); setCart([]); }} className="btn-secondary flex-1">Cancel</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={submitOrder} disabled={!orderForm.customer || cart.length === 0} className="btn-primary flex-1">
                  Place Order • ${grandTotal.toFixed(2)}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {viewOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewOrder(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-primary-50 to-indigo-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 font-mono">{viewOrder.orderNumber}</h2>
                  <span className={`badge ${statusStyle(viewOrder.status).bg} ${statusStyle(viewOrder.status).text} capitalize mt-1`}>{viewOrder.status ? viewOrder.status.charAt(0).toUpperCase() + viewOrder.status.slice(1) : "Pending"}</span>
                </div>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setViewOrder(null)} className="p-2 rounded-lg hover:bg-white/70"><X size={20} /></motion.button>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700"><UserCircle2 size={22} /></div>
                  <div>
                    <p className="font-semibold text-slate-800">{viewOrder.customer?.name}</p>
                    {viewOrder.customer?.email && <p className="text-sm text-slate-500">{viewOrder.customer.email}</p>}
                    {viewOrder.customer?.phone && <p className="text-sm text-slate-500">{viewOrder.customer.phone}</p>}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Items</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50"><tr><th className="px-4 py-2 text-left">Product</th><th className="px-4 py-2 text-center">Qty</th><th className="px-4 py-2 text-right">Price</th><th className="px-4 py-2 text-right">Total</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {viewOrder.items?.map((i, idx) => (
                          <tr key={idx}><td className="px-4 py-2.5">{i.name}</td><td className="px-4 py-2.5 text-center">×{i.quantity}</td><td className="px-4 py-2.5 text-right">${i.price?.toFixed(2)}</td><td className="px-4 py-2.5 text-right font-semibold">${(i.total || i.price * i.quantity).toFixed(2)}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-semibold">${viewOrder.subtotal?.toFixed(2)}</span></div>
                  {viewOrder.tax > 0 && <div className="flex justify-between"><span className="text-slate-600">Tax</span><span className="font-semibold text-amber-600">+${viewOrder.tax?.toFixed(2)}</span></div>}
                  {viewOrder.discount > 0 && <div className="flex justify-between"><span className="text-slate-600">Discount</span><span className="font-semibold text-emerald-600">−${viewOrder.discount?.toFixed(2)}</span></div>}
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-base"><span className="font-bold text-slate-800">Total</span><span className="font-bold text-primary-600 text-lg">${viewOrder.total?.toFixed(2)}</span></div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
                <button onClick={() => setViewOrder(null)} className="btn-primary flex-1">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

