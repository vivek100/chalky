import Link from "next/link";
import { integrations } from "@/lib/integrations";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-moss-line bg-moss-soft">
      <div className="moss-container grid gap-10 py-12 md:grid-cols-[1.4fr_2fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-moss-ink text-sm font-bold text-white">M</span>
            <span className="font-semibold">Moss</span>
            <span className="rounded-full border border-moss-line bg-white px-2 py-0.5 text-xs text-moss-muted">Agent SDK Demo</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-moss-muted">Embeddable browser voice agent powered by Moss retrieval and page-aware actions.</p>
          <p className="mt-5 text-xs text-moss-muted">© 2026 InferEdge Inc. Public content attributed to Moss.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          <FooterGroup title="Quick Links" links={[["Home", "/"], ["Docs", "/docs"], ["Pricing", "/docs/pricing"], ["Demo", "/demo"], ["Integrations", "/integrations"]]} />
          <FooterGroup title="Integrations" links={integrations.slice(0, 6).map((item) => [item.shortTitle, `/integrations/${item.slug}`])} />
          <FooterGroup title="More" links={integrations.slice(6).map((item) => [item.shortTitle, `/integrations/${item.slug}`])} />
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-4 grid gap-3 text-sm text-moss-muted">
        {links.map(([label, href]) => (
          <Link className="hover:text-moss-ink" key={href} href={href}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
