import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  History,
  ShoppingCart,
  Wrench,
  ShieldCheck,
  Building2,
  FileSearch,
  BarChart3,
  Bell,
  Users,
  LogOut,
  Settings,
  Globe,
  Menu,
  X,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const pageMeta = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Inventory Overview",
  },
  "/products": {
    title: "Product Management",
    subtitle: "Manage, track, and optimize your inventory status in real-time.",
  },
  "/stock": {
    title: "Stock Management",
    subtitle:
      "Monitor, track, and update your inventory status with all contributors.",
  },
  "/product-history": {
    title: "Product Movement History",
    subtitle:
      "Track stock-in, stock-out, transfers and adjustments for every product across warehouses.",
  },
  "/purchase-orders": {
    title: "Purchase Orders",
    subtitle: "Create, track, and manage vendor purchase orders and receipts.",
  },
  "/add-order": {
    title: "Purchase Orders",
    subtitle: "Create, track, and manage vendor purchase orders and receipts.",
  },
  "/inventory-maintenance": {
    title: "Inventory Maintenance",
    subtitle: "Stock counts, cycle counts, and inventory adjustments.",
  },
  "/warranty": {
    title: "Warranty Tracking",
    subtitle: "Track product warranties, claims, and service contracts.",
  },
  "/vendors": {
    title: "Vendors & Procurement",
    subtitle:
      "Supplier database, procurement pipeline, and vendor performance.",
  },
  "/audit": {
    title: "Inventory Audit",
    subtitle: "Comprehensive audit trails and reconciliation reports.",
  },
  "/reports": {
    title: "Reports & Analytics",
    subtitle:
      "Advanced reporting, business intelligence, and custom dashboards.",
  },
  "/notifications": {
    title: "Notifications & Alerts",
    subtitle: "Low stock alerts, expirations, and system notifications.",
  },
  "/users": {
    title: "User & Role Management",
    subtitle: "Manage users, roles, permissions, and access control.",
  },
};

