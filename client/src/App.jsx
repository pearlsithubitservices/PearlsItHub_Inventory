import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Products from './pages/product_management/Products';
import Stock from './pages/stock_management/Stock';
import PurchaseOrders from './pages/purchase_management/PurchaseOrders';
import AddOrder from './pages/purchase_management/AddOrder';
import Vendors from './pages/vendor_management/Vendors';
import Suppliers from './pages/vendor_management/Suppliers';
import Customers from './pages/customer_management/Customers';
import Orders from './pages/order_management/Orders';
import ProductHistory from './pages/product_management/ProductHistory';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Layout from './components/common/Layout';
import { FileQuestion } from 'lucide-react';

const Placeholder = ({ title, description, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="h-full flex flex-col items-center justify-center min-h-[60vh]"
  >
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#0a57c4]/10 to-[#1e5fa5]/20 flex items-center justify-center mb-6 border border-[#1e5fa5]/20 shadow-lg"
    >
      <Icon size={52} className="text-[#1e5fa5]" />
    </motion.div>
    <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">{title}</h2>
    <p className="text-slate-500 text-lg max-w-md text-center font-medium">{description}</p>
    <div className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
      <span className="text-2xl">🚧</span>
      <p className="text-sm font-semibold text-amber-700">Coming Soon — Design will be updated later</p>
    </div>
  </motion.div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e5fa5] border-t-transparent" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="stock" element={<Stock />} />
          <Route path="product-history" element={<ProductHistory />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="add-order" element={<AddOrder />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="inventory-maintenance" element={<Placeholder title="Inventory Maintenance" description="Stock counts, cycle counts, and inventory adjustments." icon={FileQuestion} />} />
          <Route path="warranty" element={<Placeholder title="Warranty Tracking" description="Track product warranties, claims, and service contracts." icon={FileQuestion} />} />
          <Route path="audit" element={<Placeholder title="Inventory Audit" description="Comprehensive audit trails and reconciliation reports." icon={FileQuestion} />} />
          <Route path="reports" element={<Placeholder title="Reports & Analytics" description="Advanced reporting, business intelligence, and custom dashboards." icon={FileQuestion} />} />
          <Route path="notifications" element={<Placeholder title="Notifications & Alerts" description="Low stock alerts, expirations, and system notifications." icon={FileQuestion} />} />
          <Route path="users" element={<Placeholder title="User & Role Management" description="Manage users, roles, permissions, and access control." icon={FileQuestion} />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
