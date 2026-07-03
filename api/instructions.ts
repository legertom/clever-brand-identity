import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "node:http";
import { renderGuidelinesMarkdown, renderJson, renderLlmsTxt, renderRobotPrompt } from "../src/brand.js";

type VercelRequest = IncomingMessage & {
  query?: Record<string, string | string[] | undefined>;
};

type VercelResponse = ServerResponse & {
  status: (statusCode: number) => VercelResponse;
  json: (body: unknown) => void;
  send: (body: string) => void;
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const query = req.query ?? {};
  const format = String(query.format ?? "markdown").toLowerCase();
  const section = typeof query.section === "string" ? query.section : undefined;
  const baseUrl = getBaseUrl(req);

  if (format === "json") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).json(renderJson());
    return;
  }

  if (format === "prompt") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(renderRobotPrompt(baseUrl));
    return;
  }

  if (format === "llms") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(renderLlmsTxt(baseUrl));
    return;
  }

  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.status(200).send(renderGuidelinesMarkdown(section));
}

function getBaseUrl(req: VercelRequest): string {
  const forwardedHost = req.headers["x-forwarded-host"];
  const forwardedProto = req.headers["x-forwarded-proto"];
  const host = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost ?? req.headers.host;
  const proto = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto ?? "https";

  return host ? `${proto}://${host}` : "https://<your-clever-brand-identity-domain>";
}

function setCors(req: { headers: IncomingHttpHeaders }, res: VercelResponse) {
  const origin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", typeof origin === "string" ? origin : "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id");
  res.setHeader("Vary", "Origin");
}
