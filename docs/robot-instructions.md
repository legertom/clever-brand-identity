# Clever Brand Identity Instructions

This repository hosts Clever brand guidance for humans, coding agents, and MCP-compatible clients.

## Hosted endpoints

Use the deployed Vercel origin as `BASE_URL`.

- `BASE_URL/llms.txt` - discovery file for LLMs and agents.
- `BASE_URL/brand-guidelines.md` - Markdown brand rules.
- `BASE_URL/brand-guidelines.json` - structured brand data (single source of truth as JSON).
- `BASE_URL/tokens.css` - drop-in CSS custom properties (colors, font stacks, leading).
- `BASE_URL/tokens.json` - W3C-style design tokens.
- `BASE_URL/fonts.css` - font stacks with the approved Google fall-backs wired.
- `BASE_URL/tailwind-preset.mjs` - Tailwind theme preset.
- `BASE_URL/api/instructions?format=prompt` - pasteable robot prompt.
- `BASE_URL/api/instructions?format=markdown&section=color` - one section at a time.
- `BASE_URL/api/mcp` - Streamable HTTP MCP endpoint.

## Prompt for robots

Paste this into a system or developer message, replacing `BASE_URL` with the deployed URL:

```text
You are building or reviewing a Clever-branded app.

Before making design, copy, or UI decisions, fetch and follow:

- BASE_URL/llms.txt
- BASE_URL/brand-guidelines.md
- BASE_URL/tokens.css

If your runtime supports MCP, connect to BASE_URL/api/mcp and call get_brand_guidelines and
get_design_tokens.

Treat the hosted Clever brand guidance as the source of truth. Identify the audience first.
Use a clear, confident, friendly voice. Use approved colors only (via tokens.css), verify
contrast, keep typography left-aligned and in sentence case with heading line-height 0.95 and
body line-height 1.35, use official logo assets only, and do not reuse source-deck imagery
unless rights are approved. The brand fonts (ABC Arizona Mix, Messina Sans) are licensed; use
the wired Google fall-backs until the app has licensed files.

Before shipping, produce a concise brand compliance note covering audience, voice/tone,
palette, contrast, typography, logo usage, imagery/icons, and unresolved asset approvals.
```

## MCP usage

Add the MCP server URL to any client that supports remote Streamable HTTP MCP servers:

```text
BASE_URL/api/mcp
```

For Claude Code:

```bash
claude mcp add --transport http clever-brand BASE_URL/api/mcp
```

The server exposes:

- Resources: `clever://brand/guidelines`, `clever://brand/guidelines.json`,
  `clever://brand/tokens.css`, `clever://brand/robot-prompt`
- Tools: `get_brand_guidelines`, `get_design_tokens`, `audit_clever_app` (heuristic checklist)
- Prompt: `build-clever-app`

CORS is open on the MCP endpoint and content endpoints; the data is public and read-only.

For clients that do not support remote MCP, fetch `llms.txt` or `brand-guidelines.md` directly
before generating UI.

## Updating the brand rules

1. Extract changes from the current Clever brand deck (transcribe the rendered slides; the deck
   is flattened images, so the PPTX XML is not the source of truth).
2. Run `python3 scripts/inspect_pptx_fonts.py /path/to/deck.pptx --ocr` to separate live PPTX
   font metadata from rendered guideline font rules.
3. Update `src/brand.ts` - it is the only place content lives. Every endpoint renders from it.
4. Run `npm run typecheck && npm run build`.
5. Deploy to Vercel.

## Rights note

The source deck states that many example images and illustrations are not owned or licensed by
Clever and should not be used for public-facing communications. This repo intentionally hosts
rules and tokens - not the deck's example imagery, not logo files, and not the licensed fonts.
