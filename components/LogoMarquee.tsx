import { BRAND_LOGOS, type Brand } from "@/lib/site";

function LogoCard({ brand }: { brand: Brand }) {
  return (
    <span className="mr-3 flex shrink-0 items-center gap-3 rounded-2xl border border-[#e7dcc7] bg-white/80 px-5 py-3 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.src}
        alt={brand.name}
        loading="lazy"
        className="h-6 w-auto max-w-[112px] object-contain"
      />
      <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-[#201810]/70">
        {brand.name}
      </span>
    </span>
  );
}

function Row({ dir }: { dir: "left" | "right" }) {
  const base = dir === "right" ? [...BRAND_LOGOS].reverse() : BRAND_LOGOS;
  // Four identical copies + equal per-card margin means translateX(-50%) tiles
  // exactly (no jump) and one half is always wider than the viewport (no gap).
  const items = [...base, ...base, ...base, ...base];
  return (
    <div className={`evidiq-row ${dir === "left" ? "evidiq-row-left" : "evidiq-row-right"}`}>
      {items.map((brand, i) => (
        <LogoCard key={`${brand.name}-${i}`} brand={brand} />
      ))}
    </div>
  );
}

/** Two-row scrolling brand strip (top → left, bottom → right), seamless loop. */
export default function LogoMarquee() {
  return (
    <section className="border-y border-[#e7dcc7] bg-[#efe8da]/50 py-12">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.28em] text-[#201810]/40">
        Built on &amp; interoperable with the agent economy
      </p>
      <div className="evidiq-marquee-wrap flex flex-col gap-4 overflow-hidden">
        <Row dir="left" />
        <Row dir="right" />
      </div>
    </section>
  );
}
