import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Printer, ChevronDown,
  Package, TrendingUp, TrendingDown, ArrowUpDown, Clock,
  FileText, Plus, Filter, Calendar, Eye
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
};

const StatCard = ({ icon: Icon, label, value, change, changeType = 'up', delay = 0 }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -5, boxShadow: '0 25px 45px -15px rgba(10,37,64,0.18)' }}
    transition={{ delay }}
    className="relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_8px_rgba(10,37,64,0.04)] overflow-hidden group"
  >
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-transparent" />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[14px] font-semibold text-slate-600 tracking-wide">{label}</p>
        <motion.p
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
          className="mt-2 text-[28px] font-extrabold text-[#1e5fa5] tracking-tight leading-none"
        >
          {value}
        </motion.p>
      </div>
      <motion.div
        whileHover={{ scale: 1.12, rotate: 8 }}
        className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-500 group-hover:bg-gradient-to-br group-hover:from-[#0a57c4]/10 group-hover:to-[#1e5fa5]/15 group-hover:text-[#1e5fa5] transition-all duration-300"
      >
        <Icon size={22} strokeWidth={2} />
      </motion.div>
    </div>
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay + 0.3, duration: 0.4 }}
      className={`mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold border ${
        changeType === 'up'
          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
          : 'bg-red-50 text-red-600 border-red-100'
      }`}
    >
      <span>{changeType === 'up' ? '↑' : '↓'}</span> {change}
    </motion.div>
  </motion.div>
);

const stockTrendData = [
  { month: 'Jan', value: 420 },
  { month: 'Feb', value: 380 },
  { month: 'Mar', value: 395 },
  { month: 'Apr', value: 450 },
  { month: 'May', value: 410 },
  { month: 'Jun', value: 460 },
];

const movementLogData = [
  { id: 1, date: '10-06-2026', status: 'Stock Out', quantity: -420, warehouse: 'Mumbai-WH', reference: 'DSP-90340', performedBy: 'Dinesh' },
  { id: 2, date: '11-06-2026', status: 'Stock In', quantity: 350, warehouse: 'Chennai-WH', reference: 'TRF-90346', performedBy: 'Karan' },
  { id: 3, date: '12-06-2026', status: 'Stock Out', quantity: -600, warehouse: 'Chennai-WH', reference: 'GRN-90347', performedBy: 'Selvan' },
  { id: 4, date: '13-06-2026', status: 'Transfer', quantity: 100, warehouse: 'Mumbai-WH', reference: 'TRF-90348', performedBy: 'Vignesh' },
  { id: 5, date: '13-06-2026', status: 'Stock Out', quantity: -100, warehouse: 'Chennai-WH', reference: 'GRN-90349', performedBy: 'Selvan' },
  { id: 6, date: '14-06-2026', status: 'Stock In', quantity: 200, warehouse: 'Mumbai-WH', reference: 'DSP-90350', performedBy: 'Logan' },
  { id: 7, date: '15-06-2026', status: 'Adjustment', quantity: -200, warehouse: 'Chennai-WH', reference: 'TRF-90351', performedBy: 'Dinesh' },
  { id: 8, date: '16-06-2026', status: 'Transfer', quantity: 200, warehouse: 'Chennai-WH', reference: 'GRN-90352', performedBy: 'Vignesh' },
];

const transferRecordsData = [
  { id: 1, date: '10-06-2026', fromWarehouse: 'Chennai-WH', toWarehouse: 'Mumbai-WH', quantity: '600kg', transferId: 'TRF-90345', status: 'Completed', unitPrice: 'Ramesh' },
  { id: 2, date: '11-06-2026', fromWarehouse: 'Mumbai-WH', toWarehouse: 'Chennai-WH', quantity: '350kg', transferId: 'TRF-90346', status: 'In Transit', unitPrice: 'Karan' },
  { id: 3, date: '12-06-2026', fromWarehouse: 'Coimbatore WH-3', toWarehouse: 'Chennai-WH', quantity: '150kg', transferId: 'TRF-90347', status: 'In Transit', unitPrice: 'Selvan' },
  { id: 4, date: '13-06-2026', fromWarehouse: 'Pune-WH', toWarehouse: 'Mumbai-WH', quantity: '200kg', transferId: 'TRF-90348', status: 'Completed', unitPrice: 'Ramesh' },
  { id: 5, date: '13-06-2026', fromWarehouse: 'Mumbai', toWarehouse: 'Chennai-WH', quantity: '100kg', transferId: 'TRF-90349', status: 'Completed', unitPrice: 'Selvan' },
  { id: 6, date: '14-06-2026', fromWarehouse: 'Chennai-WH', toWarehouse: 'Mumbai-WH', quantity: '200kg', transferId: 'TRF-90350', status: 'Completed', unitPrice: 'Logan' },
  { id: 7, date: '15-06-2026', fromWarehouse: 'Coimbatore-WH', toWarehouse: 'Chennai-WH', quantity: '300kg', transferId: 'TRF-90351', status: 'Completed', unitPrice: 'Dinesh' },
  { id: 8, date: '16-06-2026', fromWarehouse: 'Pune-WH', toWarehouse: 'Chennai-WH', quantity: '250kg', transferId: 'TRF-90352', status: 'Completed', unitPrice: 'Dinesh' },
];

