# Moss Demo Mock

Local, clickable demo clone of the public Moss integrations website and documentation experience. This is not the Moss product and does not connect to production Moss APIs.

## Run

```bash
npm install
npm run fetch-docs
npm run dev
```

Open:

```text
http://127.0.0.1:3000/integrations
```

## Project Structure

```text
mock/
  app/                  Next.js App Router routes
  components/           Shared header, footer, cards, docs shell, search, modals
  content/docs/         Mirrored public Moss Markdown docs
  content/docs-manifest.json
  lib/                  Integration data and docs helpers
  public/screenshots/   Verification screenshots
  scripts/fetch-docs.ts Public docs mirroring script
  PLAN.md
```

## Docs Mirroring

`npm run fetch-docs` fetches `https://docs.moss.dev/llms.txt`, parses every public `docs.moss.dev/docs/*.md` link, downloads each Markdown file, saves it under `content/docs/`, and regenerates `content/docs-manifest.json`.

The running website reads only local Markdown and JSON. It does not fetch Moss docs or Moss APIs at runtime.

Mirrored docs count in this build: **125 pages**.

## Local Routes

- `/integrations`
- `/integrations/langchain`
- `/integrations/dspy`
- `/integrations/vercel-ai-sdk`
- `/integrations/livekit`
- `/integrations/pipecat`
- `/integrations/vapi`
- `/integrations/elevenlabs`
- `/integrations/nextjs`
- `/integrations/vitepress`
- `/integrations/mcp-server`
- `/docs`
- `/docs/start/quickstart`
- `/docs/start/core-concepts`
- `/docs/build/live-call-context`
- `/docs/build/voice-agent-livekit`
- `/docs/integrations/livekit`
- `/docs/integrations/vapi`
- `/docs/integrations/mcp-server`
- `/docs/reference/js/api`
- `/docs/reference/python/api`
- `/login`
- `/dashboard`
- `/dashboard/analytics`
- `/dashboard/api-keys`
- `/dashboard/usage`
- `/dashboard/founding-agent/get-started`
- `/demo`

All mirrored docs listed in `content/docs-manifest.json` are available under `/docs/...`.

## Mocked UI

These actions open local demo modals instead of real services:

- Talk to us / Talk to an Engineer
- Start Building
- Ask Assistant
- Portal-style account actions

`Start Free` opens `/login`, where any email/password or the skip button leads to `/dashboard`. The local dashboard includes screenshot-modeled pages for indexes, analytics, API keys, usage/plans, and Founding Agent.

No credentials are collected. No production Moss APIs are called.

## Clickable Interactions

- Integration cards and related cards navigate locally.
- Integration pages include breadcrumbs, CTA buttons, benefits, quick-start code blocks, setup steps, FAQ accordions, related cards, and docs links.
- Docs sidebar, breadcrumbs, previous/next links, and Markdown links navigate locally when possible.
- Docs search opens from the button, `Cmd+K`, `Ctrl+K`, or a query URL such as `/docs?search=live-call%20context`.
- Search covers titles, descriptions, categories, and local Markdown content.
- Code blocks include copy buttons.
- Mobile header/sidebar controls are present for small screens.

## Demo Walkthroughs

Use `/demo` to start the three navigation scenarios:

- Voice Agent Integration: LiveKit quick start, related docs, live-call context search.
- VAPI Integration: webhook instructions and VAPI docs search.
- MCP Server: setup instructions and MCP-compatible AI client search.

## Verification

Validated with:

```bash
npm run fetch-docs
npm run build
```

Screenshots are saved in `public/screenshots/`:

- `integrations.png`
- `integration-livekit.png`
- `docs-home.png`
- `docs-search.png`
- `demo.png`

## Limitations

- This is a demo mock, not a pixel-perfect production clone.
- Documentation pages are mirrored from public Markdown; complex MDX widgets are simplified.
- Syntax highlighting is represented with polished code block styling and copy controls rather than a full highlighter.
- External account, calendar, portal, and assistant actions are intentionally mocked.
