"use client";

import { createContext, useContext, useState } from "react";
import { X } from "lucide-react";

type MockActionContextValue = {
  openMockAction: (title?: string) => void;
};

const MockActionContext = createContext<MockActionContextValue | null>(null);

export function useMockAction() {
  const value = useContext(MockActionContext);
  if (!value) throw new Error("useMockAction must be used within MockActionProvider");
  return value;
}

export function MockActionProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);

  return (
    <MockActionContext.Provider value={{ openMockAction: (nextTitle = "Moss portal") => setTitle(nextTitle) }}>
      {children}
      {title ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-moss-ink/35 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-moss-line bg-white p-6 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss-green">Demo environment</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-moss-ink">{title}</h2>
              </div>
              <button className="focus-ring rounded-full p-2 text-moss-muted hover:bg-moss-soft" onClick={() => setTitle(null)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-moss-muted">
              Demo environment: this action would normally open the Moss portal. In this local mock, no credentials are collected and no production Moss APIs are called.
            </p>
            <button className="focus-ring mt-6 w-full rounded-full bg-moss-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-black" onClick={() => setTitle(null)}>
              Continue demo
            </button>
          </div>
        </div>
      ) : null}
    </MockActionContext.Provider>
  );
}