const adjustmentsData = [
  { id: 1, date: '10-06-2026', adjustmentId: 'Chennai-WH', reason: 'Moisture damage — audit write-off', quantity: 6, warehouse: 'Chennai-WH', approvedBy: 'Ramesh' },
  { id: 2, date: '13-06-2026', adjustmentId: 'Mumbai-WH', reason: 'Cycle count correction', quantity: 3, warehouse: 'Chennai-WH', approvedBy: 'Karan' },
  { id: 3, date: '17-06-2026', adjustmentId: 'Coimbatore WH-3', reason: 'Packaging spillage', quantity: 15, warehouse: 'Mumbai-WH', approvedBy: 'Selvan' },
  { id: 4, date: '19-06-2026', adjustmentId: 'Pune-WH', reason: 'Pest infestation disposal', quantity: 20, warehouse: 'Mumbai-WH', approvedBy: 'Ramesh' },
  { id: 5, date: '20-06-2026', adjustmentId: 'Mumbai', reason: 'Color change', quantity: 100, warehouse: 'Mumbai-WH', approvedBy: 'Selvan' },
  { id: 6, date: '24-06-2026', adjustmentId: 'Chennai-WH', reason: 'Breaking', quantity: 20, warehouse: 'Pune-WH', approvedBy: 'Logan' },
  { id: 7, date: '25-06-2026', adjustmentId: 'Coimbatore-WH', reason: 'Not working', quantity: 30, warehouse: 'Chennai-WH', approvedBy: 'Dinesh' },
  { id: 8, date: '26-06-2026', adjustmentId: 'Pune-WH', reason: 'Color change', quantity: 25, warehouse: 'Chennai-WH', approvedBy: 'Dinesh' },
];

const timelineData = [
  { id: 1, type: 'Stock Out', title: 'Stock Out — Dispatched to Madurai Retail Hub', desc: '420 kg dispatched from Chennai — WH-01 against sales order SO-9021.', ref: 'DSP-88213', by: 'Karthick M.', balance: '4,260 kg', date: '9 July, 4:12 PM' },
  { id: 2, type: 'Stock In', title: 'Stock In — Received from Vendor Karuppusamy Agro Traders', desc: '1,200 kg received into Chennai — WH-01 under purchase order PO-4471.', ref: 'GRN-51402', by: 'Priya S.', balance: '4,680 kg', date: '8 July, 11:05 AM' },
  { id: 3, type: 'Transfer', title: 'Transfer — Chennai to Coimbatore', desc: '600 kg moved from WH-01 to WH-03 to rebalance regional demand.', ref: 'TRF-30119', by: 'Ramesh N.', balance: '3,480 kg', date: '7 July, 8:45 PM' },
  { id: 4, type: 'Adjustment', title: 'Adjustment — Moisture Damage Write-off', desc: '35 kg written off following audit inspection of bag lot L-2231.', ref: 'ADJ-11007', by: 'Selvi V.', balance: '4,080 kg', date: '6 July, 9:15 PM' },
  { id: 5, type: 'Stock Out', title: 'Stock Out — Dispatched to Trichy Distribution Center', desc: '800 kg dispatched from Chennai — WH-01 against sales order SO-8987.', ref: 'DSP-88190', by: 'Karthik M.', balance: '4,115 kg', date: '5 July, 5:52 PM' },
];

const statusBadge = (status) => {
  const styles = {
    'Stock In': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Stock Out': 'bg-red-100 text-red-600 border-red-200',
    'Transfer': 'bg-purple-100 text-purple-700 border-purple-200',
    'Adjustment': 'bg-orange-100 text-orange-600 border-orange-200',
    'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'In Transit': 'bg-orange-100 text-orange-600 border-orange-200',
    'Return in': 'bg-red-100 text-red-600 border-red-200',
  };
  return styles[status] || 'bg-slate-100 text-slate-600 border-slate-200';
};

