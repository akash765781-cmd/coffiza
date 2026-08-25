import { Star } from "lucide-react";
import { business } from "@/data/site";
import { Reveal } from "@/components/ui/reveal";

export function TrustStrip() {
  return (
    <section aria-label="At a glance" className="border-y border-espresso/10 bg-ivory">
      <Reveal className="container-x grid divide-y divide-espresso/10 py-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="flex flex-col gap-1 py-6 sm:pr-8">
          <span className="flex items-center gap-2 font-display text-2xl text-espresso">
            {business.rating}
            <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {business.reviewCount} Google reviews
          </span>
        </div>
        <div className="flex flex-col gap-1 py-6 sm:px-8">
          <span className="font-display text-2xl text-espresso">
            {business.priceRange}
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Per person
          </span>
        </div>
        <div className="flex flex-col gap-2 py-6 sm:pl-8">
          <span className="flex flex-wrap gap-x-3 gap-y-1 font-display text-lg text-espresso">
            {business.services.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            How to enjoy it
          </span>
        </div>
      </Reveal>
    </section>
  );
}
