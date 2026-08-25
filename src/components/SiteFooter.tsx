import { business, navLinks } from "@/data/site";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Lock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-espresso pb-24 pt-16 text-ivory/70 lg:pb-16">
      <div className="container-x grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl text-ivory">COFFIZZA CAFE &amp; RESTRO</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Cafe and restaurant in Banga offering dine-in, takeaway and delivery.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-accent">
            Explore
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="transition-colors hover:text-ivory">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-accent">
            Contact &amp; Manager Portal
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a
                href={business.phoneHref}
                className="transition-colors hover:text-ivory"
              >
                {business.phoneDisplay}
              </a>
            </li>
            <li>Banga, Punjab</li>
            <li>{business.hours}</li>
            <li className="pt-3">
              {/* Strong Admin Portal Link Button */}
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 font-bold text-xs shadow-sm transition"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>🔒 Admin Portal (/admin)</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x mt-14 border-t border-ivory/10 pt-6 flex flex-wrap justify-between items-center text-xs text-ivory/45 gap-2">
        <span>
          © {new Date().getFullYear()} Coffizza Cafe &amp; Restro, Banga. All rights reserved.
        </span>
        <Link
          to="/admin"
          className="text-amber-400/90 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
        >
          <Lock className="w-3 h-3" />
          <span>Manager Dashboard (akashdeep)</span>
        </Link>
      </div>
    </footer>
  );
}
