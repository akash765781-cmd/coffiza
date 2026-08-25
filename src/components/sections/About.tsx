import { business, images } from "@/data/site";
import { Reveal } from "@/components/ui/reveal";

export function About() {
  return (
    <section id="about" className="section-y">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <p className="eyebrow">About Coffizza</p>
          <h2 className="mt-4 text-3xl leading-[1.05] text-espresso sm:text-4xl lg:text-[3rem]">
            Your spot in Banga for coffee, food &amp; good company
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Coffizza Cafe &amp; Restro is a cafe and restaurant in Banga serving
            coffee, food, desserts and cold drinks. Sit down for a long cappuccino,
            share a pizza with friends, or pick up an order on your way through town —
            dine-in, takeaway and no-contact delivery are all available.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            You'll find us at Star Complex on the Chandigarh Highway, easy to reach
            whether you live around the corner or are just passing through Banga.
          </p>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.22em] text-accent">
                Where
              </dt>
              <dd className="mt-2 text-sm text-espresso">
                Star Complex, Chandigarh Highway, Banga
              </dd>
            </div>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.22em] text-accent">
                Today
              </dt>
              <dd className="mt-2 text-sm text-espresso">{business.hours}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={100} className="relative order-1 lg:order-2">
          <img
            src={images.interior}
            alt="Warm cafe interior with wooden tables, pendant lights and a coffee counter"
            loading="lazy"
            width={1408}
            height={944}
            className="h-[300px] w-full rounded-sm object-cover sm:h-[420px] lg:h-[520px]"
          />
          <div className="absolute -bottom-5 -right-3 hidden bg-accent px-6 py-5 text-accent-foreground lg:block">
            <p className="font-display text-2xl leading-none">Banga, Punjab</p>
            <p className="mt-1 text-[0.6rem] uppercase tracking-[0.22em]">
              Chandigarh Highway
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
