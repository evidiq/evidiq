"use client";
import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

/**
 * "Live on OKX.AI" copyable block — shown on product doc pages.
 * Renders the agent's OKX.AI marketplace URL with a copy button, so users
 * can grab it to share or reference in chat/support. Click-through opens
 * the marketplace listing directly.
 */
export default function OkxAiLiveBlock({
  url,
  agentId,
  name,
}: {
  url: string;
  agentId: number;
  name: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select-and-copy via a temp input (older browsers / insecure context)
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
      document.body.removeChild(ta);
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          Live on OKX.AI
        </span>
        <div>
          <p className="text-sm font-semibold text-[#1a130a]">{name}</p>
          <p className="font-mono text-xs text-[#201810]/60">Agent #{agentId} · {url}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
          aria-label="Copy OKX.AI URL"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Open <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
