import { ArrowRight, Box, CreditCard, FileText, Settings } from "lucide-react";
import { PortalCard, PortalShell } from "@/components/portal/portal-shell";

export default function UsagePage() {
  return (
    <PortalShell active="usage" projectSelector={false}>
      <div className="px-12 py-4">
        <p className="text-2xl text-white/55">Monitor your usage and manage your subscription</p>
        <PortalCard className="mt-10 p-9">
          <div className="flex items-center gap-4 text-2xl font-semibold">
            <CreditCard size={30} /> Current Plan
          </div>
          <div className="mt-10 flex items-center justify-between border-b border-white/10 pb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold">Developer</h1>
              <span className="rounded-lg bg-[#43d18b] px-4 py-2 text-lg font-semibold text-black">active</span>
            </div>
            <button className="flex h-14 items-center gap-4 rounded-xl border border-white/12 px-7 text-xl font-semibold hover:border-white/28">
              <Settings size={24} /> Change Plan
            </button>
          </div>
          <div className="mt-7 flex items-center justify-between text-2xl font-semibold text-white/50">
            <span>Pricing & Features</span>
            <button className="flex items-center gap-3 hover:text-white">
              View Feature Comparison <ArrowRight size={24} />
            </button>
          </div>
        </PortalCard>
        <PortalCard className="mt-9 p-9">
          <div className="flex items-center gap-4 text-2xl font-semibold">
            <Box size={30} /> Limits
          </div>
          <div className="mt-9 grid gap-6 xl:grid-cols-3">
            {[
              ["Projects", "1"],
              ["Indexes per Project", "3"],
              ["Items per Index", "1000"]
            ].map(([label, value]) => (
              <div className="rounded-xl border border-white/10 bg-[#090a09] p-7" key={label}>
                <p className="text-2xl font-semibold text-white/50">{label}</p>
                <p className="mt-6 font-mono text-4xl font-black">{value}</p>
              </div>
            ))}
          </div>
        </PortalCard>
        <PortalCard className="mt-9 flex items-center justify-between p-8">
          <div className="flex items-center gap-6">
            <FileText size={32} className="text-white/55" />
            <div>
              <h2 className="text-2xl font-semibold">Invoice & Cost Breakdown</h2>
              <p className="mt-1 text-xl text-white/50">View detailed breakdown of your current billing period</p>
            </div>
          </div>
          <button className="rounded-xl bg-[#43d18b] px-7 py-4 text-2xl font-semibold text-black hover:bg-[#55e09a]">
            View Invoice <ArrowRight className="inline" size={24} />
          </button>
        </PortalCard>
      </div>
    </PortalShell>
  );
}
