# Moss Demo Mock Implementation Plan

## 1. Routes to Create

- `/` redirects to `/integrations`.
- `/integrations` lists all integration cards grouped by category.
- `/integrations/[slug]` covers LangChain, DSPy, Vercel AI SDK, LiveKit, Pipecat, VAPI, ElevenLabs, Next.js, VitePress, and MCP Server.
- `/docs` renders a local documentation homepage backed by the mirrored manifest.
- `/docs/[...slug]` renders every mirrored Markdown page from `content/docs`.
- `/demo` provides scenario cards for LiveKit, VAPI, and MCP Server walkthroughs.
- Mock action routes are handled with local modals instead of external services or production APIs.

## 2. Reusable Components

- `SiteHeader`: Moss-style global nav, mobile menu, Start Free mock action.
- `SiteFooter`: attribution, Demo Mock label, grouped Moss navigation.
- `IntegrationCard`: category, title, description, hover/focus state, local link.
- `IntegrationDetail`: breadcrumbs, hero copy, CTA buttons, benefits, quick-start tabs, setup steps, FAQ accordion, related cards.
- `CodeBlock`: syntax-like styling, language tabs, copy button.
- `MockActionModal`: polished local explanation for portal/account/backend actions.
- `DocsShell`: docs top nav, sidebar, breadcrumbs, table of contents, content area.
- `DocsSearch`: local Cmd/Ctrl+K modal over titles, descriptions, and mirrored Markdown.
- `AssistantButton`: mock assistant drawer/modal.
- `DemoScenarioCard`: links scenario starts to the relevant local pages.

## 3. Content Ingestion Approach

- Integration copy is modeled from publicly visible Moss integration pages and stored as local TypeScript data.
- Documentation content is fetched only by `npm run fetch-docs`.
- The script reads `https://docs.moss.dev/llms.txt`, parses public Markdown links, downloads those Markdown files, and stores them locally under `content/docs`.
- A generated `content/docs-manifest.json` stores title, slug, source URL, category, description, and local path.
- The running app imports local files/manifests only and makes no external network requests.

## 4. Docs Mirroring Approach

- Preserve public Moss attribution with source URLs in the manifest and page footer/meta.
- Convert `docs.moss.dev/docs/foo/bar.md` to local route `/docs/foo/bar`.
- Group sidebar sections by first path segment/category: Start, Build, Integrate, Integrations, Reference, API Reference, Voice Agents, Changelog, Pricing.
- Render Markdown with headings, lists, tables, links, and fenced code blocks.
- Keep original source links available as attribution, but internal docs links point to local routes when possible.

## 5. Interactions to Simulate

- Navbar links, footer links, breadcrumbs, cards, related links, and previous/next docs links navigate locally.
- Start Free, Talk to an Engineer, Portal, Request Demo, and Ask Assistant open local mock modals.
- FAQ sections expand/collapse.
- Code blocks copy to clipboard and show feedback.
- Code tabs switch language examples where available.
- Docs search opens via click, Cmd+K, or Ctrl+K; supports typing, keyboard navigation, and Enter to open.
- Mobile header and docs sidebar toggle.

## 6. Acceptance Checklist

- `mock` contains a clean Next.js + TypeScript + Tailwind app.
- `/integrations` visually resembles the public Moss integrations page.
- Every integration card opens a local detail page.
- Detail pages include breadcrumbs, CTA buttons, benefits, code, setup steps, FAQ, related cards, and footer.
- `npm run fetch-docs` mirrors the public docs index into local Markdown files and a manifest.
- `/docs` and mirrored docs pages render from local content.
- Docs search works without external services.
- All buttons either navigate locally, copy content, toggle UI, or open a mock modal.
- Mobile layouts are usable.
- `Demo Mock` is visible but unobtrusive.
- No production Moss APIs are called at runtime.
- README documents setup, routes, mirroring, mock behavior, and demo usage.
