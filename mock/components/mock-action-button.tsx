"use client";

import { useMockAction } from "./mock-action-provider";

export function MockActionButton({ children, title, variant = "dark" }: { children: React.ReactNode; title?: string; variant?: "dark" | "light" }) {
  const { openMockAction } = useMockAction();
  const classes =
    variant === "dark"
      ? "bg-moss-ink text-white hover:bg-black"
      : "border border-moss-line bg-white text-moss-ink hover:border-moss-ink";
  return (
    <button className={`focus-ring rounded-full px-4 py-2 text-sm font-medium transition ${classes}`} onClick={() => openMockAction(title)}>
      {children}
    </button>
  );
}
