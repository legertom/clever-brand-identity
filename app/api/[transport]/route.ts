import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  brandData,
  renderFontsCss,
  renderGuidelinesMarkdown,
  renderJson,
  renderLlmsTxt,
  renderRobotPrompt,
  renderTailwindPreset,
  renderTokensCss,
  renderTokensJson,
  sectionKeys
} from "../../../src/brand";
import { baseUrlFromRequest } from "../../../src/base-url";

// The brand data is public and read-only, and MCP clients (claude.ai,
// Claude Code, inspector UIs) connect from their own origins - so CORS is
// wide open on purpose. The previous implementation 403'd any cross-origin
// client, which blocked every hosted Claude connector.
const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, Mcp-Session-Id, MCP-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, MCP-Protocol-Version"
};

function buildHandler(baseUrl: string) {
  return createMcpHandler(
    (server) => {
      server.registerResource(
        "clever-brand-guidelines",
        "clever://brand/guidelines",
        {
          title: "Clever Brand Guidelines",
          description: "Agent-readable Clever brand identity rules in Markdown.",
          mimeType: "text/markdown"
        },
        async (uri) => ({
          contents: [{ uri: uri.href, mimeType: "text/markdown", text: renderGuidelinesMarkdown(undefined, baseUrl) }]
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
          contents: [
            { uri: uri.href, mimeType: "application/json", text: JSON.stringify(renderJson(baseUrl), null, 2) }
          ]
        })
      );

      server.registerResource(
        "clever-brand-tokens-css",
        "clever://brand/tokens.css",
        {
          title: "Clever Design Tokens CSS",
          description: "Drop-in CSS custom properties for Clever colors and typography.",
          mimeType: "text/css"
        },
        async (uri) => ({
          contents: [{ uri: uri.href, mimeType: "text/css", text: renderTokensCss(baseUrl) }]
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
            return { content: [{ type: "text", text: JSON.stringify(renderJson(baseUrl), null, 2) }] };
          }

          if (format === "prompt") {
            return { content: [{ type: "text", text: renderRobotPrompt(baseUrl) }] };
          }

          if (format === "llms") {
            return { content: [{ type: "text", text: renderLlmsTxt(baseUrl) }] };
          }

          return { content: [{ type: "text", text: renderGuidelinesMarkdown(section, baseUrl) }] };
        }
      );

      server.registerTool(
        "get_design_tokens",
        {
          title: "Get Clever design tokens",
          description:
            "Return build-ready Clever design tokens: CSS custom properties, W3C-style tokens JSON, a Tailwind preset, or font-loading CSS.",
          inputSchema: {
            format: z.enum(["css", "json", "tailwind", "fonts-css"]).default("css")
          }
        },
        async ({ format }) => {
          if (format === "json") {
            return { content: [{ type: "text", text: JSON.stringify(renderTokensJson(baseUrl), null, 2) }] };
          }

          if (format === "tailwind") {
            return { content: [{ type: "text", text: renderTailwindPreset(baseUrl) }] };
          }

          if (format === "fonts-css") {
            return { content: [{ type: "text", text: renderFontsCss(baseUrl) }] };
          }

          return { content: [{ type: "text", text: renderTokensCss(baseUrl) }] };
        }
      );

      server.registerTool(
        "audit_clever_app",
        {
          title: "Audit a Clever app concept",
          description:
            "Heuristic keyword check of a UI description, HTML, CSS, or design notes against the Clever brand checklist. Returns flags plus the full checklist; it is a reminder, not a substitute for reviewing the guidelines.",
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
            findings.push(
              "Audience is not explicit. Identify student, teacher, district admin, app partner, family, or mixed audience first."
            );
          }

          if (
            !/(#1464ff|#0a1e46|#daebff|#ffe478|#f78239|#4ecc97|#1c1c1c|clever blue|dark navy|light blue|tokens\.css|clever-preset)/i.test(
              appDescription
            )
          ) {
            findings.push(
              "Palette is not specified. Use approved Clever colors (ideally via /tokens.css) and verify contrast."
            );
          }

          if (
            /(center align|centered text|right align|justified text|text-align:\s*center|text-align:\s*right|text-align:\s*justify)/i.test(
              appDescription
            )
          ) {
            findings.push("Typography may violate the left-alignment rule. Clever typography should be left-aligned.");
          }

          if (/(gradient|purple|rounded pill|drop shadow logo|logo shadow|distort|rotate logo|recolor logo)/i.test(lower)) {
            findings.push(
              "Review visual treatment for non-brand effects or logo misuse. Do not distort, shadow, rotate, or recolor the logo outside approved rules."
            );
          }

          if (/(stock|photo|image)/i.test(lower) && !/(natural|professional|high-quality|blue label|academic|learning)/i.test(lower)) {
            findings.push(
              "Imagery needs more detail. Use natural, professional, high-quality educational photography and blue labels for descriptive text."
            );
          }

          if (/(icon|illustration)/i.test(lower) && !/(purpose|feature|diagram|callout|#3c404f|material symbols)/i.test(lower)) {
            findings.push("Icons or illustrations should have a clear communicative purpose and follow the approved styles.");
          }

          if (findings.length === 0) {
            findings.push(
              "No obvious brand conflicts found from the provided description. Still verify contrast, official logo assets, typography availability, and image rights before shipping."
            );
          }

          const checklist = brandData.sections.find((section) => section.key === "checklist");

          return {
            content: [
              {
                type: "text",
                text: [
                  `Audience: ${audience}`,
                  "",
                  "Findings (heuristic):",
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
    },
    {
      serverInfo: { name: "clever-brand-identity", version: "2.0.0" }
    },
    {
      basePath: "/api",
      maxDuration: 60
    }
  );
}

async function withCors(request: Request): Promise<Response> {
  const handler = buildHandler(baseUrlFromRequest(request));
  const response = await handler(request);
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export { withCors as GET, withCors as POST, withCors as DELETE };
