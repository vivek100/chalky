export type Integration = {
  slug: string;
  category: string;
  title: string;
  shortTitle: string;
  description: string;
  benefits: string[];
  language: "TypeScript" | "Python" | "JSON";
  code: string;
  steps: { title: string; body: string }[];
  faqs: { question: string; answer: string }[];
  docsSlug: string;
  related: string[];
};

const sharedFaqs = [
  {
    question: "Does this demo connect to Moss production?",
    answer: "No. This is a local browser-agent prototype. Account credentials and production portal services are intentionally not used."
  },
  {
    question: "Where would authentication happen in a real project?",
    answer: "A real implementation would create project credentials in the Moss portal and load them from environment variables or a secure server-side secret store."
  }
];

export const integrations: Integration[] = [
  {
    slug: "langchain",
    category: "Agent Framework",
    title: "Moss + LangChain: Sub-10ms Retrieval for Chains and Agents",
    shortTitle: "LangChain",
    description: "Use Moss as a retriever in LangChain chains and agents so application context is available instantly before generation.",
    benefits: ["Drop Moss search into retriever flows", "Blend semantic and keyword scoring", "Keep agent context fresh with local sessions", "Avoid slow remote vector database round trips"],
    language: "Python",
    docsSlug: "integrations/langchain",
    related: ["dspy", "vercel-ai-sdk", "mcp-server"],
    code: `from moss import MossClient, QueryOptions
from langchain_core.documents import Document

client = MossClient(project_id="demo", api_key="demo")
index = await client.load_index("support-docs")

async def retrieve(query: str):
    results = await index.query(query, QueryOptions(top_k=5, alpha=0.8))
    return [Document(page_content=doc.text, metadata=doc.metadata) for doc in results.docs]`,
    steps: [
      { title: "Install packages", body: "Add moss and your LangChain packages to the application environment." },
      { title: "Load the index", body: "Initialize Moss once at agent startup so queries stay in-process." },
      { title: "Wrap retrieval", body: "Return Moss results as LangChain documents and pass them into your chain." }
    ],
    faqs: [
      { question: "Can Moss replace my LangChain retriever?", answer: "Yes. In a real app you can expose Moss query results through a retriever adapter or tool." },
      ...sharedFaqs
    ]
  },
  {
    slug: "dspy",
    category: "Agent Framework",
    title: "Moss + DSPy: Fast Retrieval for Optimized LLM Programs",
    shortTitle: "DSPy",
    description: "Use Moss as a retrieval module in DSPy programs for sub-10ms semantic search during compiled prompt execution.",
    benefits: ["Works inside DSPy modules", "Keeps examples and knowledge close to the program", "Supports hybrid retrieval", "Good fit for iterative prompt optimization"],
    language: "Python",
    docsSlug: "integrations/dspy",
    related: ["langchain", "vercel-ai-sdk", "mcp-server"],
    code: `import dspy
from moss import MossClient

class MossRetrieve(dspy.Module):
    def __init__(self):
        self.index = MossClient(project_id="demo", api_key="demo").load_index("docs")

    def forward(self, question):
        hits = self.index.query(question, top_k=4)
        return dspy.Prediction(passages=[hit.text for hit in hits.docs])`,
    steps: [
      { title: "Create a retriever module", body: "Wrap Moss query in a DSPy module." },
      { title: "Return passages", body: "Map search hits to passages for downstream predictors." },
      { title: "Compile and evaluate", body: "Let DSPy optimize prompts while Moss supplies fast context." }
    ],
    faqs: sharedFaqs
  },
  {
    slug: "vercel-ai-sdk",
    category: "AI SDK",
    title: "Moss + Vercel AI SDK: Semantic Search as Agent Tools",
    shortTitle: "Vercel AI SDK",
    description: "The @moss-tools/vercel-sdk package exposes Moss operations as standard AI SDK tools for agentic applications.",
    benefits: ["Expose search as a typed AI SDK tool", "Stream responses with retrieved context", "Works in Next.js route handlers", "Use tool calling without custom plumbing"],
    language: "TypeScript",
    docsSlug: "integrations/vercel-ai-sdk",
    related: ["nextjs", "langchain", "mcp-server"],
    code: `import { streamText } from "ai";
import { createMossTools } from "@moss-tools/vercel-sdk";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const tools = createMossTools({ index: "product-docs" });

  return streamText({
    model: "openai/gpt-4.1-mini",
    messages,
    tools
  }).toDataStreamResponse();
}`,
    steps: [
      { title: "Install the adapter", body: "Add the Moss Vercel AI SDK package to your app." },
      { title: "Create tools", body: "Create Moss tools with the index your agent should search." },
      { title: "Pass tools to streamText", body: "Let the model call Moss when it needs context." }
    ],
    faqs: sharedFaqs
  },
  {
    slug: "livekit",
    category: "Voice Platform",
    title: "Moss + LiveKit: Real-Time Search for Voice Agents",
    shortTitle: "LiveKit",
    description: "LiveKit voice agents can query Moss on every user turn and inject results into chat context before the LLM responds.",
    benefits: ["Context injection avoids tool-calling delay", "Sub-10ms retrieval reduces dead air", "Works with LiveKit Agents hooks", "Pairs with Deepgram, OpenAI, and TTS providers", "Preload indexes at startup"],
    language: "Python",
    docsSlug: "build/voice-agent-livekit",
    related: ["pipecat", "vapi", "elevenlabs"],
    code: `from moss import MossClient, QueryOptions
from livekit.agents import Agent, ChatContext, ChatMessage

class MossVoiceAgent(Agent):
    def __init__(self, moss_client: MossClient):
        super().__init__(instructions="You are a helpful assistant.")
        self.moss = moss_client

    async def on_user_turn_completed(self, turn_ctx: ChatContext, new_message: ChatMessage):
        results = await self.moss.query(
            "knowledge-base",
            new_message.text_content,
            QueryOptions(top_k=5, alpha=0.8)
        )
        if results.docs:
            context = "\\n".join([doc.text for doc in results.docs])
            turn_ctx.add_message(role="system", content=context)
        await super().on_user_turn_completed(turn_ctx, new_message)`,
    steps: [
      { title: "Install the SDKs", body: "Install moss, livekit-agents, and your STT/LLM/TTS provider packages." },
      { title: "Create and load your index", body: "Index product docs or support content, then load it when the agent starts." },
      { title: "Inject context per turn", body: "Override the LiveKit user-turn hook and add Moss results to the chat context." }
    ],
    faqs: [
      { question: "How does context injection work?", answer: "The voice agent searches Moss after transcription and before generation, so retrieved snippets are already present when the LLM starts responding." },
      ...sharedFaqs
    ]
  },
  {
    slug: "pipecat",
    category: "Voice Platform",
    title: "Moss + Pipecat: Knowledge Retrieval for Multimodal Agents",
    shortTitle: "Pipecat",
    description: "Pipecat agents can enrich each conversation turn with Moss search results inside a real-time pipeline.",
    benefits: ["Pipeline-friendly retrieval", "Local-first sessions for live updates", "Fast enough for voice latency budgets", "Works with multimodal agent flows"],
    language: "Python",
    docsSlug: "integrations/pipecat",
    related: ["livekit", "vapi", "elevenlabs"],
    code: `from moss import MossClient

moss = MossClient(project_id="demo", api_key="demo")
index = await moss.load_index("voice-knowledge")

async def enrich_frame(frame):
    hits = await index.query(frame.transcript, top_k=4)
    frame.context["moss_results"] = [hit.text for hit in hits.docs]
    return frame`,
    steps: [
      { title: "Load Moss in the pipeline", body: "Initialize the index before the session begins." },
      { title: "Search from transcripts", body: "Use each user utterance as a retrieval query." },
      { title: "Attach context", body: "Forward retrieved snippets to the LLM processor." }
    ],
    faqs: sharedFaqs
  },
  {
    slug: "vapi",
    category: "Voice Platform",
    title: "Moss + VAPI: Custom Knowledge Base Webhooks",
    shortTitle: "VAPI",
    description: "Connect Moss semantic search to VAPI voice agents through a Custom Knowledge Base webhook.",
    benefits: ["Use VAPI webhook knowledge hooks", "Return compact context snippets", "Keep voice answers grounded", "Search product docs during live calls"],
    language: "TypeScript",
    docsSlug: "integrations/vapi",
    related: ["livekit", "pipecat", "elevenlabs"],
    code: `import { NextRequest, NextResponse } from "next/server";
import { MossClient } from "@moss-dev/moss-node";

const moss = new MossClient({ projectId: "demo", apiKey: "demo" });

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  const results = await moss.query("voice-kb", query, { topK: 5, alpha: 0.8 });

  return NextResponse.json({
    results: results.docs.map((doc) => ({ content: doc.text, metadata: doc.metadata }))
  });
}`,
    steps: [
      { title: "Create a webhook route", body: "Add a server endpoint that accepts VAPI knowledge base queries." },
      { title: "Query Moss", body: "Search the relevant index and return the top snippets." },
      { title: "Configure VAPI", body: "Point the Custom Knowledge Base webhook at your route." }
    ],
    faqs: [
      { question: "What does VAPI send to the webhook?", answer: "A real VAPI configuration sends the user query or conversation context; this prototype shows the route shape without transmitting anything." },
      ...sharedFaqs
    ]
  },
  {
    slug: "elevenlabs",
    category: "Voice Platform",
    title: "Moss + ElevenLabs: Context for Conversational AI Agents",
    shortTitle: "ElevenLabs",
    description: "Add real-time knowledge base access to ElevenLabs conversational AI agents with Moss semantic search.",
    benefits: ["Ground spoken answers in product knowledge", "Keep call latency low", "Use webhook-style context injection", "Support fast follow-up questions"],
    language: "TypeScript",
    docsSlug: "integrations/elevenlabs",
    related: ["livekit", "pipecat", "vapi"],
    code: `export async function searchKnowledge(transcript: string) {
  const hits = await moss.query("agent-kb", transcript, { topK: 4 });
  return hits.docs.map((doc) => ({
    text: doc.text,
    source: doc.metadata?.source
  }));
}`,
    steps: [
      { title: "Load the agent knowledge base", body: "Prepare a Moss index with scripts, FAQs, and support docs." },
      { title: "Search per turn", body: "Use each transcript fragment to retrieve context." },
      { title: "Return snippets", body: "Provide compact context to the conversational agent." }
    ],
    faqs: sharedFaqs
  },
  {
    slug: "nextjs",
    category: "Web Framework",
    title: "Moss + Next.js: Server Actions for Semantic Search",
    shortTitle: "Next.js",
    description: "Moss integrates with Next.js using Server Actions for a clean client-server search pattern.",
    benefits: ["Keep credentials on the server", "Use Server Actions or Route Handlers", "Render instant search interfaces", "Share components with docs and apps"],
    language: "TypeScript",
    docsSlug: "integrations/nextjs",
    related: ["vercel-ai-sdk", "vitepress", "mcp-server"],
    code: `"use server";

import { MossClient } from "@moss-dev/moss-node";

const client = new MossClient({
  projectId: process.env.MOSS_PROJECT_ID!,
  apiKey: process.env.MOSS_PROJECT_KEY!
});

export async function searchDocs(query: string) {
  return client.query("docs", query, { topK: 8, alpha: 0.7 });
}`,
    steps: [
      { title: "Create a server action", body: "Keep Moss credentials in server-only code." },
      { title: "Call from UI", body: "Invoke the action from a search component." },
      { title: "Render results", body: "Display snippets, sources, and confidence metadata." }
    ],
    faqs: sharedFaqs
  },
  {
    slug: "vitepress",
    category: "Docs Platform",
    title: "Moss + VitePress: Real-Time Docs Search",
    shortTitle: "VitePress",
    description: "The vitepress-plugin-moss package adds real-time semantic search to VitePress documentation sites.",
    benefits: ["Semantic docs search", "Zero-config plugin shape", "Fast local index loading", "Works for developer documentation"],
    language: "TypeScript",
    docsSlug: "integrations/vitepress",
    related: ["nextjs", "mcp-server", "vercel-ai-sdk"],
    code: `import { defineConfig } from "vitepress";
import mossSearch from "vitepress-plugin-moss";

export default defineConfig({
  title: "Docs",
  vite: {
    plugins: [
      mossSearch({ index: "docs", projectId: "demo" })
    ]
  }
});`,
    steps: [
      { title: "Install the plugin", body: "Add the Moss VitePress plugin to the docs project." },
      { title: "Configure the index", body: "Point the plugin at the documentation index." },
      { title: "Ship local search", body: "Use Moss to retrieve semantically relevant docs pages." }
    ],
    faqs: sharedFaqs
  },
  {
    slug: "mcp-server",
    category: "Protocol",
    title: "Moss MCP Server: Semantic Search for AI Coding Assistants",
    shortTitle: "MCP Server",
    description: "Expose Moss as a Model Context Protocol server for MCP-compatible AI clients like Claude Desktop, Cursor, and VS Code.",
    benefits: ["Run with npx and JSON config", "Expose query and index tools", "Let AI assistants search your knowledge base", "Sub-10ms retrieval for coding context", "Works with MCP-compatible clients"],
    language: "JSON",
    docsSlug: "integrations/mcp-server",
    related: ["vercel-ai-sdk", "langchain", "nextjs"],
    code: `{
  "mcpServers": {
    "moss": {
      "command": "npx",
      "args": ["@moss-tools/mcp-server"],
      "env": {
        "MOSS_PROJECT_ID": "your-project-id",
        "MOSS_PROJECT_KEY": "your-project-key"
      }
    }
  }
}`,
    steps: [
      { title: "Add MCP server config", body: "Add a Moss entry to your MCP-compatible client's JSON config." },
      { title: "Set environment variables", body: "Provide project credentials through the config environment." },
      { title: "Restart the client", body: "The assistant can now query and manage Moss indexes through tools." }
    ],
    faqs: [
      { question: "Which clients support this pattern?", answer: "Any MCP-compatible AI client can use this server shape, including popular coding assistants that support MCP configuration." },
      ...sharedFaqs
    ]
  }
];

export const categories = ["Agent Framework", "AI SDK", "Voice Platform", "Docs Platform", "Protocol", "Web Framework"];

export function getIntegration(slug: string) {
  return integrations.find((item) => item.slug === slug);
}

export function relatedIntegrations(slugs: string[]) {
  return slugs.map((slug) => getIntegration(slug)).filter(Boolean) as Integration[];
}
