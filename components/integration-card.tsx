import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Integration } from "@/lib/integrations";

export function IntegrationCard({ item, compact = false }: { item: Integration; compact?: boolean }) {
  return (
    <Link
      href={`/integrations/${item.slug}`}
      className="focus-ring group flex min-h-[178px] flex-col rounded-[14px] border border-moss-line bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-moss-ink hover:shadow-card"
      data-agent-id={`integration-card-${item.slug}`}
    >
      <span className="text-xs font-medium text-moss-muted">{item.category}</span>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-moss-ink">{compact ? item.shortTitle : item.shortTitle}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-moss-muted">{item.description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-moss-ink">
        View integration <ArrowRight className="transition group-hover:translate-x-1" size={16} />
      </span>
    </Link>
  );
}
