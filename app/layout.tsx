import type { Metadata } from "next";
import { AgentWidget } from "@/lib/agent-sdk";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moss Browser Agent Demo",
  description: "Embeddable browser voice agent for Moss-powered website guidance."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <AgentWidget appId="moss-browser-agent-demo" indexName="moss-demo-site" contextUrl="/agent-context/site-context.json" pageId="site" />
      </body>
    </html>
  );
}
