"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { GitHubIcon, TelegramIcon, XIcon } from "@/components/icons";
import { NAV, SOCIALS } from "@/lib/site";

function Socials({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <a
        href={SOCIALS.telegram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
        className="grid h-8 w-8 place-items-center rounded-full border border-[#e7dcc7] bg-white/60 text-[#201810]/70 transition-colors hover:border-violet-300 hover:text-violet-700"
      >
        <TelegramIcon />
      </a>
      <a
        href={SOCIALS.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="grid h-8 w-8 place-items-center rounded-full border border-[#e7dcc7] bg-white/60 text-[#201810]/70 transition-colors hover:border-violet-300 hover:text-violet-700"
      >
        <GitHubIcon />
      </a>
      <a
        href={SOCIALS.x}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X"
        className="grid h-8 w-8 place-items-center rounded-full border border-[#e7dcc7] bg-white/60 text-[#201810]/70 transition-colors hover:border-violet-300 hover:text-violet-700"
      >
        <XIcon />
      </a>
    </div>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between border-b border-[#e7dcc7]/70 bg-[#f4efe4]/85 px-6 py-3 backdrop-blur-md md:px-10">
        <Link href="/" aria-label="EVIDIQ home">
          <Logo size={28} wordClassName="text-lg text-[#1a130a]" />
        </Link>

        <div className="hidden items-center gap-7 text-sm text-[#201810]/70 lg:flex">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-[#1a130a]">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Socials />
          <Link
            href="/docs"
            className="hidden rounded-lg border border-[#201810]/20 px-4 py-2 text-sm font-semibold text-[#201810] transition-colors hover:bg-[#201810]/5 lg:inline-flex"
          >
            Install skill
          </Link>
          <Link
            href="/#how"
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-violet-700"
          >
            Get a Trust Score <ArrowRight size={15} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#e7dcc7] text-[#201810] md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="border-b border-[#e7dcc7] bg-[#f4efe4] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#201810]/80 hover:bg-violet-50 hover:text-violet-700"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Socials />
            <Link
              href="/#how"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white"
            >
              Get a Trust Score <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
