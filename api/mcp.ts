import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod/v4";
import {
  brandData,
  renderGuidelinesMarkdown,
  renderJson,
  renderLlmsTxt,
  renderRobotPrompt,
  sectionKeys
} from "../src/brand.js";

type VercelRequest = IncomingMessage & {
  body?: unknown;
};

type VercelResponse = ServerResponse & {
  status: (statusCode: number) => VercelResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAllowedOrigin(req)) {
    res.status(403).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Origin not allowed" },
      id: null
    });
    return;
  }

  setCors(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method === "GET" || req.method === "DELETE") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed" },
      id: null
    });
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed" },
      id: null
    });
    return;
  }

  const server = createServer(getBaseUrl(req));
  const transport = new StreamableHTTPServerTransport({
    enableJsonResponse: true,
    sessionIdGenerator: undefined
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP request failed", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null
      });
    }
  } finally {
    await transport.close();
    await server.close();
  }
}

function createServer(baseUrl: string) {
  const server = new McpServer({
    name: "clever-brand-identity",
    version: "1.0.0"
  });

  server.registerResource(
    "clever-brand-guidelines",
    "clever://brand/guidelines",
    {
      title: "Clever Brand Guidelines",
      description: "Agent-readable Clever brand identity rules in Markdown.",
      mimeType: "text/markdown"
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: "text/markdown", text: renderGuidelinesMarkdown() }]
    })
  );

  server.registerResource(
    "clever-brand-json",
    "clever://brand/guidelines.json",
    {
      title: "Clever Brand Guidelines JSON",
      description: "Structured Clever brand tokens, rules, and checklist.",
      mimeType: "application/json"
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(renderJson(), null, 2) }]
    })
  );

  server.registerResource(
    "clever-brand-robot-prompt",
    "clever://brand/robot-prompt",
    {
      title: "Clever Brand Robot Prompt",
      description: "Pasteable instructions for agents building Clever-branded apps.",
      mimeType: "text/plain"
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: "text/plain", text: renderRobotPrompt(baseUrl) }]
    })
  );

  server.registerTool(
    "get_brand_guidelines",
    {
      title: "Get Clever brand guidelines",
      description: "Return Clever brand guidance as Markdown, JSON, llms.txt, or a robot prompt.",
      inputSchema: {
        format: z.enum(["markdown", "json", "prompt", "llms"]).default("markdown"),
        section: z.enum(["all", ...sectionKeys] as [string, ...string[]]).default("all")
      }
    },
    async ({ format, section }) => {
      if (format === "json") {
        return { content: [{ type: "text", text: JSON.stringify(renderJson(), null, 2) }] };
      }

      if (format === "prompt") {
        return { content: [{ type: "text", text: renderRobotPrompt(baseUrl) }] };
      }

      if (format === "llms") {
        return { content: [{ type: "text", text: renderLlmsTxt(baseUrl) }] };
      }

      return { content: [{ type: "text", text: renderGuidelinesMarkdown(section) }] };
    }
  );

  server.registerTool(
    "audit_clever_app",
    {
      title: "Audit a Clever app concept",
      description: "Review a UI description, HTML, CSS, or screenshot notes against the Clever brand checklist.",
      inputSchema: {
        appDescription: z.string().min(1).describe("The app, UI, screen, HTML, CSS, or design notes to review."),
        audience: z
          .enum(["student", "teacher", "district-admin", "app-partner", "family", "mixed", "unknown"])
          .default("unknown")
      }
    },
    async ({ appDescription, audience }) => {
      const lower = appDescription.toLowerCase();
      const findings: string[] = [];

      if (audience === "unknown") {
        findings.push("Audience is not explicit. Identify student, teacher, district admin, app partner, family, or mixed audience first.");
      }

      if (!/(#1464ff|#0a1e46|#daebff|#ffe478|#f78239|#4ecc97|#1c1c1c|clever blue|dark navy|light blue)/i.test(appDescription)) {
        findings.push("Palette is not specified. Use approved Clever colors and verify contrast.");
      }

      if (/(center align|centered text|right align|justified text|text-align:\s*center|text-align:\s*right|text-align:\s*justify)/i.test(appDescription)) {
        findings.push("Typography may violate the left-alignment rule. Clever typography should be left-aligned.");
      }

      if (/(gradient|purple|rounded pill|drop shadow logo|logo shadow|distort|rotate logo|recolor logo)/i.test(lower)) {
        findings.push("Review visual treatment for non-brand effects or logo misuse. Do not distort, shadow, rotate, or recolor the logo outside approved rules.");
      }

      if (/(stock|photo|image)/i.test(lower) && !/(natural|professional|high-quality|blue label|academic|learning)/i.test(lower)) {
        findings.push("Imagery needs more detail. Use natural, professional, high-quality educational photography and blue labels for descriptive text.");
      }

      if (/(icon|illustration)/i.test(lower) && !/(purpose|feature|diagram|callout|#3c404f|material symbols)/i.test(lower)) {
        findings.push("Icons or illustrations should have a clear communicative purpose and follow the approved styles.");
      }

      if (findings.length === 0) {
        findings.push("No obvious brand conflicts found from the provided description. Still verify contrast, official logo assets, typography availability, and image rights before shipping.");
      }

      const checklist = brandData.sections.find((section) => section.key === "checklist");

      return {
        content: [
          {
            type: "text",
            text: [
              `Audience: ${audience}`,
              "",
              "Findings:",
              ...findings.map((finding) => `- ${finding}`),
              "",
              "Baseline checklist:",
              ...(checklist?.body.map((item) => `- ${item}`) ?? [])
            ].join("\n")
          }
        ]
      };
    }
  );

  server.registerPrompt(
    "build-clever-app",
    {
      title: "Build a Clever-branded app",
      description: "Reusable prompt for agents that need to build or review Clever-branded apps.",
      argsSchema: {
        appDescription: z.string().optional().describe("Optional description of the app to build or review.")
      }
    },
    async ({ appDescription }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `${renderRobotPrompt(baseUrl)}${appDescription ? `\n\nApp to build or review:\n${appDescription}` : ""}`
          }
        }
      ]
    })
  );

  return server;
}

function getBaseUrl(req: VercelRequest): string {
  const forwardedHost = req.headers["x-forwarded-host"];
  const forwardedProto = req.headers["x-forwarded-proto"];
  const host = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost ?? req.headers.host;
  const proto = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto ?? "https";

  return host ? `${proto}://${host}` : "https://<your-clever-brand-identity-domain>";
}

function isAllowedOrigin(req: { headers: IncomingHttpHeaders }): boolean {
  const origin = req.headers.origin;
  if (!origin || Array.isArray(origin)) {
    return true;
  }

  const host = req.headers["x-forwarded-host"] ?? req.headers.host;
  const hostValue = Array.isArray(host) ? host[0] : host;
  const sameHost = hostValue ? origin === `https://${hostValue}` || origin === `http://${hostValue}` : false;
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return sameHost || allowedOrigins.includes(origin);
}

function setCors(req: { headers: IncomingHttpHeaders }, res: VercelResponse) {
  const origin = req.headers.origin;
  if (!origin || Array.isArray(origin) || !isAllowedOrigin(req)) {
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id");
  res.setHeader("Vary", "Origin");
}
