import { Star } from "lucide-react";
import { business, reviewThemes } from "@/data/site";
import { Reveal } from "@/components/ui/reveal";

export function Reviews() {
  return (
    <section id="reviews" className="section-y">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="eyebrow">Social proof</p>
            <h2 className="mt-4 text-3xl leading-[1.05] text-espresso sm:text-4xl lg:text-[3rem]">
              What guests are saying
            </h2>
          </Reveal>
          <Reveal delay={80} className="flex items-center gap-4">
            <span className="font-display text-5xl text-espresso">
              {business.rating}
            </span>
            <span>
              <span className="flex gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className={
                      i < 4 ? "h-4 w-4 fill-accent text-accent" : "h-4 w-4 text-accent/40"
                    }
                  />
                ))}
              </span>
              <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {business.rating} / 5 · {business.reviewCount} reviews
              </span>
            </span>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviewThemes.map((r, i) => (
            <Reveal key={r.meta} delay={i * 90}>
              <figure className="flex h-full flex-col justify-between border border-espresso/10 bg-ivory p-7 transition-transform duration-300 hover:-translate-y-1">
                <blockquote className="font-display text-xl leading-snug text-espresso">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-8 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                  {r.meta}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
