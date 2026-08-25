import React, { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { X, ShoppingBag, Calendar, Ban, CheckCircle2, Clock, AlertTriangle, ChevronRight } from "lucide-react";

export const MyOrdersModal: React.FC = () => {
  const {
    orders,
    cancelOrder,
    reservations,
    cancelReservation,
    isMyOrdersOpen,
    setIsMyOrdersOpen,
    activeTab,
    setActiveTab,
  } = useOrder();

  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelType, setCancelType] = useState<'order' | 'reservation'>('order');
  const [cancelReason, setCancelReason] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isMyOrdersOpen) return null;

  const handleConfirmCancel = () => {
    if (!cancelTargetId) return;

    if (cancelType === "order") {
      const ok = cancelOrder(cancelTargetId, cancelReason || "Cancelled by user");
      if (ok) {
        setFeedbackMsg(`Order ${cancelTargetId} has been cancelled successfully.`);
      }
    } else {
      const ok = cancelReservation(cancelTargetId, cancelReason || "Cancelled by user");
      if (ok) {
        setFeedbackMsg(`Reservation ${cancelTargetId} has been cancelled successfully.`);
      }
    }

    setCancelTargetId(null);
    setCancelReason("");
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl text-stone-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div>
            <h2 className="font-serif text-xl font-bold text-amber-100">My Orders & Bookings</h2>
            <p className="text-xs text-stone-400">View status or cancel active orders/reservations</p>
          </div>
          <button
            onClick={() => setIsMyOrdersOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-800 bg-stone-950/40 px-5 pt-3">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-amber-500 text-amber-400 font-bold"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Food Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("reservations")}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === "reservations"
                ? "border-amber-500 text-amber-400 font-bold"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Table Reservations ({reservations.length})</span>
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className="m-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              {feedbackMsg}
            </span>
            <button onClick={() => setFeedbackMsg(null)} className="hover:text-amber-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          {activeTab === "orders" ? (
            orders.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-stone-800 flex items-center justify-center text-stone-500 mx-auto">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h4 className="text-base font-semibold text-stone-300">No Orders Yet</h4>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Place an online order from our delicious menu and you can track or cancel it here.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4 hover:border-stone-700 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        {order.id}
                      </span>
                      <span className="text-xs text-stone-400">
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === "cancelled"
                            ? "bg-red-500/10 text-red-400 border border-red-500/30"
                            : order.status === "ready" || order.status === "delivered"
                            ? "bg-green-500/10 text-green-400 border border-green-500/30"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 text-xs text-stone-300">
                    {order.items.map((ci) => (
                      <div key={ci.item.id} className="flex justify-between">
                        <span>
                          {ci.quantity}x {ci.item.name}
                        </span>
                        <span className="font-semibold text-stone-200">
                          ₹{ci.item.price * ci.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Details Summary & Cancellation option */}
                  <div className="pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="text-stone-400">
                        Customer: <strong className="text-stone-200">{order.customerName}</strong> ({order.phone})
                      </p>
                      <p className="text-stone-400 mt-0.5">
                        Type: <span className="uppercase text-amber-400 font-semibold">{order.fulfillmentType}</span>
                        {order.deliveryAddress && ` • ${order.deliveryAddress}`}
                        {order.tableNumber && ` • ${order.tableNumber}`}
                      </p>
                      {order.cancellationReason && (
                        <p className="text-red-400 mt-1 italic">
                          Reason: {order.cancellationReason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">Total</span>
                        <span className="text-base font-bold text-amber-300">₹{order.total}</span>
                      </div>

                      {/* CANCEL ORDER BUTTON */}
                      {order.status !== "cancelled" && order.status !== "delivered" && (
                        <button
                          onClick={() => {
                            setCancelTargetId(order.id);
                            setCancelType("order");
                          }}
                          className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold transition flex items-center gap-1.5"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel Order</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            /* Table Reservations Tab */
            reservations.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-stone-800 flex items-center justify-center text-stone-500 mx-auto">
                  <Calendar className="w-7 h-7" />
                </div>
                <h4 className="text-base font-semibold text-stone-300">No Reservations Found</h4>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Book a table for lunch, dinner, or special occasions and manage your reservations here.
                </p>
              </div>
            ) : (
              reservations.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 hover:border-stone-700 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        {res.id}
                      </span>
                      <span className="text-xs text-stone-300 font-medium">
                        📅 {res.date} at {res.timeSlot}
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        res.status === "cancelled"
                          ? "bg-red-500/10 text-red-400 border border-red-500/30"
                          : "bg-green-500/10 text-green-400 border border-green-500/30"
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-stone-300">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Guest Name:</span>
                      <span className="font-semibold">{res.guestName}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Guests Count:</span>
                      <span className="font-semibold">{res.guestCount} Persons</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Seating Preference:</span>
                      <span className="font-semibold capitalize">{res.seatingPreference}</span>
                    </div>
                  </div>

                  {res.cancellationReason && (
                    <p className="text-xs text-red-400 italic">
                      Cancellation Reason: {res.cancellationReason}
                    </p>
                  )}

                  <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
                    <span className="text-stone-400">Phone: {res.phone}</span>

                    {/* CANCEL RESERVATION BUTTON */}
                    {res.status !== "cancelled" && (
                      <button
                        onClick={() => {
                          setCancelTargetId(res.id);
                          setCancelType("reservation");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium transition flex items-center gap-1"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Cancellation Confirmation Dialog */}
        {cancelTargetId && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-20 animate-in fade-in">
            <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-2xl p-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-100">
                  Cancel {cancelType === "order" ? "Order" : "Reservation"} ({cancelTargetId})?
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Are you sure you want to cancel this {cancelType}? This action will immediately notify our staff.
                </p>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Reason for cancellation (optional)..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition"
                >
                  Yes, Cancel Now
                </button>
                <button
                  onClick={() => setCancelTargetId(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-semibold transition"
                >
                  Keep Active
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
