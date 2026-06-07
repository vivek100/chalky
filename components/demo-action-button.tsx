"use client";

import { useDemoAction } from "./demo-action-provider";

export function DemoActionButton({
  children,
  title,
  variant = "dark",
  agentId
}: {
  children: React.ReactNode;
  title?: string;
  variant?: "dark" | "light";
  agentId?: string;
}) {
  const { openDemoAction } = useDemoAction();
  const classes =
    variant === "dark"
      ? "bg-moss-ink text-white hover:bg-black"
      : "border border-moss-line bg-white text-moss-ink hover:border-moss-ink";
  return (
    <button className={`focus-ring rounded-full px-4 py-2 text-sm font-medium transition ${classes}`} data-agent-id={agentId} onClick={() => openDemoAction(title)}>
      {children}
    </button>
  );
}
