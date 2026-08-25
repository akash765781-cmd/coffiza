import { images } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/ui/reveal";

const shots = [
  { src: images.interior, alt: "Cafe seating and coffee counter in warm light", span: "sm:col-span-2", h: "h-56 sm:h-72" },
  { src: images.pizza, alt: "Pizza fresh from the oven", span: "", h: "h-72 sm:h-96" },
  { src: images.coffee, alt: "Cappuccino with latte art", span: "", h: "h-56 sm:h-64" },
  { src: images.dessert, alt: "Brownie and cheesecake plated for dessert", span: "", h: "h-72 sm:h-80" },
  { src: images.momos, alt: "Spicy chicken momos in a steamer basket", span: "", h: "h-56 sm:h-64" },
  { src: images.moments, alt: "Friends sharing coffee at the cafe", span: "sm:col-span-2", h: "h-56 sm:h-72" },
];

export function Gallery() {
  return (
    <section id="gallery" className="section-y bg-ivory">
      <div className="container-x">
        <SectionHeading
          eyebrow="Gallery"
          title="Food, coffee & cafe moments"
          intro="A look at the kind of table you can expect. [PLACEHOLDER — replace with photographs from the cafe.]"
        />

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {shots.map((s, i) => (
            <Reveal key={s.alt} delay={(i % 3) * 80} className="break-inside-avoid">
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                width={1024}
                height={1024}
                className={`w-full rounded-sm object-cover transition-all duration-700 hover:brightness-105 ${s.h}`}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
