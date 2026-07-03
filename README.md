# Clever Brand Identity

Hosted Clever brand guidance for app-building agents.

This project publishes the brand system from the supplied Clever guideline deck as:

- `llms.txt` for robot discovery.
- Markdown and JSON brand instructions.
- A prompt endpoint for copy/paste agent setup.
- A read-only Streamable HTTP MCP endpoint.

## Use It

After deployment, use the Vercel origin as `BASE_URL`.

- Human docs: `BASE_URL/`
- Agent discovery: `BASE_URL/llms.txt`
- Markdown: `BASE_URL/brand-guidelines.md`
- JSON: `BASE_URL/brand-guidelines.json`
- Prompt: `BASE_URL/api/instructions?format=prompt`
- MCP: `BASE_URL/api/mcp`

## Robot Quick Start

Tell your coding agent:

```text
Before building Clever UI, fetch BASE_URL/llms.txt and BASE_URL/brand-guidelines.md. Follow them as the source of truth. If MCP is available, connect to BASE_URL/api/mcp and call get_brand_guidelines before designing. End with a brand compliance note.
```

More detailed instructions live in [docs/robot-instructions.md](docs/robot-instructions.md).

## MCP

The MCP endpoint is read-only and exposes:

- Resources: guidelines Markdown, guidelines JSON, and robot prompt.
- Tools: `get_brand_guidelines`, `audit_clever_app`.
- Prompt: `build-clever-app`.

The endpoint uses Streamable HTTP at:

```text
/api/mcp
```

## Local Development

```bash
npm install
npm run typecheck
vercel dev
```

## Inspect A Brand Deck

Use the included inspector before changing font guidance:

```bash
python3 scripts/inspect_pptx_fonts.py "/path/to/Clever Brand Guidelines.pptx" --ocr
```

The script reports live PPTX theme/typeface metadata separately from rendered slide-art OCR. That matters because the supplied deck is largely flattened artwork: the PPTX theme declares Arial, while the rendered typography pages document the brand fonts.

## Source And Scope

The content was summarized from `Clever Brand Guidelines - V7 AUG2025.pptx`, whose visible title slide says `V6 - October 2024`.

The source deck warns that many example photos and illustrations are not owned or licensed by Clever. This repo publishes text instructions and tokens only; it does not redistribute the deck's example imagery.
