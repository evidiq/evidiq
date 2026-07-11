import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import { POSTS, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — EVIDIQ",
  description: "Updates and writing from EVIDIQ, the trust layer for the AI agent economy.",
};

export default function BlogPage() {
  return (
    <PageShell>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">Blog</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1a130a] md:text-5xl">
        Writing &amp; updates
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[#201810]/70">
        Notes on building the trust layer for the AI agent economy.
      </p>

      <div className="mt-10 space-y-5">
        {POSTS.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group block rounded-2xl border border-[#e7dcc7] bg-[#fbf8f1] p-6 transition-colors hover:border-violet-300 hover:bg-violet-50/50"
          >
            <div className="flex items-center gap-3 text-xs text-[#201810]/50">
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 font-semibold text-violet-700">
                {p.tag}
              </span>
              <span>{formatDate(p.date)}</span>
              <span>·</span>
              <span>{p.readingTime}</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#1a130a]">{p.title}</h2>
            <p className="mt-2 leading-relaxed text-[#201810]/70">{p.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700">
              Read post <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