const timelineColor = {
  'Stock Out': 'bg-red-500',
  'Stock In': 'bg-emerald-500',
  'Transfer': 'bg-blue-500',
  'Adjustment': 'bg-orange-400',
};

const Dropdown = ({ label, onChange, options }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative z-20">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-[13px] font-bold border border-slate-200 hover:bg-slate-200/70 transition-colors min-w-[140px] justify-between"
      >
        {label} <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 max-h-60 overflow-y-auto"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-[#0a57c4]/10 hover:text-[#1e5fa5] transition-colors"
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const IconBtn = ({ icon: Icon }) => (
  <motion.button
    whileHover={{ scale: 1.08, y: -1 }}
    whileTap={{ scale: 0.94 }}
    className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center hover:bg-[#0a57c4]/10 hover:text-[#1e5fa5] hover:border-[#1e5fa5]/20 transition-all duration-200"
  >
    <Icon size={17} />
  </motion.button>
);

const PageBtn = ({ n, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    className={`w-9 h-9 rounded-lg text-[13px] font-bold transition-all duration-200 ${
      active
        ? 'bg-gradient-to-br from-[#0a57c4] to-[#1e5fa5] text-white shadow-md shadow-[#1e5fa5]/25'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60'
    }`}
  >
    {n}
  </motion.button>
);

const PageIconBtn = ({ label, disabled, onClick }) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.08 } : {}}
    whileTap={!disabled ? { scale: 0.92 } : {}}
    onClick={onClick}
    disabled={disabled}
    className="w-9 h-9 rounded-lg text-[16px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
  >
    {label}
  </motion.button>
);

