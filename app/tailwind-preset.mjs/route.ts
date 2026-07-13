import { renderTailwindPreset } from "../../src/brand";
import { baseUrlFromRequest } from "../../src/base-url";

export function GET(request: Request) {
  return new Response(renderTailwindPreset(baseUrlFromRequest(request)), {
    headers: { "Content-Type": "text/javascript; charset=utf-8" }
  });
}
