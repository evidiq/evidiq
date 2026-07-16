/** The single byline used by every EVIDIQ blog post — hand-written and
 *  auto-generated alike. Rendered as an author card at the end of each post
 *  (matches the "team card" pattern: initial avatar + name + bio + link).
 *  href points at the author's own profile page (app/blog/author/[slug]/),
 *  NOT the landing page — a reader clicking the byline expects a writer
 *  profile / archive of that author's posts, not the marketing homepage. */
export const BLOG_AUTHOR = {
  slug: "evidiq-team",
  name: "EVIDIQ Team",
  initial: "E",
  bio: "The EVIDIQ team builds the trust layer for the AI agent economy — verifying agent identity and capability, scoring risk, and anchoring every verdict on-chain so agents can decide who to trust before value moves.",
  href: "/blog/author/evidiq-team",
  linkLabel: "More from EVIDIQ Team",
};
