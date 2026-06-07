"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export function AssistantButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="focus-ring inline-flex items-center gap-2 rounded-full border border-moss-line bg-white px-3 py-2 text-sm font-medium hover:border-moss-ink" onClick={() => setOpen(true)}>
        <MessageCircle size={16} /> Ask Assistant
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-moss-ink/25 p-4 sm:p-6" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-moss-line bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss-green">Assistant</p>
                <h2 className="mt-1 text-xl font-semibold">Moss docs helper</h2>
              </div>
              <button className="focus-ring rounded-full p-2 text-moss-muted hover:bg-moss-soft" aria-label="Close assistant" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 rounded-xl bg-moss-soft p-4 text-sm leading-6 text-moss-muted">
              Responses are generated using AI and may contain mistakes. In this demo, use search to navigate mirrored docs.
            </div>
            <button className="focus-ring mt-4 w-full rounded-full bg-moss-ink px-4 py-2.5 text-sm font-medium text-white" onClick={() => setOpen(false)}>
              Got it
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
