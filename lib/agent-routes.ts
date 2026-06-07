import { integrations } from "./integrations";
import { getDocsManifest } from "./docs";
import { docHref } from "./doc-routes";
import type { AgentRoute } from "./agent-context";

function pageIdFromRoute(route: string) {
  return route.replace(/^\//, "").replace(/\//g, ".") || "home";
}

export function getAgentRoutes(): AgentRoute[] {
  const routes: AgentRoute[] = [
    { route: "/", pageId: "home", title: "Home", source: "static" },
    { route: "/integrations", pageId: "integrations", title: "Integrations", source: "static" },
    { route: "/demo", pageId: "demo", title: "Demo Walkthroughs", source: "static" },
    { route: "/login", pageId: "login", title: "Login", source: "static" },
    { route: "/dashboard", pageId: "dashboard", title: "Dashboard", source: "dashboard" },
    { route: "/dashboard/analytics", pageId: "dashboard.analytics", title: "Analytics", source: "dashboard" },
    { route: "/dashboard/api-keys", pageId: "dashboard.api-keys", title: "API Keys", source: "dashboard" },
    { route: "/dashboard/usage", pageId: "dashboard.usage", title: "Usage", source: "dashboard" },
    { route: "/dashboard/founding-agent/get-started", pageId: "dashboard.founding-agent.get-started", title: "Founding Agent", source: "dashboard" },
    ...integrations.map((item) => ({
      route: `/integrations/${item.slug}`,
      pageId: `integrations.${item.slug}`,
      title: item.shortTitle,
      source: "integration" as const
    })),
    ...getDocsManifest().map((entry) => {
      const route = docHref(entry.slug);
      return {
        route,
        pageId: pageIdFromRoute(route),
        title: entry.title,
        source: "docs" as const
      };
    })
  ];

  const seen = new Set<string>();
  return routes.filter((route) => {
    if (seen.has(route.route)) return false;
    seen.add(route.route);
    return true;
  });
}
