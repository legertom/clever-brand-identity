import { renderGuidelinesMarkdown } from "../../src/brand";
import { baseUrlFromRequest } from "../../src/base-url";

export function GET(request: Request) {
  return new Response(renderGuidelinesMarkdown(undefined, baseUrlFromRequest(request)), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" }
  });
}
