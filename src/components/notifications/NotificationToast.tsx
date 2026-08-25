import React, { useEffect, useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { X, AlertOctagon, PhoneCall, ArrowRight } from "lucide-react";

export const NotificationToast: React.FC = () => {
  const { activeToast, clearActiveToast, setIsMyOrdersOpen, setActiveTab } = useOrder();
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdminRoute(window.location.pathname.startsWith("/admin"));
    }
  }, []);

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      clearActiveToast();
    }, 7000);
    return () => clearTimeout(timer);
  }, [activeToast, clearActiveToast]);

  // Do NOT show customer cancellation toast inside the Admin Panel
  if (!activeToast || isAdminRoute) return null;

  return (
    <div className="fixed top-5 right-5 left-5 sm:left-auto sm:max-w-md z-50 animate-in slide-in-from-top-5 duration-300">
      <div className="p-4 rounded-2xl bg-stone-900 border-2 border-red-500/80 text-stone-100 shadow-2xl shadow-red-950/50 flex gap-3.5 items-start">
        <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 shrink-0">
          <AlertOctagon className="w-6 h-6 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm text-red-300">
              {activeToast.title}
            </h4>
            <span className="text-[10px] text-stone-400 font-mono">
              {new Date(activeToast.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <p className="text-xs text-stone-200 leading-snug">
            {activeToast.message}
          </p>

          {activeToast.reason && (
            <p className="text-xs text-red-400 font-medium italic">
              Reason: {activeToast.reason}
            </p>
          )}

          <div className="pt-2 flex items-center gap-3 text-xs">
            <button
              onClick={() => {
                clearActiveToast();
                setActiveTab(activeToast.type === "booking_cancelled" ? "reservations" : "orders");
                setIsMyOrdersOpen(true);
              }}
              className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <a
              href="tel:+919917800084"
              className="text-stone-400 hover:text-stone-200 flex items-center gap-1 transition"
            >
              <PhoneCall className="w-3 h-3 text-stone-400" />
              <span>Call Support</span>
            </a>
          </div>
        </div>

        <button
          onClick={clearActiveToast}
          className="p-1 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
