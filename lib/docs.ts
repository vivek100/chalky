import fs from "node:fs";
import path from "node:path";

export type DocsManifestEntry = {
  title: string;
  slug: string;
  sourceUrl: string;
  category: string;
  description?: string;
  localPath: string;
};

const contentRoot = path.join(process.cwd(), "content");
const manifestPath = path.join(contentRoot, "docs-manifest.json");

const fallbackDocs: DocsManifestEntry[] = [
  {
    title: "Docs",
    slug: "index",
    sourceUrl: "https://docs.moss.dev/docs/index.md",
    category: "Home",
    description: "Local placeholder shown before running npm run fetch-docs.",
    localPath: "content/docs/index.md"
  }
];

export function getDocsManifest(): DocsManifestEntry[] {
  if (!fs.existsSync(manifestPath)) return fallbackDocs;
  return JSON.parse(fs.readFileSync(manifestPath, "utf8")) as DocsManifestEntry[];
}

export function getDocBySlug(slugParts?: string[]) {
  const slug = slugParts?.length ? slugParts.join("/") : "index";
  const manifest = getDocsManifest();
  const entry = manifest.find((item) => item.slug === slug) ?? manifest.find((item) => item.slug === "index") ?? manifest[0];
  const absolutePath = path.join(process.cwd(), entry.localPath);
  const content = fs.existsSync(absolutePath)
    ? fs.readFileSync(absolutePath, "utf8")
    : `# ${entry.title}\n\nRun \`npm run fetch-docs\` to mirror public Moss documentation locally.`;
  return { entry, content, manifest };
}

export function groupedDocs(entries: DocsManifestEntry[]) {
  return entries.reduce<Record<string, DocsManifestEntry[]>>((acc, entry) => {
    acc[entry.category] ??= [];
    acc[entry.category].push(entry);
    return acc;
  }, {});
}

export function getPrevNext(entries: DocsManifestEntry[], slug: string) {
  const index = entries.findIndex((entry) => entry.slug === slug);
  return {
    prev: index > 0 ? entries[index - 1] : undefined,
    next: index >= 0 && index < entries.length - 1 ? entries[index + 1] : undefined
  };
}

export function getSearchEntries() {
  return getDocsManifest().map((entry) => {
    const absolutePath = path.join(process.cwd(), entry.localPath);
    return {
      ...entry,
      content: fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, "utf8").slice(0, 30000) : ""
    };
  });
}
