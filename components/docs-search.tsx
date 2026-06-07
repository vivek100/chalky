"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { DocsManifestEntry } from "@/lib/docs";
import { docHref } from "@/lib/doc-routes";

export type SearchEntry = DocsManifestEntry & { content: string };

export function DocsSearch({ entries }: { entries: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("search");
    if (initial) {
      setQuery(initial);
      setOpen(true);
    }
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice(0, 8);
    return entries
      .map((entry) => {
        const haystack = `${entry.title} ${entry.description ?? ""} ${entry.category} ${entry.content}`.toLowerCase();
        const titleHit = entry.title.toLowerCase().includes(q) ? 3 : 0;
        const descHit = (entry.description ?? "").toLowerCase().includes(q) ? 2 : 0;
        const bodyHit = haystack.includes(q) ? 1 : 0;
        return { entry, score: titleHit + descHit + bodyHit };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((item) => item.entry);
  }, [entries, query]);

  useEffect(() => setActive(0), [query]);

  function keyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, results.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    }
    if (event.key === "Enter" && results[active]) {
      window.location.href = docHref(results[active].slug);
    }
  }

  return (
    <>
      <button className="focus-ring flex items-center gap-2 rounded-full border border-moss-line bg-white px-3 py-2 text-sm text-moss-muted hover:border-moss-ink" onClick={() => setOpen(true)}>
        <Search size={16} /> Search... <span className="text-xs">⌘K</span>
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-moss-ink/35 p-4 pt-20" role="dialog" aria-modal="true">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-moss-line bg-white shadow-card">
            <div className="flex items-center gap-3 border-b border-moss-line px-4">
              <Search className="text-moss-muted" size={18} />
              <input
                autoFocus
                className="h-14 flex-1 bg-transparent text-base outline-none"
                placeholder="Search Moss docs"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={keyDown}
              />
              <button className="focus-ring rounded-full p-2 text-moss-muted hover:bg-moss-soft" aria-label="Close search" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length ? (
                results.map((entry, index) => (
                  <Link
                    key={entry.slug}
                    href={docHref(entry.slug)}
                    className={`block rounded-xl p-4 ${index === active ? "bg-moss-soft" : "hover:bg-moss-soft"}`}
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium">{highlight(entry.title, query)}</h3>
                      <span className="shrink-0 rounded-full border border-moss-line px-2 py-0.5 text-xs text-moss-muted">{entry.category}</span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-moss-muted">{entry.description ?? entry.sourceUrl}</p>
                  </Link>
                ))
              ) : (
                <p className="p-6 text-sm text-moss-muted">No local docs matched that query.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const index = text.toLowerCase().indexOf(q.toLowerCase());
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-moss-leaf px-0.5">{text.slice(index, index + q.length)}</mark>
      {text.slice(index + q.length)}
    </>
  );
}
