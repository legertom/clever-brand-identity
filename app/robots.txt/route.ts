import { baseUrlFromRequest } from "../../src/base-url";

export function GET(request: Request) {
  const base = baseUrlFromRequest(request);
  const body = `User-agent: *\nAllow: /\n\nSitemap-free zone; start at ${base}/llms.txt\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
