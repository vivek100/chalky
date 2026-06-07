import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { FAQ } from "@/components/faq";
import { IntegrationCard } from "@/components/integration-card";
import { DemoActionButton } from "@/components/demo-action-button";
import { DemoActionProvider } from "@/components/demo-action-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getIntegration, integrations, relatedIntegrations } from "@/lib/integrations";

export function generateStaticParams() {
  return integrations.map((item) => ({ slug: item.slug }));
}

export default async function IntegrationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getIntegration(slug);
  if (!item) notFound();
  const related = relatedIntegrations(item.related);

  return (
    <DemoActionProvider>
      <SiteHeader />
      <main>
        <section className="moss-container pb-12 pt-10">
          <nav className="flex items-center gap-2 text-sm text-moss-muted">
            <Link className="hover:text-moss-ink" href="/integrations">Integrations</Link>
            <span>/</span>
            <span>{item.shortTitle}</span>
          </nav>
          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-medium text-moss-green">{item.category}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-moss-ink sm:text-6xl">{item.title}</h1>
            <p className="mt-6 text-lg leading-8 text-moss-muted">{item.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <DemoActionButton title="Get Started">Get Started →</DemoActionButton>
              <DemoActionButton title="Talk to an Engineer" variant="light">Talk to an Engineer</DemoActionButton>
              <Link className="focus-ring rounded-full border border-moss-line bg-white px-4 py-2 text-sm font-medium hover:border-moss-ink" href={`/docs/${item.docsSlug}`}>
                Open docs
              </Link>
            </div>
          </div>
        </section>
        <section className="moss-container grid gap-10 border-t border-moss-line py-14 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="text-sm font-medium text-moss-muted">Benefits</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Why Use Moss with {item.shortTitle}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {item.benefits.map((benefit, index) => (
              <div className="rounded-2xl border border-moss-line bg-white p-5" key={benefit}>
                <span className="text-sm font-semibold text-moss-green">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-3 text-sm leading-6 text-moss-muted">{benefit}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="moss-container grid gap-10 py-12 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="text-sm font-medium text-moss-muted">Integration</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Quick Start</h2>
          </div>
          <CodeBlock code={item.code} language={item.language} />
        </section>
        <section className="moss-container grid gap-10 py-12 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="text-sm font-medium text-moss-muted">Setup</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Get Started in 3 Steps</h2>
          </div>
          <div className="grid gap-4">
            {item.steps.map((step, index) => (
              <div className="rounded-2xl border border-moss-line p-5" key={step.title}>
                <span className="text-sm font-semibold text-moss-green">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-moss-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="moss-container grid gap-10 py-12 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="text-sm font-medium text-moss-muted">FAQ</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Frequently asked questions</h2>
          </div>
          <FAQ items={item.faqs} />
        </section>
        <section className="moss-container py-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-moss-muted">Explore</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Related</h2>
            </div>
            <Link className="hidden items-center gap-2 text-sm font-medium sm:flex" href="/integrations">
              All integrations <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((relatedItem) => (
              <IntegrationCard compact key={relatedItem.slug} item={relatedItem} />
            ))}
          </div>
        </section>
        <section className="moss-container">
          <div className="rounded-3xl bg-moss-ink p-8 text-white sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight">Ship Real-Time Retrieval in Minutes</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">Join teams building conversational AI with instant retrieval. Account actions stay inside this prototype experience.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <DemoActionButton title="Start Building" variant="light">Start Building</DemoActionButton>
              <DemoActionButton title="Talk to Founders" variant="light">Talk to Founders</DemoActionButton>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </DemoActionProvider>
  );
}
