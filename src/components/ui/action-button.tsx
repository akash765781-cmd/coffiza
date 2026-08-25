import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "cream" | "accent";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition-all duration-300 will-change-transform hover:-translate-y-0.5 active:translate-y-0";

const variants: Record<Variant, string> = {
  solid:
    "bg-primary text-primary-foreground hover:bg-espresso shadow-[0_10px_24px_-16px_var(--espresso)]",
  outline:
    "border border-espresso/30 text-espresso hover:border-accent hover:text-accent bg-transparent",
  cream:
    "bg-ivory text-espresso hover:bg-cream shadow-[0_10px_24px_-18px_rgba(0,0,0,0.6)]",
  accent: "bg-accent text-accent-foreground hover:brightness-95",
};

export function ActionButton({
  variant = "solid",
  className,
  children,
  ...props
}: { variant?: Variant; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(base, variants[variant], className)} {...props}>
      {children}
    </a>
  );
}
