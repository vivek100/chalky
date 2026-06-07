import Link from "next/link";
import { Info, Plus, Trash2 } from "lucide-react";
import { PortalCard, PortalShell } from "@/components/portal/portal-shell";

export default function DashboardPage() {
  return (
    <PortalShell active="dashboard">
      <div className="px-12 py-14">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-3 text-2xl text-white/55">
          Manage your indexes for <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-mono text-lg font-bold text-white">Default Project</span>
        </p>
        <PortalCard className="mt-9 border-dashed p-9">
          <div className="flex items-center justify-between gap-5">
            <div className="flex flex-wrap items-center gap-8 text-2xl font-semibold">
              <span>Default Project</span>
              <span className="text-white/20">.</span>
              <span className="text-white/48">Developer</span>
              <span className="text-white/20">.</span>
              <span className="text-white/48">1 / 3 indexes</span>
            </div>
            <button className="flex items-center gap-3 text-xl font-semibold text-white/55 hover:text-white">
              <Trash2 size={22} /> Delete
            </button>
          </div>
        </PortalCard>
        <PortalCard className="mt-9 p-9">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-semibold">Search Indexes</h2>
                <span className="rounded-lg bg-white/10 px-4 py-1 text-lg font-bold text-white/65">1 / 3 indexes used</span>
              </div>
              <p className="mt-3 text-2xl text-white/52">Manage search indexes for Default Project</p>
              <p className="mt-8 flex items-center gap-3 text-lg text-white/45">
                <Info size={22} /> Model guidance included in dialog.
              </p>
            </div>
            <button className="flex h-14 items-center gap-5 rounded-xl bg-[#43d18b] px-8 text-2xl font-semibold text-black hover:bg-[#55e09a]">
              <Plus size={25} /> Create Index
            </button>
          </div>
          <div className="mt-10 overflow-hidden rounded-xl border border-white/10">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-[#0b0c0b] px-6 py-5 text-lg font-bold tracking-[0.1em] text-white/48">
              <span>NAME</span>
              <span>DOCUMENTS</span>
              <span>UPDATED</span>
            </div>
            <Link className="grid grid-cols-[1.4fr_1fr_1fr] px-6 py-7 text-2xl font-semibold hover:bg-white/[0.03]" href="/docs/integrate/indexing-data">
              <span className="text-[#3bd889]">demo-customer_faqs</span>
              <span className="text-white/55">55</span>
              <span className="text-white/55">6/6/2026</span>
            </Link>
          </div>
        </PortalCard>
      </div>
    </PortalShell>
  );
}
