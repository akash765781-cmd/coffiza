import { business, images } from "@/data/site";
import { useOrder } from "@/context/OrderContext";
import { ShoppingBag, Calendar, MapPin } from "lucide-react";

export function Hero() {
  const { setIsCartOpen, setIsReservationOpen } = useOrder();

  return (
    <section id="home" className="relative overflow-hidden pt-24 md:pt-28 lg:pt-32">
      <div className="container-x grid items-center gap-10 pb-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <p className="eyebrow">Cafe • Restro • Banga</p>
          <h1 className="mt-6 font-display text-[2.6rem] leading-[0.98] tracking-tight text-espresso sm:text-6xl lg:text-[4.6rem]">
            Good coffee.
            <br />
            Great food.
            <span className="block italic text-accent">Good times.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Espresso and cappuccino, pizza and fried chicken, cheesecake and cold
            drinks — served all day at Star Complex on the Chandigarh Highway. Sit
            in, take it away, or have it delivered.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-espresso hover:bg-amber-800 text-stone-100 font-bold text-sm shadow-lg shadow-espresso/20 flex items-center gap-2 transition"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>Order Online Now</span>
            </button>

            <button
              onClick={() => setIsReservationOpen(true)}
              className="px-6 py-3.5 rounded-xl border border-espresso/30 text-espresso hover:bg-espresso/5 font-semibold text-sm transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>Reserve Table</span>
            </button>

            <a
              href={business.directionsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="px-4 py-3.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-sm font-semibold transition flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4" />
              <span>Directions</span>
            </a>
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {business.hours}
          </p>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-6 hidden h-40 w-40 border border-accent/30 lg:block" />
          <figure className="relative overflow-hidden rounded-xl shadow-xl">
            <img
              src={images.hero}
              alt="Cappuccino with latte art beside a freshly baked pizza on a cafe table"
              width={1408}
              height={1760}
              className="h-[380px] w-full object-cover transition-transform duration-[1.4s] hover:scale-[1.03] sm:h-[520px] lg:h-[640px]"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-espresso/85 to-transparent px-6 pb-5 pt-16 text-[0.65rem] uppercase tracking-[0.2em] text-ivory/80">
              Coffee &amp; kitchen — served daily
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
