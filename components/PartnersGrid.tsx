import { ECOSYSTEM } from "@/lib/site";

/** Static "founding partners" grid, mirrors the marquee ecosystem. */
export default function PartnersGrid() {
  return (
    <section id="partners" className="mx-auto max-w-6xl px-6 py-24 md:px-10">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-700">
          Founding ecosystem
        </p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
          Building the <span className="text-violet-600">trust layer</span> together.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[#201810]/65">
          The protocols, chains, and frameworks EVIDIQ builds on and interoperates with — brought
          into one open skill, not stacked on top of them.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {ECOSYSTEM.map((name) => (
          <div
            key={name}
            className="flex items-center justify-center rounded-xl border border-[#e7dcc7] bg-[#fbf8f1] px-3 py-5 text-center text-sm font-semibold tracking-tight text-[#201810]/60 transition-colors hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-700"
          >
            {name}
          </div>
        ))}
      </div>
    </section>
  );
}
