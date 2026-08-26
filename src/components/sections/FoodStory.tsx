import { images } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/ui/reveal";

export function FoodStory() {
  return (
    <section className="section-y bg-ivory">
      <div className="container-x">
        <SectionHeading
          eyebrow="Signatures"
          title={
            <>
              The plates people
              <br />
              come back for
            </>
          }
        />

        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <figure className="group relative overflow-hidden rounded-sm">
              <img
                src={images.pizza}
                alt="Fresh pizza with melted cheese and basil on a dark table"
                loading="lazy"
                width={1024}
                height={1280}
                className="h-[320px] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105 md:h-[560px]"
              />
              <figcaption className="absolute bottom-0 w-full bg-gradient-to-t from-espresso/90 to-transparent p-6 pt-20">
                <span className="text-[0.6rem] uppercase tracking-[0.24em] text-accent">
                  From the oven
                </span>
                <p className="mt-2 font-display text-3xl text-ivory">Pizza</p>
              </figcaption>
            </figure>
          </Reveal>

          <div className="grid gap-5 md:col-span-5">
            <Reveal delay={100}>
              <figure className="group relative overflow-hidden rounded-sm">
                <img
                  src={images.coffee}
                  alt="Cappuccino with latte art in a ceramic cup"
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-[220px] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105 md:h-[270px]"
                />
                <figcaption className="absolute bottom-0 w-full bg-gradient-to-t from-espresso/85 to-transparent p-5 pt-14 font-display text-2xl text-ivory">
                  Cappuccino
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={180}>
              <figure className="group relative overflow-hidden rounded-sm">
                <img
                  src={images.chicken}
                  alt="Crispy fried chicken served with dipping sauce"
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-[220px] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105 md:h-[270px]"
                />
                <figcaption className="absolute bottom-0 w-full bg-gradient-to-t from-espresso/85 to-transparent p-5 pt-14 font-display text-2xl text-ivory">
                  Fried Chicken
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <Reveal delay={80} className="md:col-span-4">
            <figure className="group relative overflow-hidden rounded-sm">
              <img
                src={images.dessert}
                alt="Chocolate brownie and a slice of cheesecake on plates"
                loading="lazy"
                width={1024}
                height={1280}
                className="h-[260px] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105 md:h-[300px]"
              />
              <figcaption className="absolute bottom-0 w-full bg-gradient-to-t from-espresso/85 to-transparent p-5 pt-14 font-display text-2xl text-ivory">
                Brownie &amp; Cheesecake
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={140} className="md:col-span-4">
            <figure className="group relative overflow-hidden rounded-sm">
              <img
                src={images.sandwich}
                alt="Grilled sandwich with a side salad and fresh lime soda"
                loading="lazy"
                width={1024}
                height={1024}
                className="h-[260px] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105 md:h-[300px]"
              />
              <figcaption className="absolute bottom-0 w-full bg-gradient-to-t from-espresso/85 to-transparent p-5 pt-14 font-display text-2xl text-ivory">
                Grilled Sandwich
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={200} className="flex items-end bg-espresso p-7 text-ivory md:col-span-4">
            <p className="font-display text-2xl leading-snug">
              Coffee, pizza, snacks and dessert — one table, one visit.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
