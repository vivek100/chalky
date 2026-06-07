> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Multi-index search

> Search across multiple loaded indexes in one call and get a global top-K.

Sometimes the answer is spread across separate corpora - a product catalog, its reviews,
and an FAQ - that you keep as distinct indexes. Multi-index search queries several loaded
indexes in a single call and returns the global top-K, with each result tagged by its source
index. See [`query_multi_index`](./classes/MossClient#query_multi_index-names-query-options)
in the reference.

## Usage

Load the indexes (in bulk with `load_indexes`), then query them together with
`query_multi_index`. Every result document carries an `index_name` so you know where it came
from.

```python theme={null}
import asyncio
from moss import MossClient, QueryOptions

async def main():
    client = MossClient(MOSS_PROJECT_ID, MOSS_PROJECT_KEY)
    indexes = ["products", "reviews", "faqs"]

    # Bulk-load (best-effort; one failure does not roll back the others).
    result = await client.load_indexes(indexes)
    print(f"loaded={result.loaded} failed={result.failed}")

    # One query across all three; global top-K, tagged by source.
    results = await client.query_multi_index(
        indexes, "wireless headphones battery life", QueryOptions(top_k=6)
    )
    for doc in results.docs:
        print(f"[{doc.index_name}] {doc.id} score={doc.score:.3f} {doc.text[:60]}")

    await client.unload_indexes(indexes)

asyncio.run(main())
```

## Behavior notes

* All indexes must be loaded locally (via
  [`load_index`](./classes/MossClient#load_index-name-auto_refresh-polling_interval_in_seconds)
  or [`load_indexes`](./classes/MossClient#load_indexes-names-auto_refresh-polling_interval_in_seconds))
  and share the same embedding model.
* `top_k` is global, not per-index - it caps the merged result set.
* Multi-index search is embedding-only: `QueryOptions.alpha` is ignored (forced to `1.0`),
  because BM25 scoring across separate corpora is unsound (IDF is per-corpus). `filter` and
  `embedding` work the same as in single-index
  [`query`](./classes/MossClient#query-name-query-options).

## Bulk lifecycle

`load_indexes(names)` returns a
[`LoadIndexesResult`](./interfaces/LoadIndexesResult) with `loaded` and `failed`. It is
best-effort: a typo in one name does not roll back the others, and reloading an
already-loaded index is idempotent.
[`unload_indexes(names)`](./classes/MossClient#unload_indexes-names) releases them when you
are done.

```python theme={null}
# A typo on one name does not stop the others from loading.
partial = await client.load_indexes(["products", "does-not-exist-xyz"])
print(partial.loaded, partial.failed)
```

## Related

<CardGroup cols={2}>
  <Card title="Hybrid search" icon="scale-balanced" href="./hybrid-search">
    Single-index alpha blending (multi-index is embedding-only).
  </Card>

  <Card title="MossClient reference" icon="cube" href="./classes/MossClient">
    `query_multi_index`, `load_indexes`, `unload_indexes`.
  </Card>
</CardGroup>

---

_Source: https://docs.moss.dev/docs/reference/python/multi-index-search.md_
