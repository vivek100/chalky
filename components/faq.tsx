"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FAQ({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-moss-line rounded-2xl border border-moss-line bg-white">
      {items.map((item, index) => (
        <div key={item.question}>
          <button className="focus-ring flex w-full items-center justify-between gap-4 p-5 text-left font-medium" onClick={() => setOpen(open === index ? -1 : index)}>
            {item.question}
            <ChevronDown className={`shrink-0 transition ${open === index ? "rotate-180" : ""}`} size={18} />
          </button>
          {open === index ? <p className="px-5 pb-5 text-sm leading-6 text-moss-muted">{item.answer}</p> : null}
        </div>
      ))}
    </div>
  );
}
