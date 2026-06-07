import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DemoActionProvider } from "@/components/demo-action-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const scenarios = [
  {
    title: "Voice Agent Integration",
    href: "/integrations/livekit",
    goal: ["Open integrations", "Select LiveKit", "Inspect the quick-start section", "Open related documentation", "Search docs for live-call context"]
  },
  {
    title: "VAPI Integration",
    href: "/integrations/vapi",
    goal: ["Open integrations", "Select VAPI", "Inspect webhook instructions", "Search docs for VAPI"]
  },
  {
    title: "MCP Server",
    href: "/integrations/mcp-server",
    goal: ["Open integrations", "Select MCP Server", "Inspect setup instructions", "Search docs for MCP-compatible AI client"]
  }
];

export default function DemoPage() {
  return (
    <DemoActionProvider>
      <SiteHeader />
      <main className="moss-container py-16">
        <p className="text-sm font-medium text-moss-muted">Demo walkthrough</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight">Agent navigation scenarios</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-moss-muted">Use these paths to test whether the browser agent can click, browse, search, and explain the Moss demo during a live walkthrough.</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {scenarios.map((scenario) => (
            <article className="rounded-2xl border border-moss-line bg-white p-6 shadow-sm" key={scenario.title}>
              <h2 className="text-2xl font-semibold tracking-tight">{scenario.title}</h2>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-moss-muted">
                {scenario.goal.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-2 size-1.5 rounded-full bg-moss-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-moss-ink px-4 py-2 text-sm font-medium text-white hover:bg-black" href={scenario.href}>
                Start Walkthrough <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </DemoActionProvider>
  );
}
