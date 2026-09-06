import { Coffee, Clock, Sparkles, Check, ShoppingBag, Calendar } from "lucide-react";
import { business, images } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/ui/reveal";
import { useOrder } from "@/context/OrderContext";

export function VisitUs() {
  const { setIsCartOpen, setIsReservationOpen } = useOrder();

  return (
    <section id="visit" className="section-y bg-cream">
      <div className="container-x">
        <SectionHeading
          eyebrow="Cafe Experience"
          title="Atmosphere &amp; Service"
          intro="Artisanal brewed beverages, handcrafted food, and cozy cafe seating. Dine-in, takeaway, and contactless express delivery available."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Details */}
          <Reveal className="flex flex-col gap-8 border border-espresso/10 bg-ivory p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                <Coffee className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Specialty Roasts
                </p>
                <p className="mt-2 leading-relaxed text-espresso font-semibold">Freshly Ground Espresso &amp; Brews</p>
                <p className="mt-1 text-sm text-muted-foreground">Single-origin beans and custom house blends prepared daily.</p>
              </div>
            </div>

            <div className="rule-line" />

            <div className="flex items-start gap-4">
              <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                <Clock className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="w-full">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Operating Hours
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="relative inline-flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
                  </span>
                  <span className="text-sm font-semibold text-espresso">{business.hours}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Open every day for morning breakfast, lunch, and evening cafe dining.
                </p>
              </div>
            </div>

            <div className="rule-line" />

            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Services &amp; Features
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {business.services.map((s) => (
                  <li
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-full border border-espresso/15 px-3 py-1.5 text-xs font-medium text-espresso"
                  >
                    <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-espresso px-5 py-3 text-xs font-bold uppercase tracking-wider text-cream shadow-md transition-all hover:bg-amber-800"
              >
                <ShoppingBag className="h-4 w-4 text-amber-300" />
                Order Online
              </button>
              <button
                onClick={() => setIsReservationOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-espresso/30 px-5 py-3 text-xs font-bold uppercase tracking-wider text-espresso transition-all hover:bg-espresso/5"
              >
                <Calendar className="h-4 w-4 text-amber-700" />
                Reserve Table
              </button>
            </div>
          </Reveal>

          {/* Image Showcase */}
          <Reveal
            delay={120}
            className="relative min-h-[22rem] overflow-hidden border border-espresso/10 lg:min-h-full"
          >
            <img
              src={images.interior}
              alt="Coffizza Cafe Interior"
              className="absolute inset-0 h-full w-full object-cover grayscale-[0.1] contrast-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent flex items-end p-7">
              <div className="space-y-1">
                <span className="text-xs uppercase font-mono tracking-widest text-amber-300 font-bold">
                  Atmospheric Cafe &amp; Restro
                </span>
                <p className="text-lg font-display text-ivory">
                  Good Coffee. Great Food. Good Times.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
