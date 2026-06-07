> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Vercel AI SDK

> Give AI agents semantic search capabilities using Moss tools for the Vercel AI SDK.

Integrate Moss semantic search into [Vercel AI SDK](https://sdk.vercel.ai/) agents using the `@moss-tools/vercel-sdk` package. This setup exposes Moss operations as AI SDK tools, so language models can search, create indexes, and manage documents as part of agentic workflows.

> **Note:** For the full package source and tests, see the [vercel-sdk package](https://github.com/usemoss/moss/tree/main/packages/vercel-sdk).

## Why use Moss with the Vercel AI SDK?

The Vercel AI SDK's tool system lets language models call external functions during generation. Moss tools give your agents direct access to a semantic knowledge base with sub-10ms retrieval, enabling RAG workflows and knowledge base operations within a single `generateText` or `streamText` call.

## Required tools

* [Moss](https://www.moss.dev/) account with project credentials
* [Node.js](https://nodejs.org/) 18+

## Integration guide

<Steps>
  <Step title="Installation">
    ```bash theme={null}
    npm install @moss-tools/vercel-sdk @moss-dev/moss ai zod
    ```
  </Step>

  <Step title="Environment setup">
    ```bash .env.local theme={null}
    MOSS_PROJECT_ID=your_project_id
    MOSS_PROJECT_KEY=your_project_key
    OPENAI_API_KEY=sk-...
    ```
  </Step>

  <Step title="Create tools and use with an agent">
    Import the tool factories and initialize them with a Moss client. Each factory returns a standard AI SDK tool with typed input/output schemas.

    ```typescript theme={null}
    import { MossClient } from "@moss-dev/moss";
    import {
      mossSearchTool,
      mossAddDocsTool,
      mossDeleteDocsTool,
      mossCreateIndexTool,
      mossListIndexesTool,
    } from "@moss-tools/vercel-sdk";
    import { generateText, stepCountIs } from "ai";
    import { openai } from "@ai-sdk/openai";

    const client = new MossClient(
      process.env.MOSS_PROJECT_ID!,
      process.env.MOSS_PROJECT_KEY!,
    );

    // Prebind tools to a specific index for simpler schemas
    const tools = {
      search: mossSearchTool({ client, indexName: "docs" }),
      addDocs: mossAddDocsTool({ client, indexName: "docs" }),
      deleteDocs: mossDeleteDocsTool({ client, indexName: "docs" }),
      createIndex: mossCreateIndexTool({ client }),
      listIndexes: mossListIndexesTool({ client }),
    };

    const result = await generateText({
      model: openai("gpt-4o"),
      tools,
      stopWhen: stepCountIs(5),
      prompt: "Search the docs index for return policy info and summarize it.",
    });
    ```
  </Step>
</Steps>

## Available tools

### Read-only

| Tool                  | Description                                                                     |
| :-------------------- | :------------------------------------------------------------------------------ |
| `mossSearchTool`      | Semantic search over an index. Returns matching documents ranked by similarity. |
| `mossListIndexesTool` | List all available indexes in the Moss project.                                 |

### Mutating (requires approval)

Mutating tools have `needsApproval: true`, so the AI SDK prompts for user confirmation before execution.

| Tool                  | Description                                                         |
| :-------------------- | :------------------------------------------------------------------ |
| `mossAddDocsTool`     | Add documents to an existing index. Supports upsert by document ID. |
| `mossDeleteDocsTool`  | Delete documents from an index by their IDs.                        |
| `mossCreateIndexTool` | Create a new index with initial documents.                          |

## Configuration

### Index binding

Tools accept an optional `indexName` parameter. When provided, the tool is prebound to that index and the LLM only needs to provide the query or document data. When omitted, the LLM chooses the index name dynamically.

```typescript theme={null}
// Prebound: simpler schema, LLM only provides query
const search = mossSearchTool({ client, indexName: "docs" });

// Dynamic: LLM chooses the index
const search = mossSearchTool({ client });
```

### mossSearchTool options

| Parameter     | Type         | Default        | Description                          |
| :------------ | :----------- | :------------- | :----------------------------------- |
| `client`      | `MossClient` | Required       | An initialized Moss client instance. |
| `indexName`   | `string`     | `undefined`    | Prebind to a specific index.         |
| `description` | `string`     | Auto-generated | Custom tool description for the LLM. |

---

_Source: https://docs.moss.dev/docs/integrations/vercel-ai-sdk.md_
