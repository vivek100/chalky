import fs from "node:fs/promises";
import path from "node:path";

type ManifestEntry = {
  title: string;
  slug: string;
  sourceUrl: string;
  category: string;
  description?: string;
  localPath: string;
};

const root = process.cwd();
const docsDir = path.join(root, "content", "docs");
const manifestPath = path.join(root, "content", "docs-manifest.json");
const llmsUrl = "https://docs.moss.dev/llms.txt";

async function main() {
  await fs.mkdir(docsDir, { recursive: true });
  const llms = await fetchText(llmsUrl);
  const entries = parseLlms(llms);
  const manifest: ManifestEntry[] = [];

  for (const entry of entries) {
    const markdown = await fetchText(entry.sourceUrl);
    const localFile = path.join(docsDir, `${entry.slug}.md`);
    await fs.mkdir(path.dirname(localFile), { recursive: true });
    await fs.writeFile(localFile, normalizeMarkdown(markdown, entry.sourceUrl), "utf8");
    manifest.push({ ...entry, localPath: path.relative(root, localFile).replaceAll("\\", "/") });
    console.log(`mirrored ${entry.slug}`);
  }

  manifest.sort((a, b) => routeWeight(a.slug) - routeWeight(b.slug) || a.slug.localeCompare(b.slug));
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`\nMirrored ${manifest.length} Moss docs pages to content/docs`);
}

function parseLlms(text: string): Omit<ManifestEntry, "localPath">[] {
  const seen = new Map<string, Omit<ManifestEntry, "localPath">>();
  const flattened = text.replace(/\s+/g, " ");
  const linkPattern = /- \[([^\]]+)\]\((https:\/\/docs\.moss\.dev\/docs\/[^)]+?\.md)\)(?::\s*(.*?))?(?=\s+- \[|$)/g;
  for (const match of flattened.matchAll(linkPattern)) {
    const title = clean(match[1]);
    const sourceUrl = match[2];
    const description = clean(match[3] ?? "");
    const slug = new URL(sourceUrl).pathname.replace(/^\/docs\//, "").replace(/\.md$/, "");
    if (!seen.has(slug)) {
      seen.set(slug, {
        title,
        slug,
        sourceUrl,
        category: categoryForSlug(slug),
        description: description || undefined
      });
    }
  }
  return [...seen.values()];
}

function categoryForSlug(slug: string) {
  if (slug === "index") return "Home";
  if (slug.startsWith("start/")) return "Start";
  if (slug.startsWith("build/")) return "Build";
  if (slug.startsWith("integrate/")) return "Integrate";
  if (slug.startsWith("integrations/")) return "Integrations";
  if (slug.startsWith("reference/js")) return "Reference: JavaScript";
  if (slug.startsWith("reference/python")) return "Reference: Python";
  if (slug.startsWith("reference/browser")) return "Reference: Browser";
  if (slug.startsWith("reference/c")) return "Reference: C";
  if (slug.startsWith("reference/elixir")) return "Reference: Elixir";
  if (slug.startsWith("reference/swift")) return "Reference: Swift";
  if (slug.startsWith("reference/")) return "Reference";
  if (slug.startsWith("api-reference/")) return "API Reference";
  if (slug.startsWith("voice-agents/")) return "Voice Agents";
  return "Other";
}

function routeWeight(slug: string) {
  const order = ["index", "start/", "build/", "integrate/", "integrations/", "reference/", "api-reference/", "voice-agents/", "changelog", "pricing"];
  const index = order.findIndex((prefix) => slug === prefix || slug.startsWith(prefix));
  return index === -1 ? 99 : index;
}

function normalizeMarkdown(markdown: string, sourceUrl: string) {
  if (sourceUrl.endsWith("/docs/index.md")) {
    return `# Real-time retrieval for conversational AI

Sub-10 ms retrieval for voice agents, copilots, and multimodal apps.

## Explore Moss

- [Quickstart](/docs/start/quickstart): Install the Python or TypeScript SDK and run your first semantic search.
- [Core Concepts](/docs/start/core-concepts): Learn how indexes, hybrid search, and real-time updates work.
- [Live-Call Context](/docs/build/live-call-context): Query a persistent cloud index and a live session together during a conversation.
- [Voice Agent (LiveKit)](/docs/build/voice-agent-livekit): Ground a LiveKit voice agent in your Moss index.
- [MCP Server](/docs/integrations/mcp-server): Connect Moss to MCP-compatible AI clients.
- [JavaScript API](/docs/reference/js/api): Browse the JavaScript SDK reference.
- [Python API](/docs/reference/python/api): Browse the Python SDK reference.

## Quick example

\`\`\`ts
import { MossClient } from "@moss-dev/moss-node";

const client = new MossClient({ projectId: "demo", apiKey: "demo" });
const results = await client.query("docs", "voice agent context", { topK: 5 });
\`\`\`

---

_Source: ${sourceUrl}_
`;
  }
  return `${markdown.trim()}\n\n---\n\n_Source: ${sourceUrl}_\n`;
}

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

async function fetchText(url: string) {
  const response = await fetch(url, { headers: { "user-agent": "Moss demo mock docs mirror" } });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.text();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
