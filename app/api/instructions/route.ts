import {
  renderGuidelinesMarkdown,
  renderJson,
  renderLlmsTxt,
  renderRobotPrompt
} from "../../../src/brand";
import { baseUrlFromRequest } from "../../../src/base-url";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept"
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = (searchParams.get("format") ?? "markdown").toLowerCase();
  const section = searchParams.get("section") ?? undefined;
  const baseUrl = baseUrlFromRequest(request);

  if (format === "json") {
    return Response.json(renderJson(baseUrl), { headers: CORS_HEADERS });
  }

  if (format === "prompt") {
    return new Response(renderRobotPrompt(baseUrl), {
      headers: { ...CORS_HEADERS, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  if (format === "llms") {
    return new Response(renderLlmsTxt(baseUrl), {
      headers: { ...CORS_HEADERS, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  return new Response(renderGuidelinesMarkdown(section, baseUrl), {
    headers: { ...CORS_HEADERS, "Content-Type": "text/markdown; charset=utf-8" }
  });
}
