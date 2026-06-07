import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/code-block";
import { DocsShell } from "@/components/docs-shell";
import { getDocBySlug, getDocsManifest, getPrevNext, getSearchEntries } from "@/lib/docs";
import { docHref } from "@/lib/doc-routes";

export function generateStaticParams() {
  return getDocsManifest().map((entry) => ({ slug: entry.slug === "index" ? undefined : entry.slug.split("/") }));
}

export default async function DocsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const { entry, content, manifest } = getDocBySlug(slug);
  const { prev, next } = getPrevNext(manifest, entry.slug);
  const searchEntries = getSearchEntries();
  const crumbs = entry.slug === "index" ? ["docs"] : ["docs", ...entry.slug.split("/")];

  return (
    <DocsShell manifest={manifest} activeSlug={entry.slug} searchEntries={searchEntries}>
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-moss-muted">
        {crumbs.map((crumb, index) => (
          <span className="flex items-center gap-2" key={`${crumb}-${index}`}>
            {index > 0 ? <span>/</span> : null}
            <span>{crumb}</span>
          </span>
        ))}
      </nav>
      <article className="prose prose-neutral max-w-none prose-headings:tracking-tight prose-a:text-moss-green">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">{children}</h1>,
            a: ({ href, children }) => {
              const localHref = localizeHref(href);
              return <Link href={localHref}>{children}</Link>;
            },
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className ?? "");
              const code = String(children).replace(/\n$/, "");
              if (match) return <CodeBlock code={code} language={match[1]} />;
              return <code {...props}>{children}</code>;
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
      <div className="mt-12 grid gap-4 border-t border-moss-line pt-8 sm:grid-cols-2">
        {prev ? (
          <Link className="rounded-2xl border border-moss-line p-5 hover:border-moss-ink" href={docHref(prev.slug)}>
            <span className="text-xs text-moss-muted">Previous</span>
            <p className="mt-2 font-medium">{prev.title}</p>
          </Link>
        ) : <div />}
        {next ? (
          <Link className="rounded-2xl border border-moss-line p-5 text-right hover:border-moss-ink" href={docHref(next.slug)}>
            <span className="text-xs text-moss-muted">Next</span>
            <p className="mt-2 font-medium">{next.title}</p>
          </Link>
        ) : null}
      </div>
      <p className="mt-8 text-xs leading-5 text-moss-muted">
        Source attribution: <a className="underline" href={entry.sourceUrl}>{entry.sourceUrl}</a>. This prototype renders mirrored public documentation.
      </p>
    </DocsShell>
  );
}

function localizeHref(href?: string) {
  if (!href) return "#";
  if (href.startsWith("https://docs.moss.dev/docs/")) {
    return href.replace("https://docs.moss.dev/docs/", "/docs/").replace(/\.md($|#)/, "$1");
  }
  if (href.endsWith(".md")) return `/docs/${href.replace(/^\.\//, "").replace(/\.md$/, "")}`;
  if (href.startsWith("/docs/")) return href.replace(/\.md($|#)/, "$1");
  if (href.startsWith("http")) return "#";
  return href;
}
