> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Overview

> Private, in-browser semantic search for the web with the Moss Browser/WASM SDK.

`@moss-dev/moss-web` brings semantic search directly into the browser. Queries
run locally on WebAssembly, so once an index is loaded there are no server
round-trips and no data leaves the device.

This is the in-browser, client-side SDK. For server-side (Node.js) workloads,
use [`@moss-dev/moss`](../js/api) instead. See
[Browser vs Node](./browser-vs-node) to pick the right one.

## Features

* In-browser vector search with zero network latency once an index is loaded
* Semantic and hybrid search that goes beyond keyword matching
* Multi-index support for isolated search spaces
* Full CRUD for indexes and documents from the browser
* Privacy-first: queries run entirely in the browser

## Install

```bash theme={null}
npm install @moss-dev/moss-web
```

The package depends on `@moss-dev/moss-wasm`, which is installed automatically.
The WebAssembly module and embedding model download on first use.

## Quickstart

Create a client, create an index, load it into the browser, then query it.
Querying always requires a loaded index, so call `loadIndex` before `query`.

```typescript theme={null}
import { MossClient } from "@moss-dev/moss-web";

// 1. Initialize the client (WASM/model download happens on first use)
const client = new MossClient("your-project-id", "your-project-key");

// 2. Create an index with documents
await client.createIndex("knowledge-base", [
  { id: "1", text: "Machine learning fundamentals" },
  { id: "2", text: "Deep learning neural networks" },
]);

// 3. Load the index into the browser for fast local queries
await client.loadIndex("knowledge-base");

// 4. Query - runs entirely in-browser
const results = await client.query("knowledge-base", "AI and neural networks");
results.docs.forEach((doc) => {
  console.log(`${doc.id}: ${doc.text} (score: ${doc.score})`);
});
```

<Note>
  Always call `loadIndex` before `query`. Querying runs against an index that has
  been loaded into the browser; there is no query path that skips loading.
</Note>

## Reference

* [MossClient](./classes/MossClient) - the in-browser client: create a client,
  manage indexes and documents, load indexes locally, and query them.
* [Browser vs Node](./browser-vs-node) - when to use the browser SDK versus the
  Node SDK.

---

_Source: https://docs.moss.dev/docs/reference/browser/api.md_
