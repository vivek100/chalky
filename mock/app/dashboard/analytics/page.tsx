import { BarChart3, HardDrive, Zap, type LucideIcon } from "lucide-react";
import { PortalCard, PortalShell } from "@/components/portal/portal-shell";

const metrics: Array<[string, string, string, LucideIcon]> = [
  ["PROJECTS", "1", "Active projects", BarChart3],
  ["CONTROL OPS", "1", "This billing period", Zap],
  ["STORAGE USED", "103.6 KB", "Total index storage", HardDrive],
  ["LOCAL QUERIES", "0", "This billing period", Zap]
];

export default function AnalyticsPage() {
  return (
    <PortalShell active="analytics">
      <div className="px-12 py-14">
        <div className="flex gap-10 border-b border-white/10 text-2xl font-semibold">
          <span className="border-b-2 border-[#43d18b] pb-5 text-white">Overview</span>
          <span className="pb-5 text-white/45">Resource Usage</span>
        </div>
        <div className="mt-9 grid gap-5 xl:grid-cols-4">
          {metrics.map(([label, value, caption, Icon]) => (
            <PortalCard className="p-8" key={label as string}>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold tracking-[0.15em] text-white/55">{label}</p>
                <Icon size={22} className="text-white/32" />
              </div>
              <p className="mt-8 font-mono text-5xl font-black">{value}</p>
              <p className="mt-4 text-xl text-white/55">{caption}</p>
            </PortalCard>
          ))}
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <ChartCard title="Control Ops Volume (30d)" dotLabel="VOLUME" />
          <ChartCard title="Index Operations (30d)" bar />
        </div>
      </div>
    </PortalShell>
  );
}

function ChartCard({ title, dotLabel, bar }: { title: string; dotLabel?: string; bar?: boolean }) {
  return (
    <PortalCard className="min-h-[430px] p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="mt-3 text-xl text-white/45">30-day trend</p>
        </div>
        {dotLabel ? <span className="flex items-center gap-3 text-sm text-white/45"><span className="size-3 rounded-full bg-[#43d18b]" /> {dotLabel}</span> : null}
      </div>
      <div className="relative mt-8 h-72 border-l border-b border-white/25">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:25%_25%]" />
        {bar ? <div className="absolute bottom-0 left-[10%] h-[26%] w-[75%] rounded-t bg-[#27c763]" /> : <span className="absolute right-[42%] top-[6%] size-3 rounded-full border-4 border-[#43d18b]" />}
        <span className="absolute -bottom-8 left-1/2 text-white/35">2026-06-06</span>
      </div>
      {bar ? <p className="mt-12 flex items-center gap-3 text-lg text-white/55"><span className="size-3 rounded-full bg-[#27c763]" /> created</p> : null}
    </PortalCard>
  );
}
