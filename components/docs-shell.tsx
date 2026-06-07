import Link from "next/link";
import { Menu } from "lucide-react";
import { AssistantButton } from "./assistant-button";
import { DocsSearch, type SearchEntry } from "./docs-search";
import { groupedDocs, type DocsManifestEntry } from "@/lib/docs";
import { docHref } from "@/lib/doc-routes";

export function DocsShell({
  children,
  manifest,
  activeSlug,
  searchEntries
}: {
  children: React.ReactNode;
  manifest: DocsManifestEntry[];
  activeSlug: string;
  searchEntries: SearchEntry[];
}) {
  const groups = groupedDocs(manifest);
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 border-b border-moss-line bg-white/95 backdrop-blur">
        <div className="moss-container flex h-16 items-center justify-between gap-4">
          <Link href="/docs" className="flex items-center gap-2 font-semibold">
            <span className="grid size-7 place-items-center rounded-lg bg-moss-ink text-sm font-bold text-white">M</span>
            Moss Docs
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <DocsSearch entries={searchEntries} />
            <AssistantButton />
            <Link className="text-sm text-moss-muted hover:text-moss-ink" href="/">Website</Link>
          </div>
          <label className="focus-ring cursor-pointer rounded-md p-2 md:hidden" htmlFor="docs-nav-toggle" aria-label="Toggle docs navigation">
            <Menu size={21} />
          </label>
        </div>
      </div>
      <input id="docs-nav-toggle" className="peer hidden" type="checkbox" />
      <div className="moss-container grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)_190px]">
        <aside className="fixed inset-x-0 top-16 z-30 hidden max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-moss-line bg-white p-5 peer-checked:block lg:sticky lg:top-20 lg:z-auto lg:block lg:border-b-0 lg:p-0">
          <div className="mb-5 flex gap-2 md:hidden">
            <DocsSearch entries={searchEntries} />
          </div>
          <nav className="py-6 text-sm">
            {Object.entries(groups).map(([category, entries]) => (
              <div className="mb-7" key={category}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-moss-muted">{category}</h3>
                <div className="grid gap-1">
                  {entries.map((entry) => (
                    <Link
                      className={`rounded-lg px-3 py-2 leading-5 hover:bg-moss-soft ${entry.slug === activeSlug ? "bg-moss-soft font-medium text-moss-ink" : "text-moss-muted"}`}
                      key={entry.slug}
                      href={docHref(entry.slug)}
                    >
                      {entry.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 py-10 lg:py-12">{children}</main>
        <aside className="hidden py-12 text-sm text-moss-muted lg:block">
          <div className="sticky top-24">
            <p className="font-medium text-moss-ink">On this page</p>
            <p className="mt-3 leading-6">Use local search, sidebar links, and previous/next navigation to move through mirrored Moss docs.</p>
            <span className="mt-5 inline-flex rounded-full border border-moss-line px-3 py-1 text-xs">Agent SDK Demo</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
