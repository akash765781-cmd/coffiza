import { createFileRoute } from "@tanstack/react-router";
import { business, images } from "@/data/site";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { MenuPreview } from "@/components/sections/MenuPreview";
import { FoodStory } from "@/components/sections/FoodStory";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Gallery } from "@/components/sections/Gallery";
import { Reviews } from "@/components/sections/Reviews";
import { VisitUs } from "@/components/sections/VisitUs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: `${business.name} — Coffee, Kitchen & Artisan Dining`,
      },
      {
        name: "description",
        content: `${business.name} — fresh specialty coffee, hand-tossed pizza, fried chicken, momos and desserts. Dine-in, takeaway and online delivery. ${business.hours}.`,
      },
      { property: "og:title", content: `${business.name} — Artisan Cafe & Restro` },
      {
        property: "og:description",
        content: `Fresh specialty coffee and an artisanal kitchen. Dine-in, takeaway and online delivery. Rated ${business.rating}/5 on Google.`,
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: images.hero },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${business.name} — Artisan Cafe & Restro` },
      {
        name: "twitter:description",
        content: `Fresh specialty coffee and an artisanal kitchen. Dine-in, takeaway and online delivery.`,
      },
      { name: "twitter:image", content: images.hero },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <SiteNav />
      <main id="home">
        <Hero />
        <TrustStrip />
        <MenuPreview />
        <FoodStory />
        <About />
        <Experience />
        <Gallery />
        <Reviews />
        <VisitUs />
      </main>
      <SiteFooter />
      <MobileActionBar />
    </>
  );
}
