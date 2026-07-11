import { ECOSYSTEM } from "@/lib/site";

function Pill({ name }: { name: string }) {
  return (
    <span className="flex shrink-0 items-center whitespace-nowrap rounded-xl border border-[#e7dcc7] bg-[#fbf8f1] px-6 py-2.5 text-sm font-semibold tracking-tight text-[#201810]/55">
      {name}
    </span>
  );
}

function Row({ dir }: { dir: "left" | "right" }) {
  // Duplicated set so the -50% translate loops seamlessly.
  const items = [...ECOSYSTEM, ...ECOSYSTEM];
  return (
    <div className={`evidiq-row gap-3 ${dir === "left" ? "evidiq-row-left" : "evidiq-row-right"}`}>
      {items.map((name, i) => (
        <Pill key={`${name}-${i}`} name={name} />
      ))}
    </div>
  );
}

/** Two-row scrolling ecosystem strip (top → left, bottom → right). */
export default function LogoMarquee() {
  return (
    <section className="border-y border-[#e7dcc7] bg-[#efe8da]/50 py-9">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.28em] text-[#201810]/40">
        Works with the agent economy
      </p>
      <div className="evidiq-marquee-wrap flex flex-col gap-3 overflow-hidden">
        <Row dir="left" />
        <Row dir="right" />
      </div>
    </section>
  );
}
