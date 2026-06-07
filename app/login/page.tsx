"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-screen bg-moss-soft md:grid-cols-[1fr_520px]">
      <section className="hidden flex-col justify-between bg-moss-ink p-10 text-white md:flex">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-white text-sm font-bold text-moss-ink">M</span>
          <span className="font-semibold">Moss Portal</span>
          <span className="rounded-full border border-white/15 px-2 py-0.5 text-xs text-white/70">Agent SDK Demo</span>
        </div>
        <div className="max-w-lg">
          <p className="text-sm font-medium text-white/60">Local dashboard flow</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">Manage realtime retrieval from one place.</h1>
          <p className="mt-6 text-base leading-7 text-white/65">This prototype portal accepts any email and password so demos can continue without touching Moss production auth.</p>
        </div>
        <p className="text-xs text-white/45">No credentials are stored. No production Moss APIs are called.</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <form className="w-full max-w-sm rounded-2xl border border-moss-line bg-white p-6 shadow-card" onSubmit={submit}>
          <div className="flex items-center gap-2 md:hidden">
            <span className="grid size-8 place-items-center rounded-lg bg-moss-ink text-sm font-bold text-white">M</span>
            <span className="font-semibold">Moss Portal</span>
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-moss-green md:mt-0">Demo sign in</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-3 text-sm leading-6 text-moss-muted">Type anything and continue to the local dashboard.</p>
          <label className="mt-6 block text-sm font-medium" htmlFor="email">Email</label>
          <input className="focus-ring mt-2 h-11 w-full rounded-xl border border-moss-line px-3 text-sm outline-none" id="email" name="email" placeholder="demo@example.com" type="email" />
          <label className="mt-4 block text-sm font-medium" htmlFor="password">Password</label>
          <input className="focus-ring mt-2 h-11 w-full rounded-xl border border-moss-line px-3 text-sm outline-none" id="password" name="password" placeholder="anything works" type="password" />
          <button className="focus-ring mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-moss-ink px-4 text-sm font-medium text-white hover:bg-black" type="submit">
            Continue to dashboard <ArrowRight size={16} />
          </button>
          <button className="focus-ring mt-3 h-11 w-full rounded-full border border-moss-line text-sm font-medium hover:border-moss-ink" type="button" onClick={() => router.push("/dashboard")}>
            Skip login
          </button>
        </form>
      </section>
    </main>
  );
}
