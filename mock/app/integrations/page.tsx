import { categories, integrations } from "@/lib/integrations";
import { IntegrationCard } from "@/components/integration-card";
import { MockActionProvider } from "@/components/mock-action-provider";
import { MockActionButton } from "@/components/mock-action-button";
import { PortalLinkButton } from "@/components/portal-link-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function IntegrationsPage() {
  return (
    <MockActionProvider>
      <SiteHeader />
      <main>
        <section className="moss-container pb-10 pt-20">
          <p className="text-sm font-medium text-moss-muted">Integrations</p>
          <div className="mt-5 max-w-3xl">
            <h1 className="text-5xl font-semibold tracking-tight text-moss-ink sm:text-6xl">Works with Your Stack</h1>
            <p className="mt-6 text-lg leading-8 text-moss-muted">
              Drop-in sub-10ms semantic search for the frameworks and platforms you already use. Install the SDK, create an index, and start querying in minutes.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <PortalLinkButton>Start Free</PortalLinkButton>
            <MockActionButton title="Talk to us" variant="light">Talk to us</MockActionButton>
          </div>
        </section>
        <section className="moss-container">
          {categories.map((category) => {
            const items = integrations.filter((item) => item.category === category);
            if (!items.length) return null;
            return (
              <div className="mb-16" key={category}>
                <h2 className="mb-6 text-2xl font-semibold tracking-tight">{category}</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <IntegrationCard key={item.slug} item={item} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </main>
      <SiteFooter />
    </MockActionProvider>
  );
}
