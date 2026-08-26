import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ShoppingBag, Calendar, ListOrdered, Bell, AlertOctagon } from "lucide-react";
import { navLinks } from "@/data/site";
import { cn } from "@/lib/utils";
import { useOrder } from "@/context/OrderContext";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    cartItemCount,
    setIsCartOpen,
    setIsReservationOpen,
    setIsMyOrdersOpen,
    orders,
    reservations,
    notifications,
    unreadNotificationCount,
    markNotificationsAsRead,
  } = useOrder();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const activeCount = mounted
    ? orders.filter((o) => o.status !== "cancelled" && o.status !== "delivered").length +
      reservations.filter((r) => r.status !== "cancelled").length
    : 0;

  const displayCartCount = mounted ? cartItemCount : 0;
  const displayUnreadCount = mounted ? unreadNotificationCount : 0;

  const handleToggleNotifMenu = () => {
    if (!showNotifMenu) {
      markNotificationsAsRead();
    }
    setShowNotifMenu((prev) => !prev);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled
          ? "border-b border-espresso/10 bg-cream/95 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-cream/60 backdrop-blur-xs",
      )}
    >
      <nav
        aria-label="Primary"
        className="container-x flex h-16 items-center justify-between md:h-20"
      >
        <Link to="/" className="group flex flex-col leading-none">
          <span className="font-display text-xl font-semibold tracking-tight text-espresso md:text-2xl">
            COFFIZZA
          </span>
          <span className="mt-0.5 text-[0.55rem] uppercase tracking-[0.32em] text-muted-foreground">
            Cafe &amp; Restro
          </span>
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {navLinks.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="relative text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-espresso/80 transition-colors hover:text-accent after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          {/* Notification Bell Icon */}
          <div className="relative">
            <button
              onClick={handleToggleNotifMenu}
              className="relative p-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 transition"
              title="Notifications & Order Updates"
            >
              <Bell className="w-4 h-4 text-espresso" />
              {displayUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {displayUnreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <h4 className="font-serif font-bold text-sm text-amber-200">Notifications</h4>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {notifications.length} Alerts
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-stone-400 py-4 text-center">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-amber-300 font-semibold">
                          <span className="flex items-center gap-1.5 text-red-400">
                            <AlertOctagon className="w-3.5 h-3.5" />
                            {n.title}
                          </span>
                        </div>
                        <p className="text-stone-300 text-[11px] leading-snug">{n.message}</p>
                        {n.reason && (
                          <p className="text-[10px] text-red-400 italic">Reason: {n.reason}</p>
                        )}
                        <span className="text-[9px] text-stone-500 block text-right font-mono">
                          {new Date(n.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Table Reservation CTA */}
          <button
            onClick={() => setIsReservationOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-espresso/20 text-espresso hover:bg-espresso/5 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>Reserve Table</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-4 py-2 rounded-xl bg-espresso text-stone-100 hover:bg-amber-800 font-semibold text-xs shadow-md transition flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>Order Online</span>
            {displayCartCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-stone-950 rounded-full font-mono">
                {displayCartCount}
              </span>
            )}
          </button>

          {/* My Orders / Cancel option Button */}
          <button
            onClick={() => setIsMyOrdersOpen(true)}
            className="relative p-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 transition"
            title="My Orders & Bookings (Cancel Option)"
          >
            <ListOrdered className="w-4 h-4 text-espresso" />
            {activeCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Header Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={handleToggleNotifMenu}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-espresso/20 text-espresso"
          >
            <Bell className="h-4 w-4" />
            {displayUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {displayUnreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-espresso text-amber-300 shadow-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            {displayCartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center">
                {displayCartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-espresso/20 text-espresso transition-colors"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {open ? (
        <div className="lg:hidden">
          <div className="container-x border-t border-espresso/10 bg-cream pb-8 pt-6 space-y-6">
            <ul className="flex flex-col divide-y divide-espresso/10">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3.5 font-display text-xl text-espresso"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <button
                onClick={() => {
                  setOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-espresso text-amber-300 font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Online ({displayCartCount} items)</span>
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  setIsReservationOpen(true);
                }}
                className="w-full py-3 rounded-xl border border-espresso text-espresso font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>Reserve Table</span>
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  setIsMyOrdersOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-stone-100 border border-stone-300 text-stone-900 font-semibold text-sm flex items-center justify-center gap-2"
              >
                <ListOrdered className="w-4 h-4 text-espresso" />
                <span>My Orders & Cancellation</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
