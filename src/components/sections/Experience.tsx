import { images } from "@/data/site";
import { Reveal } from "@/components/ui/reveal";

const notes = [
  "Comfortable seating",
  "Friendly service",
  "Clean environment",
  "Room to sit and work",
];

export function Experience() {
  return (
    <section className="section-y bg-espresso text-ivory">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-accent">
              The atmosphere
            </p>
            <h2 className="mt-4 text-3xl leading-[1.05] sm:text-4xl lg:text-[3rem]">
              Come for the coffee. Stay for the experience.
            </h2>
            <ul className="mt-8 flex flex-wrap gap-2">
              {notes.map((n) => (
                <li
                  key={n}
                  className="rounded-full border border-ivory/20 px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] text-ivory/75"
                >
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="grid grid-cols-2 gap-4">
            <img
              src={images.moments}
              alt="Guests sharing coffee at a cafe table"
              loading="lazy"
              width={1024}
              height={768}
              className="col-span-2 h-[200px] w-full rounded-sm object-cover sm:h-[280px]"
            />
            <img
              src={images.drinks}
              alt="Iced coffee and a mojito served in tall glasses"
              loading="lazy"
              width={1024}
              height={768}
              className="h-[150px] w-full rounded-sm object-cover sm:h-[200px]"
            />
            <img
              src={images.momos}
              alt="Steamed spicy chicken momos in a bamboo steamer"
              loading="lazy"
              width={1024}
              height={1280}
              className="h-[150px] w-full rounded-sm object-cover sm:h-[200px]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
