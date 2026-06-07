> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Overview

> Everything the Moss Python SDK can do, with a snippet for each operation.

The Moss Python SDK (`moss`) brings semantic search to Python. It wraps a high-performance
Rust core and exposes an async API. Documents are embedded and queried locally, with optional
cloud sync.

## Requirements

* Python 3.10 or higher

## Install

```bash theme={null}
pip install moss
```

Get your project credentials from the [Moss portal](https://portal.usemoss.dev).

## Two ways to search

* [`MossClient`](./classes/MossClient) - the entry point. Manage cloud indexes, load one into memory, and query it.
* [`SessionIndex`](./classes/SessionIndex) - a local, in-process index for real-time indexing during a live interaction; push to the cloud when done.

## Quick start

```python theme={null}
import asyncio
from moss import MossClient, DocumentInfo, QueryOptions

async def main():
    client = MossClient(MOSS_PROJECT_ID, MOSS_PROJECT_KEY)
    await client.create_index("faqs", [
        DocumentInfo(id="doc1", text="Track your order in your account.", metadata={"category": "shipping"}),
        DocumentInfo(id="doc2", text="30-day return policy for most items.", metadata={"category": "returns"}),
    ])
    await client.load_index("faqs")
    results = await client.query("faqs", "return a damaged product", QueryOptions(top_k=3))
    for doc in results.docs:
        print(doc.id, doc.score)

asyncio.run(main())
```

## Indexes

Create, inspect, and delete cloud indexes. Mutations run as async jobs and return a
`MutationResult` with a `job_id` and `doc_count`.

```python theme={null}
# Create (defaults to moss-minilm)
result = await client.create_index("faqs", documents)

# Inspect
info = await client.get_index("faqs")     # IndexInfo: name, doc_count, model.id, status
indexes = await client.list_indexes()      # list[IndexInfo]

# Delete
await client.delete_index("faqs")
```

## Documents

Add, update, fetch, and remove documents on an existing index.

```python theme={null}
from moss import MutationOptions, GetDocumentsOptions

# Add or upsert
await client.add_docs("faqs", new_docs, MutationOptions(upsert=True))

# Fetch all, or by id
all_docs = await client.get_docs("faqs")
some = await client.get_docs("faqs", GetDocumentsOptions(doc_ids=["doc1", "doc2"]))

# Delete by id
await client.delete_docs("faqs", ["doc6", "doc7"])
```

## Load and query

Load an index into memory, then query it in-process. Call `load_index` before querying.

```python theme={null}
await client.load_index("faqs")
results = await client.query("faqs", "return a damaged product", QueryOptions(top_k=3))
for doc in results.docs:
    print(doc.id, doc.score, doc.text)

await client.unload_index("faqs")   # free memory when done
```

## Hybrid search

Blend semantic and keyword scoring with `alpha` (1.0 = semantic, 0.0 = keyword; default 0.8).

```python theme={null}
await client.query("faqs", "return policy", QueryOptions(top_k=3, alpha=0.6))
```

See [Hybrid search](./hybrid-search).

## Metadata filtering

Narrow results by document metadata on a loaded index.

```python theme={null}
await client.query("products", "running shoes", QueryOptions(top_k=5, filter={
    "$and": [
        {"field": "category", "condition": {"$eq": "shoes"}},
        {"field": "price",    "condition": {"$lt": "100"}},
    ],
}))
```

Operators: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$near`, composed with
`$and` / `$or`. See [Metadata filtering](./metadata-filtering).

## Custom embeddings

Supply your own vectors with `model_id="custom"` (each document carries `embedding`, and
queries pass `embedding`).

```python theme={null}
await client.create_index("tickets", docs_with_embeddings, model_id="custom")
await client.load_index("tickets")
await client.query("tickets", "billing problem", QueryOptions(top_k=3, embedding=query_vector))
```

See [Custom embeddings](./custom-embeddings).

## Multi-index search

Query several loaded indexes in one call; each result is tagged with its source `index_name`.

```python theme={null}
await client.load_indexes(["products", "reviews", "faqs"])
results = await client.query_multi_index(["products", "reviews", "faqs"], "battery life", QueryOptions(top_k=6))
for doc in results.docs:
    print(doc.index_name, doc.id, doc.score)
await client.unload_indexes(["products", "reviews", "faqs"])
```

See [Multi-index search](./multi-index-search).

## Sessions

Index and query locally in real time with a [`SessionIndex`](./classes/SessionIndex), then
push to the cloud. `session()` resumes an existing cloud index by name, or starts empty.

```python theme={null}
session = await client.session(index_name="call-123")
await session.add_docs([DocumentInfo(id="turn-1", text="Customer reported a duplicate charge.")])
hits = await session.query("billing issue", QueryOptions(top_k=3))
await session.push_index()
```

See [Sessions](./sessions).

## Keeping indexes fresh

Auto-refresh a loaded index (poll the cloud and hot-swap newer versions in automatically),
and track async jobs.

```python theme={null}
await client.load_index("faqs", auto_refresh=True, polling_interval_in_seconds=300)
status = await client.get_job_status(result.job_id)
```

## Models

* `moss-minilm` (default) - fast, lightweight
* `moss-mediumlm` - higher accuracy
* `custom` - supply your own embedding vectors via `DocumentInfo.embedding`

## Guides

* [Sessions](./sessions)
* [Hybrid search](./hybrid-search)
* [Metadata filtering](./metadata-filtering)
* [Custom embeddings](./custom-embeddings)
* [Multi-index search](./multi-index-search)

## Reference

[MossClient](./classes/MossClient) and [SessionIndex](./classes/SessionIndex), plus all interfaces and types, are in the Reference section of the sidebar.

---

_Source: https://docs.moss.dev/docs/reference/python/api.md_
