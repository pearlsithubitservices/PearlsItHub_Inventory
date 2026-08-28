import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package, PackageCheck, AlertTriangle, XCircle, Boxes,
  Clock, Truck, Wallet, TrendingUp, ChevronDown, Eye
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { dashboardAPI } from '../api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
};
const itemVariants = {
  hidden: { y: 18, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } }
};

const StatCard = ({ icon: Icon, label, value, change, delay = 0, border = 'border-blue-500' }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -3, boxShadow: '0 12px 24px -8px rgba(10, 37, 64, 0.12)' }}
    transition={{ delay }}
    className="relative bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_4px_rgba(10,37,64,0.04)] overflow-hidden group"
  >
    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${border.replace('border-', 'from-').replace('500', '400')} to-transparent`} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">{label}</p>
        <motion.p
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.5, ease: 'easeOut' }}
          className="mt-1.5 text-[22px] font-extrabold text-[#1e5fa5] tracking-tight leading-none"
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </motion.p>
      </div>
      <motion.div
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-500 group-hover:bg-gradient-to-br group-hover:from-[#0a57c4]/10 group-hover:to-[#1e5fa5]/15 group-hover:text-[#1e5fa5] group-hover:border-[#1e5fa5]/20 transition-all duration-300"
      >
        <Icon size={16} strokeWidth={2} />
      </motion.div>
    </div>
    {change && (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.3, duration: 0.4 }}
        className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100"
      >
        <span>↑</span> {change}
      </motion.div>
    )}
  </motion.div>
);

const PIE_COLORS = ['#dc2626', '#10b981', '#1e5fa5', '#8b5cf6', '#f97316'];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data");
      // Fallback to default values
      setStats({
        totalProducts: 0,
        totalCustomers: 0,
        totalSuppliers: 0,
        totalOrders: 0,
        lowStockProducts: 0,
        outOfStock: 0,
        revenue: 0,
        avgOrderValue: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full py-32"><div className="animate-spin rounded-full h-10 w-10 border-4 border-[#1e5fa5] border-t-transparent" /></div>;

  // Prepare chart data from API or use defaults
  const chartData = [
    { name: 'Electronics', value: 30 },
    { name: 'Furniture', value: 45 },
    { name: 'Accessories', value: 50 },
    { name: 'Hardwares', value: 48 },
    { name: 'Others', value: 20 },
  ];

  const monthlyData = [
    { month: 'Jan', value: 40 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 52 },
    { month: 'Apr', value: 47 },
    { month: 'May', value: 55 },
    { month: 'Jun', value: 61 },
    { month: 'Jul', value: 67 },
    { month: 'Aug', value: 72 },
    { month: 'Sep', value: 78 },
    { month: 'Oct', value: 82 },
    { month: 'Nov', value: 81 },
    { month: 'Dec', value: 90 },
  ];

  const lowStock = [
    { name: 'LAPTOPS', category: 'Electronics', stock: 2, status: 'Critical' },
    { name: 'HEAD PHONES', category: 'Electronics', stock: 30, status: 'Low' },
    { name: 'SMART PHONES', category: 'Electronics', stock: 20, status: 'Low' },
    { name: 'DESK LAMP', category: 'Electronics', stock: 10, status: 'Critical' },
    { name: 'KEYBOARD', category: 'Electronics', stock: 2, status: 'Critical' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {/* Stat Cards Row 1 */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={stats?.totalProducts || 0} change="8.4%" delay={0.00} border="border-blue-500" />
        <StatCard icon={PackageCheck} label="Available Products" value={stats?.totalCustomers || 0} change="8.4%" delay={0.05} border="border-blue-500" />
        <StatCard icon={AlertTriangle} label="Low Stock Items" value={stats?.lowStockProducts || 0} change="8.4%" delay={0.10} border="border-blue-500" />
        <StatCard icon={XCircle} label="Out of Stock Items" value={stats?.outOfStock || 0} change="8.4%" delay={0.15} border="border-blue-500" />
      </motion.div>

      {/* Stat Cards Row 2 */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Boxes} label="Total Suppliers" value={stats?.totalSuppliers || 0} change="8.4%" delay={0.20} border="border-blue-500" />
        <StatCard icon={Clock} label="Pending PO" value={stats?.totalOrders || 0} change="8.4%" delay={0.25} border="border-blue-500" />
        <StatCard icon={Truck} label="Total Orders" value={stats?.totalOrders || 0} change="8.4%" delay={0.30} border="border-blue-500" />
        <StatCard icon={Wallet} label="Inventory Value" value={`₹${(stats?.revenue || 0).toLocaleString()}`} change="8.4%" delay={0.35} border="border-blue-500" />
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Pie Chart */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_4px_rgba(10,37,64,0.04)] overflow-hidden"
        >
          <div className="mb-3">
            <h3 className="text-[14px] font-extrabold text-slate-900 tracking-tight">
              Product Distribution
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Current operational status
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative w-[160px] h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(10,37,64,0.1)",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-semibold text-slate-500">Total</span>
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                  className="text-[18px] font-extrabold text-slate-900 tracking-tight"
                >
                  {stats?.totalProducts || 0}
                </motion.span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
            {chartData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.08, duration: 0.4 }}
                className="flex items-center justify-between gap-1 min-w-0 px-1 py-1"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[index] }} />
                  <span className="text-[11px] font-semibold text-slate-600 truncate">{item.name}</span>
                </div>
                <span className="text-[11px] font-extrabold text-slate-900 flex-shrink-0">{item.value}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Area Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_4px_rgba(10,37,64,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="text-[14px] font-extrabold text-slate-900 tracking-tight">Monthly Inventory Growth</h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Asset acquisition and retirement trends</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100"
              >
                <TrendingUp size={10} /> +12.5%
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 hover:bg-slate-200/70 transition-colors"
              >
                This Year <ChevronDown size={10} />
              </motion.button>
            </div>
          </div>

          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Total value</span>
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-[13px] font-extrabold text-slate-900"
            >
              ₹ {(stats?.revenue || 0).toLocaleString()}
            </motion.span>
          </div>

          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} stroke="#cbd5e1" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} stroke="#cbd5e1" axisLine={false} tickLine={false} tickFormatter={(v) => `${v}L`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(10,37,64,0.1)',
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 600
                  }}
                  formatter={(v) => [`${v}L`, 'Inventory']}
                  cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#growthGrad)"
                  dot={{ r: 3, fill: '#ffffff', stroke: '#8b5cf6', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: '#ffffff', stroke: '#8b5cf6', strokeWidth: 2.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Low Stock Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(10,37,64,0.04)] overflow-hidden"
      >
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <h3 className="text-[14px] font-extrabold text-slate-900 tracking-tight">Low Stock Alerts</h3>
          <motion.a
            whileHover={{ scale: 1.03, x: 3 }}
            className="flex items-center gap-1 text-[#1e5fa5] font-bold text-[11px] cursor-pointer hover:underline"
          >
            View All <Eye size={11} />
          </motion.a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/70 border-y border-slate-200/70">
                <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Product Name</th>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Category</th>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Current Stock</th>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((row, idx) => {
                const critical = row.status === 'Critical';
                return (
                  <motion.tr
                    key={row.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.08, duration: 0.4 }}
                    whileHover={{ backgroundColor: 'rgba(30, 95, 165, 0.03)' }}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-4 py-2.5">
                      <span className="text-[12px] font-bold text-slate-800">{row.name}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[12px] font-semibold text-slate-600">{row.category}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[12px] font-extrabold ${critical ? 'text-red-600' : 'text-slate-700'}`}>
                        {row.stock}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          critical
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${critical ? 'bg-red-500' : 'bg-yellow-500'} animate-pulse`} />
                        {row.status}
                      </motion.span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
