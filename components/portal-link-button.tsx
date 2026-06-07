import Link from "next/link";

export function PortalLinkButton({
  children = "Start Free",
  href = "/login",
  variant = "dark",
  agentId
}: {
  children?: React.ReactNode;
  href?: string;
  variant?: "dark" | "light";
  agentId?: string;
}) {
  const classes =
    variant === "dark"
      ? "bg-moss-ink text-white hover:bg-black"
      : "border border-moss-line bg-white text-moss-ink hover:border-moss-ink";

  return (
    <Link className={`focus-ring inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${classes}`} data-agent-id={agentId} href={href}>
      {children}
    </Link>
  );
}
