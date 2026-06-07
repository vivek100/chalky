"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#263126] bg-[#101510] text-[#eaf2e8]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{language}</span>
          <span className="hidden rounded-full bg-white/5 px-3 py-1 text-xs text-white/60 sm:inline">Quick start</span>
        </div>
        <button className="focus-ring inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15" onClick={copy}>
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="code-scroll overflow-x-auto p-5 text-sm leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
