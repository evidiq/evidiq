import { BRAND_LOGOS, type Brand } from "@/lib/site";

function LogoCard({ brand }: { brand: Brand }) {
  return (
    <span className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#e7dcc7] bg-white/80 px-5 py-3 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
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
  // Duplicate the set so the -50% translate loops seamlessly.
  const items = [...base, ...base];
  return (
    <div className={`evidiq-row gap-3 ${dir === "left" ? "evidiq-row-left" : "evidiq-row-right"}`}>
      {items.map((brand, i) => (
        <LogoCard key={`${brand.name}-${i}`} brand={brand} />
      ))}
    </div>
  );
}

/** Two-row scrolling brand strip (top → left, bottom → right), real logos. */
export default function LogoMarquee() {
  return (
    <section className="border-y border-[#e7dcc7] bg-[#efe8da]/50 py-10">
      <p className="mb-7 text-center text-xs font-semibold uppercase tracking-[0.28em] text-[#201810]/40">
        Built on & interoperable with the agent economy
      </p>
      <div className="evidiq-marquee-wrap flex flex-col gap-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <Row dir="left" />
        <Row dir="right" />
      </div>
    </section>
  );
}
