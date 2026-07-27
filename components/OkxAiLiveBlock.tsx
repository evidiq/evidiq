"use client";
import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

/**
 * The two addresses that matter for a live EVIDIQ service, in one block:
 *
 *   1. its OKX.AI marketplace listing, so a buyer can find and hire the agent
 *   2. its MCP endpoint, so a developer can connect a client straight away
 *
 * Both are copyable, because both get pasted — one into chat or a browser, the
 * other into an MCP client config. Every product doc page renders this with its
 * own agent id and endpoint; a page showing another service's link would be worse
 * than showing none.
 */

type Status = "listed" | "review";

const TONE: Record<Status, { wrap: string; pill: string; button: string; ghost: string; label: string }> = {
  listed: {
    wrap: "border-emerald-200 bg-emerald-50/60",
    pill: "bg-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
    ghost: "border-emerald-300 text-emerald-700 hover:bg-emerald-100",
    label: "Live on OKX.AI",
  },
  review: {
    wrap: "border-amber-200 bg-amber-50/60",
    pill: "bg-amber-600",
    button: "bg-amber-600 hover:bg-amber-700",
    ghost: "border-amber-300 text-amber-700 hover:bg-amber-100",
    label: "Listing under review",
  },
};

function CopyButton({ value, tone, label }: { value: string; tone: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers and insecure contexts, where the clipboard
      // API is unavailable: copy through a hidden textarea instead.
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
      document.body.removeChild(ta);
    }
  };

  return (
    <button
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold transition-colors ${tone}`}
      aria-label={label}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Row({
  heading,
  sub,
  value,
  href,
  action,
  tone,
}: {
  heading: string;
  sub: string;
  value: string;
  href: string;
  action: string;
  tone: (typeof TONE)[Status];
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#1a130a]">{heading}</p>
        <p className="mt-0.5 break-all font-mono text-xs text-[#201810]/60">{value}</p>
        <p className="mt-0.5 text-xs text-[#201810]/50">{sub}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <CopyButton value={value} tone={tone.ghost} label={`Copy ${heading}`} />
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors ${tone.button}`}
        >
          {action} <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

export default function OkxAiLiveBlock({
  url,
  agentId,
  name,
  endpoint,
  x402Url,
  status = "listed",
}: {
  /** The OKX.AI marketplace listing, e.g. https://www.okx.ai/agents/9700 */
  url: string;
  agentId: number;
  name: string;
  /** The service's own MCP endpoint. */
  endpoint: string;
  /** Public x402 discovery URL; derived from the endpoint when omitted. */
  x402Url?: string;
  status?: Status;
}) {
  const tone = TONE[status];
  const discovery = x402Url ?? endpoint.replace(/\/mcp$/, "/x402");

  return (
    <div className={`mt-8 rounded-2xl border p-5 ${tone.wrap}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${tone.pill}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          {tone.label}
        </span>
        <p className="text-sm font-semibold text-[#1a130a]">{name}</p>
        <span className="font-mono text-xs text-[#201810]/50">Agent #{agentId}</span>
      </div>

      <div className="mt-4 space-y-4 border-t border-black/5 pt-4">
        <Row
          heading="OKX.AI listing"
          sub={
            status === "listed"
              ? "Hire this agent directly from the marketplace."
              : "Submitted for approval; the endpoint below is already live."
          }
          value={url}
          href={url}
          action="Open"
          tone={tone}
        />
        <Row
          heading="MCP endpoint"
          sub="Streamable HTTP, x402-gated. Free tools answer without payment."
          value={endpoint}
          href={discovery}
          action="Inspect"
          tone={tone}
        />
      </div>
    </div>
  );
}
