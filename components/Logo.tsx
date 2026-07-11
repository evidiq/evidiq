import type { CSSProperties } from "react";

/**
 * EVIDIQ logo — a faceted verification shield with a check, in the violet→
 * fuchsia brand gradient. Self-contained SVG (own gradient) so it reads on any
 * background. `LogoMark` is the icon; `Logo` adds the wordmark.
 */
export function LogoMark({
  size = 32,
  className,
  gradId = "evidiq-grad",
}: {
  size?: number;
  className?: string;
  gradId?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="0.55" stopColor="#9333ea" />
          <stop offset="1" stopColor="#c026d3" />
        </linearGradient>
      </defs>
      {/* shield */}
      <path
        d="M24 3.5 L39.5 10 V22.8 C39.5 33.2 32.7 40.4 24 44 C15.3 40.4 8.5 33.2 8.5 22.8 V10 Z"
        fill={`url(#${gradId})`}
      />
      {/* facet highlight */}
      <path d="M24 3.5 L39.5 10 V22.8 C39.5 33.2 32.7 40.4 24 44 Z" fill="#000" fillOpacity="0.10" />
      <path d="M24 3.5 L8.5 10 V22.8 C8.5 33.2 15.3 40.4 24 44 Z" fill="#fff" fillOpacity="0.10" />
      {/* check */}
      <path
        d="M16.2 24 L21.6 29.4 L32 17.4"
        stroke="#fff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  size = 30,
  className,
  wordClassName,
  gradId = "evidiq-grad",
  style,
}: {
  size?: number;
  className?: string;
  wordClassName?: string;
  gradId?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`} style={style}>
      <LogoMark size={size} gradId={gradId} />
      <span className={`font-extrabold tracking-tight ${wordClassName ?? ""}`}>EVIDIQ</span>
    </span>
  );
}
