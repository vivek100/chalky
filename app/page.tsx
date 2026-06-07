import Link from "next/link";
import { PortalLinkButton } from "@/components/portal-link-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const trustLogos = ["Microsoft", "EPAM", "UC Berkeley", "CMU", "Podium", "Stanford"];

const features = [
  {
    title: "Retrieve in <10 ms",
    description: "Load indexes in-browser or on-device and answer retrieval calls without network hops during live conversations."
  },
  {
    title: "Run search where your AI runs",
    description: "Browser, edge, or server — Moss keeps retrieval close to the agent runtime so voice and copilots stay responsive."
  },
  {
    title: "Ship real-time retrieval in minutes",
    description: "Create an index, load it locally, and query with a few lines of SDK code. No vector database to operate."
  }
];

const useCases = [
  {
    title: "Voice agents",
    description: "Ground LiveKit, VAPI, and Pipecat agents with sub-10ms context on every turn.",
    href: "/integrations/livekit",
    agentId: "home-usecase-voice-agents"
  },
  {
    title: "Docs search",
    description: "Mirror product docs and let users ask natural-language questions across your entire site.",
    href: "/docs",
    agentId: "home-usecase-docs-search"
  },
  {
    title: "In-app copilots",
    description: "Embed the Chalky SDK to guide users through dashboards, settings, and workflows.",
    href: "/demo",
    agentId: "home-usecase-in-app-copilot"
  }
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="moss-container pb-16 pt-20">
          <p className="text-sm font-medium text-moss-green">Real-time semantic search for Conversational AI</p>
          <div className="mt-5 max-w-4xl">
            <h1 className="text-5xl font-semibold tracking-tight text-moss-ink sm:text-6xl">Fix Latency in Voice AI</h1>
            <p className="mt-6 text-xl leading-9 text-moss-muted">
              Your voice AI breaks when retrieval is slow. Moss delivers sub-10ms semantic search where your agent runs — browser, device, or cloud — so
              conversations feel instant.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <PortalLinkButton agentId="home-hero-start-free">Start Free</PortalLinkButton>
            <Link
              className="focus-ring inline-flex items-center justify-center rounded-full border border-moss-line bg-white px-4 py-2 text-sm font-medium text-moss-ink transition hover:border-moss-ink"
              data-agent-id="home-hero-view-docs"
              href="/docs"
            >
              View Docs
            </Link>
            <Link
              className="focus-ring inline-flex items-center justify-center rounded-full border border-moss-line bg-white px-4 py-2 text-sm font-medium text-moss-ink transition hover:border-moss-ink"
              data-agent-id="home-hero-explore-integrations"
              href="/integrations"
            >
              Explore Integrations
            </Link>
            <Link
              className="focus-ring inline-flex items-center justify-center rounded-full bg-moss-leaf px-4 py-2 text-sm font-medium text-moss-ink transition hover:bg-[#d8f0dc]"
              data-agent-id="home-hero-latency-demo"
              href="/demo"
            >
              Run a Latency Demo
            </Link>
          </div>
          <p className="mt-8 text-sm text-moss-muted">Used by teams running voice AI, copilots, and real-time systems at scale.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {trustLogos.map((logo) => (
              <span className="rounded-full border border-moss-line bg-moss-soft px-3 py-1.5 text-xs font-medium text-moss-muted" key={logo}>
                {logo}
              </span>
            ))}
          </div>
        </section>

        <section className="border-y border-moss-line bg-moss-soft py-16">
          <div className="moss-container">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-moss-muted">Live latency demo</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-moss-ink">Your bottleneck is not your model. It is retrieval.</h2>
              <p className="mt-4 text-lg leading-8 text-moss-muted">
                Chalky embeds Moss retrieval directly in the browser, pairs it with a voice agent, and lets users navigate your product with natural language.
                Ask the floating agent to open docs, integrations, or dashboard pages.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <article className="rounded-[24px] border border-moss-line bg-white p-6 shadow-card" key={feature.title}>
                  <h3 className="text-lg font-semibold text-moss-ink">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-moss-muted">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="moss-container py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-moss-muted">Why Moss is fundamentally different</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-moss-ink">No external retrieval layer. No network hops.</h2>
            <p className="mt-4 text-lg leading-8 text-moss-muted">
              Connect your data once. Moss packages, distributes, and keeps indexes fresh while your agent validates selectors and acts safely on the current page.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <Link
                className="focus-ring rounded-[24px] border border-moss-line bg-white p-6 shadow-card transition hover:border-moss-green"
                data-agent-id={useCase.agentId}
                href={useCase.href}
                key={useCase.title}
              >
                <h3 className="text-lg font-semibold text-moss-ink">{useCase.title}</h3>
                <p className="mt-3 text-sm leading-7 text-moss-muted">{useCase.description}</p>
                <span className="mt-5 inline-flex text-sm font-medium text-moss-green">Learn more →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="moss-container pb-20">
          <div className="rounded-[28px] border border-moss-line bg-[linear-gradient(135deg,#f7f8f5_0%,#e8f6ea_100%)] px-8 py-10 sm:px-10">
            <h2 className="text-3xl font-semibold tracking-tight text-moss-ink">Built for real-time AI systems at scale</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-moss-muted">
              Start on the product homepage, browse integrations, read docs, or open the dashboard demo. The embedded agent follows you across every route.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PortalLinkButton agentId="home-cta-start-free">Start Free</PortalLinkButton>
              <Link
                className="focus-ring inline-flex items-center justify-center rounded-full border border-moss-line bg-white px-4 py-2 text-sm font-medium text-moss-ink transition hover:border-moss-ink"
                data-agent-id="home-cta-integrations"
                href="/integrations"
              >
                Works with Your Stack
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