const navItems = [
  {
    group: "MAIN",
    items: [
      { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/products", icon: Package, label: "Product Management" },
      { path: "/stock", icon: Warehouse, label: "Stock Management" },
      {
        path: "/product-history",
        icon: History,
        label: "Product Movement History",
        children: [
          { path: "/product-history?tab=all", label: "All Movements" },
          { path: "/product-history?tab=stock-in", label: "Stock In" },
          { path: "/product-history?tab=stock-out", label: "Stock Out" },
          { path: "/product-history?tab=transfer", label: "Stock Transfer" },
          { path: "/product-history?tab=returns", label: "Returns" },
          { path: "/product-history?tab=adjustments", label: "Adjustments" },
        ],
      },
      {
        path: "/purchase-orders",
        icon: ShoppingCart,
        label: "Purchase Orders",
      },
      {
        path: "/inventory-maintenance",
        icon: Wrench,
        label: "Inventory Maintenance",
      },
      { path: "/warranty", icon: ShieldCheck, label: "Warranty Tracking" },
      { path: "/vendors", icon: Building2, label: "Vendors & Procurement" },
      { path: "/audit", icon: FileSearch, label: "Inventory Audit" },
      { path: "/reports", icon: BarChart3, label: "Reports & Analytics" },
      { path: "/notifications", icon: Bell, label: "Notifications & Alerts" },
      { path: "/users", icon: Users, label: "User & Role Management" },
    ],
  },
];

function LayoutContent() {
  const { logout } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({ "/product-history": true });

  const meta = pageMeta[location.pathname] || {
    title:
      navItems[0].items.find((i) => i.path === location.pathname)?.label ||
      "Inventory System",
    subtitle: "Manage your inventory operations efficiently.",
  };

  const toggleExpand = (path) => {
    setExpandedItems((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const isActive = (path) => location.pathname === path;

  const sidebarWidth = sidebarCollapsed ? 72 : 240;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #eef2f7 100%)",
      }}
    >
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-shrink-0 flex flex-col h-full z-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #0a2540 0%, #0d3054 60%, #0a2540 100%)",
        }}
      >
        {/* Logo */}
        <div className="px-4 py-4 flex items-center gap-2 border-b border-white/10">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur flex items-center justify-center text-white shadow-lg border border-white/10 flex-shrink-0"
          >
            <Globe size={20} className="text-sky-300" />
          </motion.div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="font-extrabold text-white text-[18px] tracking-tight">
                  PEARLS IT HUB
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-4">
          {navItems.map((group) => (
            <div key={group.group}>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-[0.12em]"
                  >
                    {group.group}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-0.5">
                {group.items.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  const hasChildren = item.children && item.children.length > 0;
                  const isExpanded = expandedItems[item.path];
                  const isChildActive = hasChildren && item.children.some(
                    (child) => location.pathname + location.search === child.path
                  );
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                    >
                      {hasChildren ? (
                        <div>
                          <motion.div
                            whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => !sidebarCollapsed && toggleExpand(item.path)}
                            className={`flex items-center ${sidebarCollapsed ? "justify-center" : "px-3"} py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              active || isChildActive
                                ? "bg-[#1e5fa5]/70 text-white shadow-lg shadow-black/10 border border-white/10"
                                : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            <div className={`transition-transform ${active || isChildActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                              <Icon size={16} />
                            </div>
                            {!sidebarCollapsed && (
                              <>
                                <span className="ml-2.5 font-medium text-[13px] flex-1 tracking-wide whitespace-nowrap">
                                  {item.label}
                                </span>
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown size={14} className="text-slate-400" />
                                </motion.div>
                              </>
                            )}
                          </motion.div>
                          <AnimatePresence>
                            {isExpanded && !sidebarCollapsed && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-5 py-1 space-y-0.5">
                                  {item.children.map((child) => {
                                    const childActive = location.pathname + location.search === child.path;
                                    return (
                                      <Link key={child.path} to={child.path}>
                                        <motion.div
                                          whileHover={{ x: 3 }}
                                          whileTap={{ scale: 0.98 }}
                                          className={`flex items-center px-3 py-1.5 rounded-md text-[12px] font-medium transition-all duration-200 ${
                                            childActive
                                              ? "bg-white/15 text-white"
                                              : "text-slate-400 hover:text-white hover:bg-white/5"
                                          }`}
                                        >
                                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${childActive ? "bg-white" : "bg-slate-500"}`} />
                                          {child.label}
                                        </motion.div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link to={item.path} title={sidebarCollapsed ? item.label : ""}>
                          <motion.div
                            whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center ${sidebarCollapsed ? "justify-center" : "px-3"} py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              active
                                ? "bg-[#1e5fa5]/70 text-white shadow-lg shadow-black/10 border border-white/10"
                                : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            <div className={`transition-transform ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                              <Icon size={16} />
                            </div>
                            <AnimatePresence>
                              {!sidebarCollapsed && (
                                <motion.span
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: "auto" }}
                                  exit={{ opacity: 0, width: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="ml-2.5 font-medium text-[13px] flex-1 tracking-wide overflow-hidden whitespace-nowrap"
                                >
                                  {item.label}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div
          className={`px-2 pb-2 space-y-0.5 border-t border-white/5 pt-2 ${sidebarCollapsed ? "flex justify-center" : ""}`}
        >
          <motion.button
            whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            title={sidebarCollapsed ? "Log out" : ""}
            className={`flex items-center ${sidebarCollapsed ? "justify-center" : "w-full px-3"} py-2 rounded-lg text-slate-300 hover:text-white hover:bg-red-500/10 transition-all duration-200`}
          >
            <LogOut size={16} className="text-slate-400" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2.5 font-medium text-[13px] tracking-wide overflow-hidden whitespace-nowrap"
                >
                  Log out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* User Card */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mx-2 mb-3 p-2.5 rounded-xl bg-gradient-to-r from-[#1e5fa5]/80 to-[#2a7ac9]/60 border border-white/10 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold shadow-md overflow-hidden flex-shrink-0">
                  <img
                    src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20male%20portrait%20indian%20manager%20headshot&image_size=square"
                    alt="avatar"
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="absolute text-sm">V</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-[13px] truncate">
                    Vishnu R
                  </p>
                  <p className="text-[11px] text-sky-200/90 truncate">
                    User - Management
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header
          className="h-14 flex items-center px-6 z-10 border-b border-slate-200/60"
          style={{
            background: "linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="mr-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} className="text-slate-600" />
          </button>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.h1
                key={location.pathname + "-title"}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-[20px] font-extrabold text-slate-900 tracking-tight"
              >
                {meta.title}
              </motion.h1>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={location.pathname + "-sub"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-[13px] text-slate-500 -mt-0.5 font-medium"
              >
                {meta.subtitle}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 ml-6 flex-shrink-0"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function Layout() {
  return <LayoutContent />;
}
