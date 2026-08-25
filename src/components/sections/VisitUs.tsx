import { MapPin, Phone, Clock, Navigation, Check } from "lucide-react";
import { business } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/ui/reveal";
import { ActionButton } from "@/components/ui/action-button";

export function VisitUs() {
  return (
    <section id="visit" className="section-y bg-cream">
      <div className="container-x">
        <SectionHeading
          eyebrow="Visit Us"
          title="Find us in Banga"
          intro="On the Chandigarh Highway at Star Complex — easy to reach, easy to stop for coffee. Dine-in, takeaway and delivery available."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Details */}
          <Reveal className="flex flex-col gap-8 border border-espresso/10 bg-ivory p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Address
                </p>
                <p className="mt-2 leading-relaxed text-espresso">
                  {business.address}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Plus Code: {business.plusCode}
                </p>
              </div>
            </div>

            <div className="rule-line" />

            <div className="flex items-start gap-4">
              <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                <Phone className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Phone
                </p>
                <a
                  href={business.phoneHref}
                  className="mt-2 block font-display text-2xl text-espresso transition-colors hover:text-accent"
                >
                  {business.phoneDisplay}
                </a>
                <p className="mt-1 text-sm text-muted-foreground">
                  Call to reserve or order ahead.
                </p>
              </div>
            </div>

            <div className="rule-line" />

            <div className="flex items-start gap-4">
              <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                <Clock className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="w-full">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Opening Hours
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="relative inline-flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
                  </span>
                  <span className="text-sm font-semibold text-espresso">
                    {business.hours}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  [PLACEHOLDER — confirm exact daily opening times by calling the
                  cafe.]
                </p>
              </div>
            </div>

            <div className="rule-line" />

            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Services
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
              <ActionButton
                href={business.directionsUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Get Directions
              </ActionButton>
              <ActionButton href={business.phoneHref} variant="outline">
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call Now
              </ActionButton>
            </div>
          </Reveal>

          {/* Map embed */}
          <Reveal
            delay={120}
            className="relative min-h-[22rem] overflow-hidden border border-espresso/10 lg:min-h-full"
          >
            <iframe
              title={`Map showing ${business.name} in Banga, Punjab`}
              src={business.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full grayscale-[0.15] contrast-[1.02]"
              style={{ border: 0 }}
            />
            <a
              href={business.directionsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group absolute bottom-4 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-cream shadow-lg shadow-espresso/30 transition-all hover:scale-[1.03] hover:bg-accent"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              Open in Google Maps
              <span
                className="ml-0.5 inline-block transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
