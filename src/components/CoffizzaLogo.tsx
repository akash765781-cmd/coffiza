import React from "react";

interface CoffizzaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  lightText?: boolean;
}

export const CoffizzaLogo: React.FC<CoffizzaLogoProps> = ({
  className = "",
  size = 38,
  showText = true,
  lightText = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon Emblem */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#2c1409] via-[#1e0e06] to-[#140904] border border-amber-500/40 shadow-sm shadow-black/20 overflow-hidden"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 64 64"
          width={size * 0.85}
          height={size * 0.85}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="cupGradComp" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
            <linearGradient id="goldGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Steaming Aroma */}
          <path
            d="M23 15 Q26 11 23 7 Q20 3 24 1"
            stroke="url(#goldGradComp)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M31 16 Q34 12 31 8 Q28 4 32 2"
            stroke="url(#goldGradComp)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M39 15 Q42 11 39 7 Q36 3 40 1"
            stroke="url(#goldGradComp)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Coffee Cup */}
          <path
            d="M16 23 L40 23 C40 23 40 37 28 37 C16 37 16 23 16 23 Z"
            fill="url(#cupGradComp)"
          />
          <path
            d="M38 25 C43 25 45 28 45 31 C45 34 42 36 37 36"
            stroke="url(#cupGradComp)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M13 39 Q28 42 43 39"
            stroke="url(#goldGradComp)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Pizza Slice Overlay */}
          <g transform="translate(24, 25) scale(0.68)">
            <path
              d="M12 18 Q26 13 40 18"
              stroke="#d97706"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path d="M14 19 L26 44 L38 19 Q26 15 14 19 Z" fill="url(#goldGradComp)" />
            <circle cx="23" cy="25" r="2.2" fill="#dc2626" />
            <circle cx="29" cy="31" r="2" fill="#dc2626" />
            <circle cx="25" cy="38" r="1.6" fill="#16a34a" />
          </g>
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-display text-xl font-semibold tracking-tight transition-colors ${
              lightText ? "text-ivory group-hover:text-amber-300" : "text-espresso group-hover:text-amber-800"
            } md:text-2xl`}
          >
            COFFIZZA
          </span>
          <span
            className={`mt-0.5 text-[0.55rem] uppercase tracking-[0.32em] font-semibold ${
              lightText ? "text-amber-400/80" : "text-amber-800/80"
            }`}
          >
            Cafe &amp; Restro
          </span>
        </div>
      )}
    </div>
  );
};
