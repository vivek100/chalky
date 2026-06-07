> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Core Concepts

> Indexes, embeddings, retrieval, sessions, sync, and the rest of the Moss model.

This page defines the concepts you'll use across Moss. Most link to a How-it-works guide
where they go deeper.

## Index

A structure that powers fast, local search. You add documents and Moss builds an efficient
index for sub-10 ms queries. A project can hold many indexes.

### Document schema

* `id` (string), `text` (string), `metadata` (optional string map)
* Upserts replace matching `id`s; keep ids stable for updates

## Embeddings

Semantic vector representations of text. Moss embeds **on-device** with a built-in model, or
you can [bring your own vectors](/docs/integrate/custom-embeddings) using a `custom` model
(you then supply an `embedding` for every document and every query).

### Models

* `moss-minilm` (default): fast, lightweight, good for edge/offline
* `moss-mediumlm`: higher accuracy with reasonable performance
* `moss-litelm`: the on-device default on iOS
* `custom`: bring your own embedding vectors

### Chunking

* Aim for \~200-500 tokens per chunk; overlap 10-20%
* Smaller chunks improve recall; overlap preserves context continuity

## Loading

Querying always runs against an index held in memory. Load the index (or open a
[session](/docs/integrate/sessions)) before you query - there is no cloud-query-without-loading
path. The Python SDK can also [load several indexes at once](/docs/integrate/multi-index-search)
for a single query, then unload them when done.

## Retrieval

How results are fetched, all over one query call:

* **Vector** (semantic) - matches on meaning
* **Keyword** (BM25) - matches on exact terms
* **[Hybrid](/docs/integrate/hybrid-search)** - blends both, tuned with `alpha` (1.0 semantic, 0.0 keyword, default 0.8)

### Retrieval knobs

* Result count: how many results to return
* `alpha`: the semantic/keyword blend
* `filter`: [metadata filtering](/docs/integrate/metadata-filtering) with `$eq`, `$in`, `$near`, `$and`/`$or`, and more

## Multi-index search

Query several loaded indexes at once and get a single global top-K, each result tagged by its
source index. Useful when the answer is spread across separate corpora you keep as distinct
indexes. See [Multi-index search](/docs/integrate/multi-index-search).

## Sessions

A local-first index you read and write in real time, with no cloud round trip on any
operation. The workflow is create-resume-query-push: open a session by name, index documents
locally as they arrive, query in-memory, and optionally push the result to the cloud. Ideal
for indexing during a live interaction. See [Sessions](/docs/integrate/sessions).

## Storage, sync, and freshness

Indexes persist locally on the device; the cloud copy is the source of truth. Loading pulls a
local snapshot, and [hydration and auto-refresh](/docs/build/data-hydration-sync) keep a loaded
index current by polling for newer versions and hot-swapping with no query downtime. Pushing
uploads local changes back to the cloud.

## Cross-agent handoff

Because a session is just a named cloud index, one agent can push a conversation and another
can resume it by opening a session with the same name - across agents, channels, and devices.
See [Cross-agent handoff](/docs/build/cross-agent-handoff).

## Cross-platform compatibility

Indexes are portable across SDKs: an index built or pushed from one language (Python,
JavaScript, Swift, Elixir, C) can be loaded and queried from another.

## Authentication

SDKs authenticate with project credentials (`MOSS_PROJECT_ID`, `MOSS_PROJECT_KEY`). For
browsers and other untrusted clients, mint short-lived tokens with a
[custom authenticator](/docs/reference/js/custom-authenticator) instead of shipping the
project key. See [Authentication](/docs/integrate/authentication).

## Jobs

Cloud index builds (create, add, push) run as async jobs. The mutation returns a job id;
poll the job-status method to track progress through to completion.

## Performance expectations

* Sub-10 ms local queries (hardware-dependent)
* Sync is optional; compute stays on-device

---

_Source: https://docs.moss.dev/docs/start/core-concepts.md_
