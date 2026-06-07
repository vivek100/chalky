import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  ChevronDown,
  CreditCard,
  Folder,
  Grid2X2,
  KeyRound,
  Lock,
  MessageCircle,
  Moon,
  User,
  Users,
  type LucideIcon
} from "lucide-react";

type PortalNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  locked?: boolean;
};

type PortalShellProps = {
  active: "dashboard" | "team" | "analytics" | "founding-agent" | "api-keys" | "usage";
  children: React.ReactNode;
  projectSelector?: boolean;
};

const navGroups: Array<{ title: string; items: PortalNavItem[] }> = [
  {
    title: "GENERAL",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: Grid2X2 },
      { id: "team", label: "Team", href: "/dashboard/team", icon: Users, locked: true },
      { id: "analytics", label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 }
    ]
  },
  {
    title: "PRODUCTS",
    items: [{ id: "founding-agent", label: "Founding Agent", href: "/dashboard/founding-agent/get-started", icon: Bot }]
  },
  {
    title: "SETTINGS",
    items: [
      { id: "api-keys", label: "API Keys", href: "/dashboard/api-keys", icon: KeyRound },
      { id: "usage", label: "Usage and Plans", href: "/dashboard/usage", icon: CreditCard }
    ]
  },
  {
    title: "SUPPORT",
    items: [
      { id: "docs", label: "Docs", href: "/docs", icon: BookOpen },
      { id: "discord", label: "Discord", href: "/demo", icon: MessageCircle }
    ]
  }
];

export function PortalShell({ active, children, projectSelector = true }: PortalShellProps) {
  return (
    <main className="min-h-screen bg-[#050605] text-[#f3f3f1]">
      <div className="grid min-h-screen lg:grid-cols-[344px_1fr]">
        <aside className="border-r border-white/10 bg-[#070807]">
          <div className="flex h-[88px] items-center px-5">
            <Link className="flex items-center gap-3 text-3xl font-semibold tracking-tight" href="/dashboard">
              <span className="grid size-8 place-items-center bg-white text-xl font-black text-black">▰</span>
              Moss
            </Link>
          </div>
          <div className="px-3">
            <button className="flex h-[62px] w-full items-center justify-between rounded-xl border border-white/10 bg-[#101111] px-4 text-left">
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Building2 size={20} />
                </span>
                <span className="truncate text-lg font-semibold">ali.amjad52114&apos;s wor...</span>
              </span>
              <ChevronDown size={16} className="text-white/35" />
            </button>
          </div>
          <nav className="mt-8 px-1 pb-8">
            {navGroups.map((group) => (
              <div className="mb-9" key={group.title}>
                <h2 className="mb-4 px-5 text-sm font-bold tracking-[0.18em] text-white/42">{group.title}</h2>
                <div className="grid gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const selected = item.id === active;
                    const content = (
                      <span
                        className={`relative flex min-h-[58px] items-center gap-4 rounded-lg px-5 text-[20px] font-semibold transition ${
                          selected ? "border border-white bg-[#0d0e0d] text-white shadow-[inset_3px_0_0_#3dd58a]" : "text-white/52 hover:bg-white/[0.04] hover:text-white/80"
                        }`}
                      >
                        <Icon size={22} />
                        <span className="flex-1">{item.label}</span>
                        {item.locked ? <Lock size={17} className="text-white/25" /> : null}
                      </span>
                    );
                    return item.locked ? (
                      <div key={item.id}>{content}</div>
                    ) : (
                      <Link href={item.href} key={item.id}>
                        {content}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>
        <section className="min-w-0 bg-[#050605]">
          <header className="flex h-[88px] items-center justify-end gap-7 border-b border-white/10 px-8">
            {projectSelector ? (
              <button className="hidden h-14 min-w-[270px] items-center justify-between rounded-xl border border-white/12 bg-[#080908] px-5 text-xl font-semibold lg:flex">
                <span className="flex items-center gap-3">
                  <Folder size={24} />
                  Default Pro...
                </span>
                <ChevronDown size={18} className="text-white/55" />
              </button>
            ) : null}
            <button className="grid size-10 place-items-center rounded-full text-white/55 hover:bg-white/5">
              <Moon size={23} />
            </button>
            <span className="hidden text-xl font-semibold text-white/50 sm:inline">Hey, ALI!</span>
            <button className="grid size-12 place-items-center rounded-full border border-white/10 hover:border-white/30">
              <User size={23} />
            </button>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}

export function PortalCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-white/10 bg-[#111211] ${className}`}>{children}</section>;
}
