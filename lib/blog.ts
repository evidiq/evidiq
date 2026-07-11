export type Post = {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  tag: string;
  excerpt: string;
};

export const POSTS: Post[] = [
  {
    slug: "evidiq-live-on-0g",
    title: "EVIDIQ is live: a trust layer with proofs on 0G",
    date: "2026-07-11",
    readingTime: "4 min",
    tag: "Launch",
    excerpt:
      "Verify capability, score risk, and get a TEE-verified, 0G-anchored Trust Report before any agent-to-agent transaction — served as an open skill, an MCP server, and an x402 endpoint.",
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
