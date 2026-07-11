import Link from "next/link";
import { Logo } from "@/components/Logo";
import { GitHubIcon, TelegramIcon, XIcon } from "@/components/icons";
import { SOCIALS } from "@/lib/site";

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "The stack", href: "/#stack" },
      { label: "How it works", href: "/#how" },
      { label: "Partners", href: "/#partners" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "skill.md", href: "/skill.md", external: true },
      { label: "MCP endpoint", href: "/docs#mcp" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
      { label: "GitHub", href: SOCIALS.github, external: true },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#e7dcc7] bg-[#efe8da] px-6 py-14 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo size={28} wordClassName="text-lg text-[#1a130a]" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#201810]/60">
            The trust layer for the AI agent economy. Verify capability, score risk, and build
            on-chain reputation before every AI transaction.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <a href={SOCIALS.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="grid h-9 w-9 place-items-center rounded-full border border-[#e0d4bd] bg-white/60 text-[#201810]/70 transition-colors hover:border-violet-300 hover:text-violet-700">
              <TelegramIcon />
            </a>
            <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-full border border-[#e0d4bd] bg-white/60 text-[#201810]/70 transition-colors hover:border-violet-300 hover:text-violet-700">
              <GitHubIcon />
            </a>
            <a href={SOCIALS.x} target="_blank" rel="noopener noreferrer" aria-label="X" className="grid h-9 w-9 place-items-center rounded-full border border-[#e0d4bd] bg-white/60 text-[#201810]/70 transition-colors hover:border-violet-300 hover:text-violet-700">
              <XIcon />
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#201810]/45">
              {col.title}
            </div>
            <ul className="space-y-2.5">
              {col.links.map((l) =>
                l.external ? (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#201810]/70 transition-colors hover:text-violet-700">
                      {l.label}
                    </a>
                  </li>
                ) : (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-[#201810]/70 transition-colors hover:text-violet-700">
                      {l.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-[#e0d4bd] pt-6 text-xs text-[#201810]/50 md:flex-row">
        <span>© {new Date().getFullYear()} EVIDIQ — make every AI agent verifiable, trustworthy, and accountable.</span>
        <span>Built for the OKX AI Genesis Hackathon · powered by 0G</span>
      </div>
    </footer>
  );
}
