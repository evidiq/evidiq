import HomeClient, { type BlogCardData } from "@/components/HomeClient";
import { POSTS } from "@/lib/blog";
import { listPosts } from "@/lib/blog-engine/store";

// Server component: reads generated posts off disk (content/blog/) and the
// hand-written POSTS list, merges + sorts them, and hands the top ones to
// the client component for the landing-page "Dispatches" card grid. Kept
// server-side because listPosts() reads the filesystem — it cannot run in
// the client bundle.
//
// force-dynamic for the same reason as /blog: new posts land on disk while
// the container is already running (the cron hits the API, not a rebuild),
// so a statically-frozen homepage would never show them.
export const dynamic = "force-dynamic";

export default function Home() {
  const handWritten: BlogCardData[] = POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    readingTime: p.readingTime,
    tag: p.tag,
    excerpt: p.excerpt,
    image: p.image,
  }));
  const generated: BlogCardData[] = listPosts({ onlyPublished: true }).map((p) => ({
    slug: p.slug,
    title: p.h1,
    date: p.publishedAt ?? p.createdAt,
    readingTime: p.readTime,
    tag: p.category,
    excerpt: p.excerpt,
    image: p.featuredImage,
  }));
  const blogCards = [...handWritten, ...generated].sort((a, b) => b.date.localeCompare(a.date));

  return <HomeClient blogCards={blogCards} />;
}
