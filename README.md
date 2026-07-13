# Clever Brand Identity

Hosted Clever brand guidance for app-building agents. Next.js App Router on Vercel.

Everything is rendered from one source of truth, [src/brand.ts](src/brand.ts) — there are no
hand-maintained static copies to drift.

## Endpoints

Use the deployed origin as `BASE_URL`.

| Endpoint | What it is |
| --- | --- |
| `BASE_URL/` | Human docs page |
| `BASE_URL/llms.txt` | Agent discovery file |
| `BASE_URL/brand-guidelines.md` | Full guidelines, Markdown |
| `BASE_URL/brand-guidelines.json` | Structured guidelines JSON |
| `BASE_URL/tokens.css` | Drop-in CSS custom properties |
| `BASE_URL/tokens.json` | W3C-style design tokens |
| `BASE_URL/fonts.css` | Font stacks with approved Google fall-backs wired |
| `BASE_URL/tailwind-preset.mjs` | Tailwind theme preset |
| `BASE_URL/api/instructions?format=prompt` | Pasteable robot prompt (`format=markdown\|json\|llms` too) |
| `BASE_URL/api/mcp` | Streamable HTTP MCP endpoint |

## Robot Quick Start

Tell your coding agent:

```text
Before building Clever UI, fetch BASE_URL/llms.txt and BASE_URL/brand-guidelines.md and follow
them as the source of truth. Pull BASE_URL/tokens.css for colors and typography. If MCP is
available, connect to BASE_URL/api/mcp and call get_brand_guidelines and get_design_tokens
before designing. End with a brand compliance note.
```

More detail in [docs/robot-instructions.md](docs/robot-instructions.md).

## MCP

Read-only Streamable HTTP MCP server at `/api/mcp` (CORS open — the data is public):

- Tools: `get_brand_guidelines`, `get_design_tokens`, `audit_clever_app` (heuristic checklist).
- Resources: guidelines Markdown/JSON, tokens CSS, robot prompt.
- Prompt: `build-clever-app`.

Add it to Claude Code with:

```bash
claude mcp add --transport http clever-brand BASE_URL/api/mcp
```

## Fonts

The brand fonts are **ABC Arizona Mix Regular** (headings, Dinamo) and **Messina Sans Book**
(body, Luzi Type Foundry) — verified against the rendered typography slides of the source deck.
They are commercial fonts this service cannot redistribute: foundries license per site/seat, and
a Clever license would not cover third-party apps built against this service. The generated CSS
names the licensed families first and wires the deck's approved Google fall-backs
(Merriweather + Inter, PT Serif + Manrope, Martel + Plus Jakarta Sans). License and self-host the
real files in your app when you can.

Do not trust the PPTX file's internal font metadata (Arial theme, embedded Proxima Nova/Inter/
Merriweather) — the deck is a Google Slides export whose slides are flattened images; that
metadata is editor chrome. `python3 scripts/inspect_pptx_fonts.py <deck.pptx> --ocr` separates
the two kinds of evidence.

## Local Development

```bash
npm install
npm run dev        # next dev
npm run typecheck
npm run build
```

## Source And Scope

Content was derived from `Clever Brand Guidelines - V7 AUG2025.pptx` (visible title slide says
`V6 - October 2024`) by transcribing all 81 rendered slides and pixel-sampling color swatches.
Known defects in the source deck are recorded in `sourceAnomalies` in
[src/brand.ts](src/brand.ts) and surfaced in the JSON endpoints.

The source deck warns that many example photos and illustrations are not owned or licensed by
Clever. This repo publishes text instructions and tokens only; it does not redistribute the
deck's imagery, logo files, or fonts.
