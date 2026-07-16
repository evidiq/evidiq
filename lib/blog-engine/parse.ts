/**
 * Markdown post-processing shared by the rendered blog post page:
 *  - extractToc: H2 headings (excluding the FAQ heading itself) -> anchors.
 *  - extractFaq: pulls the "## Frequently Asked Questions" section's H3 Q/A
 *    pairs out into structured data, and returns the markdown with that
 *    section removed (so the page can render the FAQ as an accordion
 *    component instead of plain H3/paragraph markdown).
 */

export interface TocItem {
  id: string;
  text: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** Slugify a heading into an anchor id (e.g. "How It Works" -> "how-it-works"). */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Extract H2 headings for a table of contents, skipping the FAQ heading
 *  (the FAQ is rendered as its own accordion block, not a prose section). */
export function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];
  const re = /^##\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const text = m[1].trim();
    if (/frequently asked/i.test(text)) continue;
    items.push({ id: headingId(text), text });
  }
  return items;
}

/** Split content into [beforeFaq, faqItems, afterFaq]. If there is no FAQ
 *  H2, returns the original content untouched and an empty FaqItem list. */
export function extractFaq(content: string): {
  body: string;
  faq: FaqItem[];
} {
  const faqHeadingRe = /^##\s+Frequently Asked Questions\s*$/im;
  const match = faqHeadingRe.exec(content);
  if (!match) return { body: content, faq: [] };

  const start = match.index;
  const rest = content.slice(start + match[0].length);
  // The FAQ section ends at the next H2, or at the end of the document.
  const nextH2 = /^##\s+/m.exec(rest);
  const faqBlock = nextH2 ? rest.slice(0, nextH2.index) : rest;
  const afterFaq = nextH2 ? rest.slice(nextH2.index) : "";
  const beforeFaq = content.slice(0, start);

  const faq: FaqItem[] = [];
  const itemRe = /^###\s+(.+)\n+([\s\S]*?)(?=^###\s+|$(?![\s\S]))/gm;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(faqBlock)) !== null) {
    const question = m[1].trim();
    const answer = m[2].trim();
    if (question && answer) faq.push({ question, answer });
  }

  return { body: `${beforeFaq}${afterFaq}`, faq };
}

/** Flatten a react-markdown children tree into plain text (for computing a
 *  heading's anchor id at render time, from the same text the TOC used). */
export function childrenToText(children: unknown): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join("");
  if (
    children &&
    typeof children === "object" &&
    "props" in (children as Record<string, unknown>)
  ) {
    return childrenToText((children as { props?: { children?: unknown } }).props?.children);
  }
  return "";
}
