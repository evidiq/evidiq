import type { Metadata } from "next";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://evidiq.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "EVIDIQ — The Trust Layer for the AI Agent Economy",
  description:
    "Verify capability, score risk, and build on-chain reputation before every AI transaction. EVIDIQ is the trust layer for the AI agent economy.",
  openGraph: {
    title: "EVIDIQ — The Trust Layer for the AI Agent Economy",
    description: "Verify. Score. Trust. Before every AI transaction.",
    url: SITE,
    siteName: "EVIDIQ",
    images: [{ url: "/logo.png", width: 1254, height: 1254 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EVIDIQ — The Trust Layer for the AI Agent Economy",
    description: "Verify. Score. Trust. Before every AI transaction.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
