"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { PortalLinkButton } from "./portal-link-button";

const nav = [
  { href: "/integrations", label: "Integrations" },
  { href: "/docs", label: "Docs" },
  { href: "/demo", label: "Demo" },
  { href: "/docs/pricing", label: "Pricing" },
  { href: "/docs/changelog", label: "Blog" }
];

export function SiteHeader({ onSearch }: { onSearch?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-moss-line bg-white/95 backdrop-blur">
      <div className="moss-container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-2 rounded-md" data-agent-id="site-logo-link">
          <span className="grid size-7 place-items-center rounded-lg bg-moss-ink text-sm font-bold text-white">M</span>
          <span className="text-base font-semibold tracking-tight">Moss</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-moss-muted md:flex">
          {nav.map((item) => (
            <Link className="focus-ring rounded-md hover:text-moss-ink" data-agent-id={`nav-${item.label.toLowerCase()}`} key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {onSearch ? (
            <button className="focus-ring flex items-center gap-2 rounded-full border border-moss-line px-3 py-2 text-sm text-moss-muted hover:border-moss-ink" onClick={onSearch}>
              <Search size={16} /> Search <span className="text-xs">⌘K</span>
            </button>
          ) : null}
          <PortalLinkButton agentId="nav-start-free">Start Free</PortalLinkButton>
        </div>
        <button className="focus-ring rounded-md p-2 md:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
          <Menu size={21} />
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-white p-5 md:hidden">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Moss</span>
            <button className="focus-ring rounded-md p-2" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X size={21} />
            </button>
          </div>
          <nav className="mt-8 grid gap-2 text-lg">
            {nav.map((item) => (
              <Link className="rounded-xl px-3 py-3 hover:bg-moss-soft" data-agent-id={`mobile-nav-${item.label.toLowerCase()}`} key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6">
            <PortalLinkButton agentId="mobile-nav-start-free">Start Free</PortalLinkButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
