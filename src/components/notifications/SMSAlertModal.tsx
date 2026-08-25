import React, { useEffect, useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { X, MessageSquare, PhoneCall } from "lucide-react";

export const SMSAlertModal: React.FC = () => {
  const { activeSmsAlert, clearActiveSmsAlert } = useOrder();
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdminRoute(window.location.pathname.startsWith("/admin"));
    }
  }, []);

  // Do NOT show customer SMS alert modal inside the Admin Panel
  if (!activeSmsAlert || isAdminRoute) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 p-6 space-y-4">
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                SMS Notification Sent
              </h4>
              <p className="text-[10px] text-amber-400 font-mono">
                Recipient: +91 {activeSmsAlert.phone || "9876543210"}
              </p>
            </div>
          </div>
          <button
            onClick={clearActiveSmsAlert}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Simulated Mobile SMS Bubble */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-stone-400 border-b border-stone-800/80 pb-1.5">
            <span className="font-semibold text-amber-300">Coffizza Cafe Alert</span>
            <span className="text-[10px] font-mono">
              {new Date(activeSmsAlert.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <p className="text-stone-200 leading-relaxed font-sans pt-1">
            {activeSmsAlert.type === "booking_cancelled" ? (
              <>
                ⚠️ <strong>TABLE RESERVATION CANCELLED:</strong> Your booking{" "}
                <span className="font-mono text-amber-300">{activeSmsAlert.relatedId}</span> has been cancelled by cafe/system.
              </>
            ) : (
              <>
                ⚠️ <strong>ORDER CANCELLED:</strong> Your order{" "}
                <span className="font-mono text-amber-300">{activeSmsAlert.relatedId}</span> has been cancelled by cafe/system.
              </>
            )}
          </p>

          {activeSmsAlert.reason && (
            <div className="p-2 rounded-lg bg-red-950/30 border border-red-900/50 text-red-300 text-[11px] italic">
              Reason: {activeSmsAlert.reason}
            </div>
          )}

          <p className="text-[11px] text-stone-400 pt-1">
            For assistance or queries, please contact Coffizza Restro Banga:{" "}
            <a href="tel:+919917800084" className="text-amber-400 font-bold underline">
              099178 00084
            </a>
          </p>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex gap-2 pt-1">
          <a
            href="tel:+919917800084"
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs text-center flex items-center justify-center gap-1.5 transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call Cafe (099178 00084)</span>
          </a>
          <button
            onClick={clearActiveSmsAlert}
            className="px-4 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-semibold transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
