import { integrations } from "./integrations";

export type LandingAgentDoc = {
  id: string;
  text: string;
  metadata: Record<string, string>;
};

const landingText = [
  "Moss integrations page.",
  "Route: /integrations. The site homepage lives at /.",
  "Hero headline: Works with Your Stack.",
  "Hero description: Drop-in sub-10ms semantic search for frameworks and platforms. Install the SDK, create an index, and start querying in minutes.",
  "Users can browse integrations by category, open integration detail pages, start free signup, talk to the team, open docs, view demo scenarios, pricing, and changelog/blog."
].join("\n");

export const landingAgentDocs: LandingAgentDoc[] = [
  {
    id: "landing:/integrations:page-text",
    text: landingText,
    metadata: {
      type: "page_text",
      pageId: "landing.integrations",
      route: "/integrations",
      title: "Works with Your Stack",
      source: "local_app_static"
    }
  },
  {
    id: "landing:/integrations:hero-start-free",
    text: "Start Free call to action. Use this when the user wants to sign up, create an account, start building, or open the Moss portal login from the integrations landing page.",
    metadata: {
      type: "page_element",
      pageId: "landing.integrations",
      route: "/integrations",
      label: "Start Free",
      elementType: "link",
      selector: "[data-agent-id='hero-start-free']",
      action: "navigate",
      safety: "safe",
      targetRoute: "/login"
    }
  },
  {
    id: "landing:/integrations:hero-talk-to-us",
    text: "Talk to us button. Use this when the user wants to contact Moss, talk to an engineer, request a demo, or ask for sales help. In this prototype it opens a local demo modal.",
    metadata: {
      type: "page_element",
      pageId: "landing.integrations",
      route: "/integrations",
      label: "Talk to us",
      elementType: "button",
      selector: "[data-agent-id='hero-talk-to-us']",
      action: "click",
      safety: "confirm"
    }
  },
  ...[
    ["/integrations", "Integrations", "Open the integrations landing page."],
    ["/docs", "Docs", "Open Moss documentation."],
    ["/demo", "Demo", "Open demo walkthrough scenarios."],
    ["/docs/pricing", "Pricing", "Open pricing documentation."],
    ["/docs/changelog", "Blog", "Open changelog or blog content."]
  ].map(([href, label, description]) => ({
    id: `landing:/integrations:nav:${label.toLowerCase()}`,
    text: `${label} navigation link. ${description}`,
    metadata: {
      type: "page_element",
      pageId: "landing.integrations",
      route: "/integrations",
      label,
      elementType: "link",
      selector: `[data-agent-id='nav-${label.toLowerCase()}']`,
      action: "navigate",
      safety: "safe",
      targetRoute: href
    }
  })),
  ...integrations.map((item) => ({
    id: `landing:/integrations:card:${item.slug}`,
    text: [
      `${item.shortTitle} integration card.`,
      `Category: ${item.category}.`,
      item.description,
      `Use this card when the user asks about ${item.shortTitle}, ${item.title}, or wants to view this integration.`
    ].join(" "),
    metadata: {
      type: "page_element",
      pageId: "landing.integrations",
      route: "/integrations",
      label: item.shortTitle,
      elementType: "link",
      selector: `[data-agent-id='integration-card-${item.slug}']`,
      action: "navigate",
      safety: "safe",
      category: item.category,
      targetRoute: `/integrations/${item.slug}`
    }
  }))
];
