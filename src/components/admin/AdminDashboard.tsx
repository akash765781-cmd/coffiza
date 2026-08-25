import React, { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import type { OrderStatus, ReservationStatus } from "@/types/order";
import {
  ShoppingBag,
  Calendar,
  IndianRupee,
  RotateCcw,
  LogOut,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  BarChart3,
  Coffee,
  Trash2,
} from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const {
    orders,
    reservations,
    updateOrderStatus,
    updateReservationStatus,
    resetAllData,
  } = useOrder();

  const [activeTab, setActiveTab] = useState<"orders" | "reservations" | "analytics">("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  // Analytics Metrics
  const totalSales = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrdersCount = orders.filter(
    (o) => o.status !== "cancelled" && o.status !== "delivered"
  ).length;

  const activeReservationsCount = reservations.filter(
    (r) => r.status !== "cancelled"
  ).length;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleResetData = () => {
    resetAllData();
    setShowResetModal(false);
    setResetSuccessMsg("ਸਾਰਾ ਡਾਟਾ ਰੀਸੈੱਟ ਹੋ ਗਿਆ ਹੈ! (All stored data has been reset successfully)");
    setTimeout(() => setResetSuccessMsg(null), 4000);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-stone-800 bg-stone-900/90 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
              Coffizza Admin Portal
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 font-mono">
                LIVE
              </span>
            </h1>
            <p className="text-xs text-stone-400">Logged in as: <strong className="text-stone-200">akashdeep</strong></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* RESET DATA BUTTON */}
          <button
            onClick={() => setShowResetModal(true)}
            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition flex items-center gap-1.5"
            title="Clear all stored orders and table bookings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset System Data</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-300 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Success Notification Alert */}
      {resetSuccessMsg && (
        <div className="m-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            {resetSuccessMsg}
          </span>
          <button onClick={() => setResetSuccessMsg(null)}>
            <XCircle className="w-4 h-4 text-stone-400 hover:text-stone-100" />
          </button>
        </div>
      )}

      {/* Dashboard Main Content */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Important KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs uppercase font-semibold">Total Revenue</span>
              <IndianRupee className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-300 font-mono">₹{totalSales}</div>
            <p className="text-[11px] text-stone-500">From completed & active food orders</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs uppercase font-semibold">Active Food Orders</span>
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-100 font-mono">{activeOrdersCount}</div>
            <p className="text-[11px] text-stone-500">Orders placed or preparing</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs uppercase font-semibold">Table Reservations</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-100 font-mono">{activeReservationsCount}</div>
            <p className="text-[11px] text-stone-500">Confirmed table bookings</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs uppercase font-semibold">Total Orders Recorded</span>
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-stone-100 font-mono">{orders.length}</div>
            <p className="text-[11px] text-stone-500">Lifetime total orders</p>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab("orders");
                setStatusFilter("all");
              }}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition flex items-center gap-2 ${
                activeTab === "orders"
                  ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                  : "bg-stone-900 text-stone-400 hover:text-stone-100 border border-stone-800"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Online Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("reservations");
                setStatusFilter("all");
              }}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition flex items-center gap-2 ${
                activeTab === "reservations"
                  ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                  : "bg-stone-900 text-stone-400 hover:text-stone-100 border border-stone-800"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Table Bookings ({reservations.length})</span>
            </button>
          </div>

          {/* Search & Status Filter Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search ID, Name, Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              {activeTab === "orders" ? (
                <>
                  <option value="placed">Placed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </>
              ) : (
                <>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Tab 1: Orders Table */}
        {activeTab === "orders" && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center text-stone-400 space-y-2">
                <ShoppingBag className="w-8 h-8 text-stone-600 mx-auto" />
                <p className="text-sm">No food orders match your query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-800">
                    <tr>
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Fulfillment</th>
                      <th className="p-4">Items Breakdown</th>
                      <th className="p-4">Total Price</th>
                      <th className="p-4">Live Status & Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-850/50 transition">
                        <td className="p-4 font-mono">
                          <span className="font-bold text-amber-300 block">{order.id}</span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(order.createdAt).toLocaleString("en-IN")}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-stone-100">{order.customerName}</div>
                          <div className="text-stone-400 font-mono">{order.phone}</div>
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-stone-800 font-bold uppercase text-[10px] text-amber-400">
                            {order.fulfillmentType}
                          </span>
                          {order.deliveryAddress && (
                            <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">
                              {order.deliveryAddress}
                            </p>
                          )}
                          {order.tableNumber && (
                            <p className="text-[11px] text-stone-400 mt-1">
                              Table: {order.tableNumber}
                            </p>
                          )}
                        </td>

                        <td className="p-4 max-w-xs">
                          <div className="space-y-0.5">
                            {order.items.map((ci) => (
                              <div key={ci.item.id} className="text-stone-300">
                                {ci.quantity}x {ci.item.name}
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-4 font-bold text-amber-300 font-mono text-sm">
                          ₹{order.total}
                        </td>

                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value as OrderStatus)
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none transition ${
                              order.status === "cancelled"
                                ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                : order.status === "delivered"
                                ? "bg-green-500/20 text-green-400 border border-green-500/40"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            }`}
                          >
                            <option value="placed" className="bg-stone-900 text-stone-100">
                              Placed
                            </option>
                            <option value="preparing" className="bg-stone-900 text-stone-100">
                              Preparing
                            </option>
                            <option value="ready" className="bg-stone-900 text-stone-100">
                              Ready
                            </option>
                            <option value="delivered" className="bg-stone-900 text-stone-100">
                              Delivered
                            </option>
                            <option value="cancelled" className="bg-stone-900 text-stone-100">
                              Cancelled
                            </option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reservations Table */}
        {activeTab === "reservations" && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
            {filteredReservations.length === 0 ? (
              <div className="py-16 text-center text-stone-400 space-y-2">
                <Calendar className="w-8 h-8 text-stone-600 mx-auto" />
                <p className="text-sm">No table reservations match your query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-800">
                    <tr>
                      <th className="p-4">Booking ID</th>
                      <th className="p-4">Guest Name & Contact</th>
                      <th className="p-4">Date & Time Slot</th>
                      <th className="p-4">Guests Count</th>
                      <th className="p-4">Seating Preference</th>
                      <th className="p-4">Status & Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-200">
                    {filteredReservations.map((res) => (
                      <tr key={res.id} className="hover:bg-stone-850/50 transition">
                        <td className="p-4 font-mono font-bold text-amber-300">{res.id}</td>

                        <td className="p-4">
                          <div className="font-semibold text-stone-100">{res.guestName}</div>
                          <div className="text-stone-400 font-mono">{res.phone}</div>
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-amber-200">{res.date}</div>
                          <div className="text-stone-400">{res.timeSlot}</div>
                        </td>

                        <td className="p-4 font-bold text-stone-100">{res.guestCount} Persons</td>

                        <td className="p-4 capitalize text-stone-300">{res.seatingPreference}</td>

                        <td className="p-4">
                          <select
                            value={res.status}
                            onChange={(e) =>
                              updateReservationStatus(res.id, e.target.value as ReservationStatus)
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none transition ${
                              res.status === "cancelled"
                                ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                : "bg-green-500/20 text-green-400 border border-green-500/40"
                            }`}
                          >
                            <option value="confirmed" className="bg-stone-900 text-stone-100">
                              Confirmed
                            </option>
                            <option value="completed" className="bg-stone-900 text-stone-100">
                              Completed
                            </option>
                            <option value="cancelled" className="bg-stone-900 text-stone-100">
                              Cancelled
                            </option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Confirmation Modal for Reset System Data */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-100">
                Reset All Stored System Data?
              </h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                ਕੀ ਤੁਸੀਂ ਸਾਰੇ ਆਰਡਰ ਅਤੇ ਟੇਬਲ ਬੁਕਿੰਗਜ਼ ਦਾ ਡਾਟਾ ਰੀਸੈੱਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ? (This will permanently clear all orders and reservations from local storage).
              </p>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={handleResetData}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition"
              >
                Yes, Reset All Data
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="px-5 py-3 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
