export type AgentContextDoc = {
  id: string;
  text: string;
  metadata: Record<string, string>;
};

export type AgentRoute = {
  route: string;
  pageId: string;
  title: string;
  source: "static" | "integration" | "docs" | "dashboard";
};
