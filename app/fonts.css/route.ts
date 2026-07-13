import { renderFontsCss } from "../../src/brand";
import { baseUrlFromRequest } from "../../src/base-url";

export function GET(request: Request) {
  return new Response(renderFontsCss(baseUrlFromRequest(request)), {
    headers: { "Content-Type": "text/css; charset=utf-8" }
  });
}
