import type { Metadata } from "next";

const SITE = "https://evidiq.dev";

// `app/playground/page.tsx` is a client component, so it cannot export metadata of
// its own. Without this segment layout the route inherited the root `openGraph.url`
// — the site root — and carried no canonical at all, which invites a crawler to read
// /playground as a duplicate of /. Both are set here, resolved against the
// `metadataBase` declared in the root layout.
export const metadata: Metadata = {
  title: "Playground — EVIDIQ",
  description:
    "Walk an EVIDIQ trust check end to end in the browser and see the signed, 0G-anchored report it produces.",
  alternates: { canonical: "/playground" },
  openGraph: {
    title: "Playground — EVIDIQ",
    description:
      "Walk an EVIDIQ trust check end to end in the browser and see the signed, 0G-anchored report it produces.",
    url: `${SITE}/playground`,
    siteName: "EVIDIQ",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return children;
}
