import { Phone, MapPin, ShoppingBag, Calendar, ListOrdered } from "lucide-react";
import { business } from "@/data/site";
import { useOrder } from "@/context/OrderContext";

const itemClass =
  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-ivory/85 transition-colors hover:text-accent relative";

export function MobileActionBar() {
  const {
    cartItemCount,
    setIsCartOpen,
    setIsReservationOpen,
    setIsMyOrdersOpen,
    orders,
    reservations,
  } = useOrder();

  const activeCount =
    orders.filter((o) => o.status !== "cancelled" && o.status !== "delivered").length +
    reservations.filter((r) => r.status !== "cancelled").length;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ivory/10 bg-espresso/97 backdrop-blur-md lg:hidden">
      <nav aria-label="Quick actions" className="mx-auto flex max-w-md">
        <button onClick={() => setIsCartOpen(true)} className={itemClass}>
          <div className="relative">
            <ShoppingBag className="h-4 w-4 text-amber-300" aria-hidden="true" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 rounded-full bg-amber-500 text-stone-950 text-[9px] font-bold">
                {cartItemCount}
              </span>
            )}
          </div>
          Order
        </button>

        <button onClick={() => setIsReservationOpen(true)} className={itemClass}>
          <Calendar className="h-4 w-4 text-amber-400" aria-hidden="true" />
          Reserve
        </button>

        <button onClick={() => setIsMyOrdersOpen(true)} className={itemClass}>
          <div className="relative">
            <ListOrdered className="h-4 w-4 text-amber-300" aria-hidden="true" />
            {activeCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[8px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          My Orders
        </button>

        <a href="#menu" className={itemClass}>
          <ShoppingBag className="h-4 w-4 text-amber-300" aria-hidden="true" />
          Menu
        </a>

        <a href="#reviews" className={itemClass}>
          <ListOrdered className="h-4 w-4 text-amber-300" aria-hidden="true" />
          Reviews
        </a>
      </nav>
    </div>
  );
}