function MovementLogTab() {
  const [category, setCategory] = useState('All Categories');
  const [dateFrom, setDateFrom] = useState('10/05/2026');
  const [dateTo, setDateTo] = useState('11-05-2026');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <Dropdown label={category} onChange={setCategory} options={['All Categories', 'Electronics', 'Furnitures', 'Accessories', 'Hardwares']} />
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[13px] font-semibold text-slate-700 w-[140px] focus:outline-none focus:ring-2 focus:ring-[#1e5fa5]/30"
              />
            </div>
            <span className="text-slate-400 text-[13px] font-medium">to</span>
            <div className="relative">
              <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[13px] font-semibold text-slate-700 w-[140px] focus:outline-none focus:ring-2 focus:ring-[#1e5fa5]/30"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[14px] font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5fa5]/30 focus:border-[#1e5fa5]/30 focus:bg-white transition-all duration-200"
            />
          </div>
          <IconBtn icon={Download} />
          <IconBtn icon={Printer} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-y border-slate-200/70 bg-slate-50/50">
              {['DATE', 'STATUS', 'QUANTITY', 'WAREHOUSE', 'REFERENCE', 'PERFORMED BY'].map((h) => (
                <th key={h} className="px-5 py-4 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {movementLogData.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.04, duration: 0.35 }}
                  whileHover={{ backgroundColor: 'rgba(30, 95, 165, 0.025)' }}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="px-5 py-4 text-[14px] font-semibold text-slate-700">{row.date}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold border ${statusBadge(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className={`px-5 py-4 text-[14px] font-extrabold ${row.quantity < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {row.quantity > 0 ? '+' : ''}{row.quantity}
                  </td>
                  <td className="px-5 py-4 text-[14px] font-semibold text-slate-600">{row.warehouse}</td>
                  <td className="px-5 py-4 text-[13px] font-bold text-slate-700 font-mono">{row.reference}</td>
                  <td className="px-5 py-4 text-[14px] font-semibold text-slate-600">{row.performedBy}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="px-5 pt-4 pb-5 flex items-center justify-center">
        <div className="flex items-center gap-1.5">
          <PageIconBtn label="‹" disabled={currentPage === 1} onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} />
          {[1, 2, 3, 4, 5].map((n) => (
            <PageBtn key={n} n={n} active={currentPage === n} onClick={() => setCurrentPage(n)} />
          ))}
          <span className="text-slate-400 text-[13px] font-semibold px-1">...</span>
          <PageBtn n={400} active={currentPage === 400} onClick={() => setCurrentPage(400)} />
          <PageIconBtn label="›" onClick={() => setCurrentPage(currentPage + 1)} />
        </div>
      </div>
    </div>
  );
}

function TransferRecordsTab() {
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('Status: All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <Dropdown label={category} onChange={setCategory} options={['All Categories', 'Electronics', 'Furnitures', 'Accessories', 'Hardwares']} />
          <Dropdown label={status} onChange={setStatus} options={['Status: All', 'Completed', 'In Transit', 'Pending']} />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-[13px] font-bold border border-slate-200 hover:bg-slate-200/70 transition-colors"
          >
            <Filter size={15} /> Filter <ChevronDown size={14} />
          </motion.button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[14px] font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5fa5]/30 focus:border-[#1e5fa5]/30 focus:bg-white transition-all duration-200"
            />
          </div>
          <IconBtn icon={Download} />
          <IconBtn icon={Printer} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-y border-slate-200/70 bg-slate-50/50">
              {['DATE', 'FROM WAREHOUSE', 'TO WAREHOUSE', 'QUANTITY', 'TRANSFER ID', 'STATUS', 'UNIT PRICE'].map((h) => (
                <th key={h} className="px-5 py-4 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {transferRecordsData.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.04, duration: 0.35 }}
                  whileHover={{ backgroundColor: 'rgba(30, 95, 165, 0.025)' }}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="px-5 py-4 text-[14px] font-semibold text-slate-700">{row.date}</td>
                  <td className="px-5 py-4 text-[14px] font-semibold text-slate-600">{row.fromWarehouse}</td>
                  <td className="px-5 py-4 text-[14px] font-semibold text-slate-600">{row.toWarehouse}</td>
                  <td className="px-5 py-4 text-[14px] font-bold text-slate-800">{row.quantity}</td>
                  <td className="px-5 py-4 text-[13px] font-bold text-slate-700 font-mono">{row.transferId}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold border ${statusBadge(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[14px] font-semibold text-slate-600">{row.unitPrice}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="px-5 pt-4 pb-5 flex items-center justify-center">
        <div className="flex items-center gap-1.5">
          <PageIconBtn label="‹" disabled={currentPage === 1} onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} />
          {[1, 2, 3, 4, 5].map((n) => (
            <PageBtn key={n} n={n} active={currentPage === n} onClick={() => setCurrentPage(n)} />
          ))}
          <span className="text-slate-400 text-[13px] font-semibold px-1">...</span>
          <PageBtn n={400} active={currentPage === 400} onClick={() => setCurrentPage(400)} />
          <PageIconBtn label="›" onClick={() => setCurrentPage(currentPage + 1)} />
        </div>
      </div>
    </div>
  );
}

function AdjustmentsRecordsTab() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <h3 className="text-[22px] font-extrabold text-slate-900 tracking-tight">Adjustments Records</h3>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[14px] font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5fa5]/30 focus:border-[#1e5fa5]/30 focus:bg-white transition-all duration-200"
            />
          </div>
          <Dropdown label="All" onChange={() => {}} options={['All', 'Completed', 'Pending']} />
          <IconBtn icon={Download} />
          <IconBtn icon={Printer} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-y border-slate-200/70 bg-slate-50/50">
              {['DATE', 'ADJUSTMENT ID', 'REASON', 'QUANTITY', 'WAREHOUSE', 'APPROVED BY'].map((h) => (
                <th key={h} className="px-5 py-4 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {adjustmentsData.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.04, duration: 0.35 }}
                  whileHover={{ backgroundColor: 'rgba(30, 95, 165, 0.025)' }}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="px-5 py-4 text-[14px] font-semibold text-slate-700">{row.date}</td>
                  <td className="px-5 py-4 text-[13px] font-bold text-slate-700">{row.adjustmentId}</td>
                  <td className="px-5 py-4 text-[14px] font-semibold text-slate-600">{row.reason}</td>
                  <td className="px-5 py-4 text-[14px] font-extrabold text-slate-800">{row.quantity}</td>
                  <td className="px-5 py-4 text-[14px] font-semibold text-slate-600">{row.warehouse}</td>
                  <td className="px-5 py-4 text-[14px] font-semibold text-slate-600">{row.approvedBy}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="px-5 pt-4 pb-5 flex items-center justify-center">
        <div className="flex items-center gap-1.5">
          <PageIconBtn label="‹" disabled={currentPage === 1} onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} />
          {[1, 2, 3, 4, 5].map((n) => (
            <PageBtn key={n} n={n} active={currentPage === n} onClick={() => setCurrentPage(n)} />
          ))}
          <span className="text-slate-400 text-[13px] font-semibold px-1">...</span>
          <PageBtn n={400} active={currentPage === 400} onClick={() => setCurrentPage(400)} />
          <PageIconBtn label="›" onClick={() => setCurrentPage(currentPage + 1)} />
        </div>
      </div>
    </div>
  );
}

function StockMovementTimelineTab() {
  const [warehouse, setWarehouse] = useState('All Warehouse');
  const [search, setSearch] = useState('');

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <Dropdown label={warehouse} onChange={setWarehouse} options={['All Warehouse', 'Chennai-WH', 'Mumbai-WH', 'Coimbatore-WH', 'Pune-WH']} />
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[14px] font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5fa5]/30 focus:border-[#1e5fa5]/30 focus:bg-white transition-all duration-200"
            />
          </div>
          <IconBtn icon={Download} />
          <IconBtn icon={Printer} />
        </div>
      </div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(10,37,64,0.04)] p-6 mb-6"
      >
        <div className="mb-4">
          <h3 className="text-[18px] font-extrabold text-slate-900 tracking-tight">Stock Level Trends</h3>
          <p className="text-[13px] text-slate-500 font-medium">Last 6 Months</p>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stockTrendData}>
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e5fa5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1e5fa5" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Area type="monotone" dataKey="value" stroke="#1e5fa5" strokeWidth={2.5} fill="url(#stockGradient)" dot={{ r: 5, fill: '#1e5fa5', strokeWidth: 2, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-3 h-3 rounded-full bg-[#1e5fa5]" />
          <span className="text-[13px] font-semibold text-slate-600">Stock value</span>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(10,37,64,0.04)] overflow-hidden"
      >
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <h3 className="text-[20px] font-extrabold text-slate-900 tracking-tight">Movement Timeline</h3>
        </div>
        <div className="px-6 py-4">
          {timelineData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.08 }}
              className="flex gap-4 pb-6 last:pb-0 relative"
            >
              {idx < timelineData.length - 1 && (
                <div className="absolute left-[11px] top-[28px] bottom-0 w-[2px] bg-slate-200" />
              )}
              <div className={`w-6 h-6 rounded-full ${timelineColor[item.type]} flex-shrink-0 mt-1 shadow-sm`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-extrabold text-[#1e5fa5] tracking-tight">{item.title}</p>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">{item.desc}</p>
                    <p className="text-[13px] text-slate-600 mt-1">
                      <span className="font-semibold">Ref:</span> <span className="font-bold">{item.ref}</span>{' '}
                      <span className="font-semibold">By:</span> <span className="font-bold">{item.by}</span>{' '}
                      <span className="font-semibold">Balance after:</span> <span className="font-extrabold text-[#1e5fa5]">{item.balance}</span>
                    </p>
                  </div>
                  <span className="text-[12px] text-slate-400 font-semibold whitespace-nowrap flex-shrink-0">{item.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[12px] font-semibold text-slate-600">Stock In</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-[12px] font-semibold text-slate-600">Stock Out</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-[12px] font-semibold text-slate-600">Transfer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400" />
            <span className="text-[12px] font-semibold text-slate-600">Adjustment</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProductHistory() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full py-32"><div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e5fa5] border-t-transparent" /></div>;

  const tabs = [
    { id: 'log', label: 'Movement log' },
    { id: 'transfer', label: 'Transfer Records' },
    { id: 'adjustments', label: 'Adjustments Records' },
    { id: 'timeline', label: 'Stock Movement Timeline' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex justify-end mb-5">
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -10px rgba(10,37,64,0.5)' }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow-md transition-all"
          style={{ background: 'linear-gradient(135deg, #0a57c4 0%, #1e5fa5 100%)' }}
        >
          <Plus size={18} />
          Record Movement
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <StatCard icon={Package} label="Total Stock In" value="1,200" change="+12.4%" delay={0} />
        <StatCard icon={TrendingDown} label="Total Stock Out" value="148" change="+8.4%" delay={0.05} />
        <StatCard icon={ArrowUpDown} label="Net Movement" value="24" change="+8.4%" delay={0.1} />
        <StatCard icon={Clock} label="Last Movement" value="12" change="+8.4%" delay={0.15} />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(10,37,64,0.04)] overflow-hidden"
      >
        <div className="border-b border-slate-200/70 px-6">
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-4 text-[14px] font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#1e5fa5]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0a57c4] to-[#1e5fa5] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'log' && <MovementLogTab />}
              {activeTab === 'transfer' && <TransferRecordsTab />}
              {activeTab === 'adjustments' && <AdjustmentsRecordsTab />}
              {activeTab === 'timeline' && <StockMovementTimelineTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
