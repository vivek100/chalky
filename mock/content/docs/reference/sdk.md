> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# SDK Overview

> Every Moss SDK capability, with links to the detailed guide for each.

Moss ships official SDKs for six platforms. They share one conceptual API (create or load an
index, then query) and one index format, so you can build in one and query from another.

<CardGroup cols={2}>
  <Card title="Python" icon="python" href="/docs/reference/python/api">
    Async Python SDK. `pip install moss`
  </Card>

  <Card title="JavaScript" icon="js" href="/docs/reference/js/api">
    Node.js server-side SDK. `npm install @moss-dev/moss`
  </Card>

  <Card title="Swift (iOS)" icon="swift" href="/docs/reference/swift/api">
    On-device iOS SDK via Swift Package Manager.
  </Card>

  <Card title="Elixir" icon="gem" href="/docs/reference/elixir/api">
    Elixir SDK on Hex. `{:moss, "~> 1.0"}`
  </Card>

  <Card title="Browser" icon="globe" href="/docs/reference/browser/api">
    In-browser / WebAssembly SDK. `npm install @moss-dev/moss-web`
  </Card>

  <Card title="C" icon="c" href="/docs/reference/c/getting-started">
    Native C library (libmoss).
  </Card>
</CardGroup>

## Capabilities

Everything the SDKs can do. Pick a language above for install and quickstart; follow a link
below for the details.

Links below go to the Python pages; each topic has a JavaScript equivalent under the JavaScript SDK.

| Capability          | What it does                                                      | Learn more                                                                |
| ------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Index management    | Create, add, update, delete, get, and list indexes                | [Indexing](/docs/reference/python/api#indexes)                            |
| Load and query      | Load an index into memory and run semantic search                 | [Load and query](/docs/reference/python/api#load-and-query)               |
| Hybrid search       | Blend semantic and keyword scoring with `alpha`                   | [Hybrid search](/docs/reference/python/hybrid-search)                     |
| Metadata filtering  | Narrow results with `$eq`, `$in`, `$near`, `$and`/`$or`, and more | [Metadata filtering](/docs/reference/python/metadata-filtering)           |
| Custom embeddings   | Bring your own vectors with `model_id="custom"`                   | [Custom embeddings](/docs/reference/python/custom-embeddings)             |
| Multi-index search  | Query across several loaded indexes in one call                   | [Multi-index search](/docs/reference/python/multi-index-search)           |
| Real-time sessions  | Local-first indexing during a live interaction                    | [Sessions](/docs/reference/python/sessions)                               |
| Cross-agent handoff | Resume a session across agents, channels, and devices             | [Sessions](/docs/reference/python/sessions)                               |
| Hydration and sync  | Hydrate from the cloud, auto-refresh, and push updates            | [Keeping indexes fresh](/docs/reference/python/api#keeping-indexes-fresh) |

## Models

* `moss-minilm` (default) - fast, lightweight, good for edge and offline
* `moss-mediumlm` - higher accuracy with reasonable performance
* `moss-litelm` - the on-device default on iOS
* `custom` - bring your own embedding vectors

## Samples

Runnable end-to-end examples live in the
[moss](https://github.com/usemoss/moss) repo, with parallel JavaScript and
Python projects you can adapt by swapping in your own data.

---

_Source: https://docs.moss.dev/docs/reference/sdk.md_
