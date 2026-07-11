import { baseUrlFromRequest } from "@/lib/request-context";
import { evidiqSkill } from "@/lib/skill";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Serve the EVIDIQ agent skill as markdown: `curl -s https://evidiq.dev/skill.md`. */
export function GET(req: Request): Response {
  const body = evidiqSkill(baseUrlFromRequest(req));
  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
}
