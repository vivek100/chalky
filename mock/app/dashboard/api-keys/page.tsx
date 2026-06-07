import { Copy, Eye, Folder, TriangleAlert } from "lucide-react";
import { PortalCard, PortalShell } from "@/components/portal/portal-shell";

export default function ApiKeysPage() {
  return (
    <PortalShell active="api-keys">
      <div className="px-12 py-4">
        <p className="text-2xl text-white/55">
          Credentials for <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-mono text-lg font-bold text-white">Default Project</span>
        </p>
        <PortalCard className="mt-9 p-9">
          <div className="flex items-center gap-4">
            <Folder size={32} />
            <div>
              <h1 className="text-3xl font-semibold">Project Credentials</h1>
              <p className="mt-3 text-2xl text-white/52">Use these to authenticate your API requests</p>
            </div>
          </div>
          <Field label="Project ID" value="ff4c1d82-0726-4f72-82ad-a7bf3e609f6e" />
          <div className="mt-9">
            <p className="mb-4 text-2xl font-semibold text-white/52">Project Key</p>
            <div className="flex items-center justify-between rounded-lg bg-white/[0.06] px-5 py-7 font-mono text-2xl font-bold">
              <span>................................</span>
              <span className="flex items-center gap-8">
                <Eye size={25} />
                <Copy size={25} />
              </span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-5 rounded-lg border-l-4 border-amber-500 bg-amber-500/8 px-6 py-5 text-2xl">
            <TriangleAlert size={24} className="text-amber-500" />
            <span className="font-bold">Keep these secure.</span>
            <span className="text-white/50">Never expose your Project Key in client-side code.</span>
          </div>
        </PortalCard>
        <PortalCard className="mt-9 p-9">
          <h2 className="text-3xl font-semibold">Environment Variables</h2>
          <div className="mt-8 flex items-center gap-4">
            <span className="text-xl text-white/45">.env</span>
            <button className="flex items-center gap-4 rounded-lg border border-white/12 px-7 py-4 text-xl font-semibold hover:border-white/28">
              <Copy size={24} /> Copy
            </button>
          </div>
          <pre className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-[#070807] p-6 font-mono text-lg text-white/72">
{`MOSS_PROJECT_ID=ff4c1d82-0726-4f72-82ad-a7bf3e609f6e
MOSS_PROJECT_KEY=mock_project_key_for_demo_only`}
          </pre>
        </PortalCard>
      </div>
    </PortalShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-10">
      <p className="mb-4 text-2xl font-semibold text-white/52">{label}</p>
      <div className="flex items-center justify-between rounded-lg bg-white/[0.06] px-5 py-7 font-mono text-2xl font-bold">
        <span>{value}</span>
        <Copy size={25} />
      </div>
    </div>
  );
}
