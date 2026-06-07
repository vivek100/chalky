import { PortalShell } from "@/components/portal/portal-shell";

export default function FoundingAgentPage() {
  return (
    <PortalShell active="founding-agent">
      <div className="px-12 py-14">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Founding Agent</h1>
        <p className="mt-5 text-2xl text-white/55">The voice agent that qualified 1000+ of our own leads.</p>
        <section className="mt-10 grid gap-10 rounded-3xl border border-emerald-400/15 bg-[radial-gradient(circle_at_80%_0%,rgba(29,185,110,.28),transparent_32%),#07100b] p-14 xl:grid-cols-[1.1fr_.9fr]">
          <div>
            <span className="rounded-full border border-white/12 px-5 py-3 text-sm font-bold tracking-[0.25em] text-white/45">WHY WE BUILT IT</span>
            <p className="mt-10 max-w-2xl text-3xl leading-[1.55] text-white/58">
              We built Founding Agent for ourselves. Visitors hit our site, pressed a button, and started asking real questions about Moss instead of filling out a form.
            </p>
            <p className="mt-9 max-w-2xl text-3xl font-semibold leading-[1.55]">Demo calls got shorter. Intent got higher. Pipeline got better.</p>
            <p className="mt-9 inline-flex rounded-lg bg-emerald-500/14 px-5 py-3 text-2xl font-bold italic">It worked so well we&apos;re shipping it.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#080908] p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <span className="flex items-center gap-3 text-sm font-bold tracking-[0.16em] text-white/45">
                <span className="size-3 rounded-full bg-[#43d18b]" /> LIVE · MOSS FOUNDING AGENT
              </span>
              <span className="text-[#43d18b]">||||||</span>
            </div>
            <Chat role="VISITOR" text="What does Moss actually do?" />
            <Chat agent role="AGENT" text="Real-time semantic search for AI agents. Sub-10ms lookups, runs in the browser or on-device, no infra to set up." />
            <Chat role="VISITOR" text="How is Moss different from traditional vector DBs?" />
            <Chat agent role="AGENT" text="Traditional vector DBs typically take 100-500ms per lookup. Moss is consistently under 10ms p95, built in Rust + WebAssembly." />
          </div>
        </section>
        <h2 className="mt-12 font-serif text-4xl font-semibold">The founder ROI</h2>
      </div>
    </PortalShell>
  );
}

function Chat({ role, text, agent = false }: { role: string; text: string; agent?: boolean }) {
  return (
    <div className={`mt-5 rounded-3xl px-6 py-5 text-xl font-semibold leading-8 ${agent ? "mr-14 bg-emerald-500/12 text-white" : "ml-20 bg-white/8 text-white/75"}`}>
      <span className={agent ? "mr-3 text-emerald-400" : "mr-3 text-white/35"}>{role}</span>
      {text}
    </div>
  );
}
