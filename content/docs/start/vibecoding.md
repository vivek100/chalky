> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Vibecoding with Moss

> Starter prompts, LLM-friendly docs, and MCP setup for building Moss-powered apps with AI coding tools.

Every page in these docs has a **Copy page** button paste any page directly into Claude, Cursor, ChatGPT, or your preferred AI coding tool to give it full context.

We publish an [`llms.txt`](https://llmstxt.org) file a compact, machine-readable index of all Moss documentation that AI tools can fetch at the start of a session.

<Card title="llms.txt" icon="file-lines" href="https://docs.moss.dev/llms.txt">
  Full index of Moss documentation in a format AI tools can parse
</Card>

## MCP Server

The Moss MCP server lets any MCP compatible client Claude Desktop, Cursor, VS Code call Moss tools directly. No SDK code needed: your AI assistant can create indexes, add documents, and run semantic search queries from within the conversation.

```json theme={null}
{
  "mcpServers": {
    "moss": {
      "command": "npx",
      "args": ["-y", "@moss-tools/mcp-server"],
      "env": {
        "MOSS_PROJECT_ID": "your-project-id",
        "MOSS_PROJECT_KEY": "your-project-key"
      }
    }
  }
}
```

Add this to your client's config file - `~/Library/Application Support/Claude/claude_desktop_config.json` for Claude Desktop, or `.cursor/mcp.json` for Cursor. Get your credentials from the [Moss Portal](https://portal.usemoss.dev).

<Card title="MCP Server setup" icon="plug" href="/docs/integrations/mcp-server">
  Full setup guide with client-specific instructions and available tools
</Card>

## Starter Prompt for Vibecoding

Paste this into your AI coding tool before starting a Moss project.

```
You are helping me build an application that uses Moss for real-time semantic search.

## About Moss
Moss is a semantic search runtime for conversational AI with sub-10ms local queries, instant index
updates, same SDK for browser, on-device, and cloud. No separate search infrastructure needed.

## Documentation
- Quickstart:    https://docs.moss.dev/docs/start/quickstart
- Core concepts: https://docs.moss.dev/docs/start/core-concepts
- SDK reference: https://docs.moss.dev/docs/reference/sdk
- API reference: https://docs.moss.dev/api-reference/v1
- MCP server:    https://docs.moss.dev/docs/integrations/mcp-server
- Full doc index (LLM-friendly): https://docs.moss.dev/llms.txt

## Setup
- JS package: @moss-dev/moss  |  Python package: moss
- Credentials: MOSS_PROJECT_ID and MOSS_PROJECT_KEY from https://portal.usemoss.dev

## Key concepts
- createIndex / loadIndex / query is the core flow - see the quickstart for full examples
- Hybrid search: pass alpha (0.0 = keyword, 1.0 = semantic, default 0.8) to query()
- Mutations (createIndex, addDocs, deleteDocs) are async jobs; SDK polls until completion
- Embedding models: moss-minilm (fast, default), moss-mediumlm (higher accuracy), custom (bring your own vectors)
- Metadata filtering on local indexes: $eq, $ne, $in, $gt, $lt, $and, $or operators

## Common errors
- Unauthorized: missing or wrong MOSS_PROJECT_ID / MOSS_PROJECT_KEY
- Index not found: call createIndex() before loading or querying
- Index not loaded: call loadIndex() before query() - query() throws if the index isn't loaded locally
- Missing embeddings runtime: use moss-minilm or moss-mediumlm unless supplying custom vectors
```

## Go deeper

<CardGroup cols={2}>
  <Card title="Quickstart" icon="bolt" href="/docs/start/quickstart">
    Working index and query in under 5 minutes
  </Card>

  <Card title="Core Concepts" icon="book" href="/docs/start/core-concepts">
    Indexes, documents, embeddings, and hybrid search
  </Card>

  <Card title="MCP Server" icon="plug" href="/docs/integrations/mcp-server">
    Use Moss tools directly from Claude Desktop or Cursor
  </Card>

  <Card title="Voice Agent (LiveKit)" icon="microphone" href="/docs/build/voice-agent-livekit">
    Inject real-time context into a voice agent pipeline
  </Card>
</CardGroup>

---

_Source: https://docs.moss.dev/docs/start/vibecoding.md_
