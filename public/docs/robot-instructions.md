# Clever Brand Identity Instructions

This repository hosts Clever brand guidance for humans, coding agents, and MCP-compatible clients.

## Hosted endpoints

Use the deployed Vercel origin as `BASE_URL`.

- `BASE_URL/llms.txt` - discovery file for LLMs and agents.
- `BASE_URL/brand-guidelines.md` - Markdown brand rules.
- `BASE_URL/brand-guidelines.json` - structured brand tokens and checklist.
- `BASE_URL/api/instructions?format=prompt` - pasteable robot prompt.
- `BASE_URL/api/instructions?format=json` - live JSON from the API.
- `BASE_URL/api/instructions?format=markdown&section=color` - one section at a time.
- `BASE_URL/api/mcp` - Streamable HTTP MCP endpoint.

## Prompt for robots

Paste this into a system or developer message, replacing `BASE_URL` with the deployed Vercel URL:

```text
You are building or reviewing a Clever-branded app.

Before making design, copy, or UI decisions, fetch and follow:

- BASE_URL/llms.txt
- BASE_URL/brand-guidelines.md
- BASE_URL/brand-guidelines.json

If your runtime supports MCP, connect to BASE_URL/api/mcp.

Treat the hosted Clever brand guidance as the source of truth. Identify the audience first. Use a clear, confident, friendly voice. Use approved colors only, verify contrast, keep typography left-aligned and in sentence case, use official logo assets only, and do not reuse source-deck imagery unless rights are approved. Do not infer brand typography from PPTX theme metadata; use the rendered guideline typography documented in the hosted font evidence section.

Before shipping, produce a concise brand compliance note covering audience, voice/tone, palette, contrast, typography, logo usage, imagery/icons, and unresolved asset approvals.
```

## MCP usage

Add the MCP server URL to any client that supports remote Streamable HTTP MCP servers:

```text
BASE_URL/api/mcp
```

The server exposes:

- Resources:
  - `clever://brand/guidelines`
  - `clever://brand/guidelines.json`
  - `clever://brand/robot-prompt`
- Tools:
  - `get_brand_guidelines`
  - `audit_clever_app`
- Prompt:
  - `build-clever-app`

For clients that do not support remote MCP, fetch `llms.txt` or `brand-guidelines.md` directly before generating UI.

## Updating the brand rules

1. Extract changes from the current Clever brand deck.
2. Run `python3 scripts/inspect_pptx_fonts.py /path/to/Clever\ Brand\ Guidelines.pptx --ocr` to separate live PPTX font metadata from rendered guideline font rules.
3. Update `src/brand.ts`.
4. Keep `public/brand-guidelines.md`, `public/brand-guidelines.json`, and `public/llms.txt` aligned with the source data.
5. Run `npm run typecheck`.
6. Deploy to Vercel.

## Rights note

The source deck states that many example images and illustrations are not owned or licensed by Clever and should not be used for public-facing communications. This repo intentionally hosts rules and tokens, not the deck's example imagery.
