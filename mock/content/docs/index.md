# Real-time retrieval for conversational AI

Sub-10 ms retrieval for voice agents, copilots, and multimodal apps.

## Explore Moss

- [Quickstart](/docs/start/quickstart): Install the Python or TypeScript SDK and run your first semantic search.
- [Core Concepts](/docs/start/core-concepts): Learn how indexes, hybrid search, and real-time updates work.
- [Live-Call Context](/docs/build/live-call-context): Query a persistent cloud index and a live session together during a conversation.
- [Voice Agent (LiveKit)](/docs/build/voice-agent-livekit): Ground a LiveKit voice agent in your Moss index.
- [MCP Server](/docs/integrations/mcp-server): Connect Moss to MCP-compatible AI clients.
- [JavaScript API](/docs/reference/js/api): Browse the JavaScript SDK reference.
- [Python API](/docs/reference/python/api): Browse the Python SDK reference.

## Quick example

```ts
import { MossClient } from "@moss-dev/moss-node";

const client = new MossClient({ projectId: "demo", apiKey: "demo" });
const results = await client.query("docs", "voice agent context", { topK: 5 });
```

---

_Source: https://docs.moss.dev/docs/index.md_
