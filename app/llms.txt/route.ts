import { renderLlmsTxt } from "../../src/brand";
import { baseUrlFromRequest } from "../../src/base-url";

export function GET(request: Request) {
  return new Response(renderLlmsTxt(baseUrlFromRequest(request)), {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
