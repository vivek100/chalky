> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Multi-Index Search

> Search across multiple loaded indexes in one call and get a global top-K.

Sometimes the answer is spread across separate corpora - a product catalog, its reviews,
and an FAQ - that you keep as distinct indexes. **Multi-index search** queries several
loaded indexes in a single call and returns the global top-K, with each result tagged by
its source index.

## How it works

Load the indexes (in bulk with `load_indexes`), then query them together with
`query_multi_index`. Every result document carries an `index_name` so you know where it
came from.

## Behavior

* **All indexes must be loaded** locally (via `load_index` / `load_indexes`) and **share
  the same embedding model**.
* **`top_k` is global**, not per-index - it caps the merged result set.
* **Embedding-only**: scoring uses vectors, so `alpha` is ignored (BM25 is unsound across
  separate corpora, where term statistics differ). `filter` and `embedding` work the same
  as in a single-index query.
* **Bulk lifecycle**:
  [`load_indexes(names)`](/docs/reference/python/classes/MossClient#load_indexes-names-auto_refresh-polling_interval_in_seconds)
  returns a [`LoadIndexesResult`](/docs/reference/python/interfaces/LoadIndexesResult) with
  `loaded` and `failed` (best-effort; a typo in one name doesn't roll back the others), and
  [`unload_indexes(names)`](/docs/reference/python/classes/MossClient#unload_indexes-names)
  releases them and is idempotent.

## Implementation

Multi-index search is a Python SDK capability. See the
[Python guide](/docs/reference/python/multi-index-search) for a runnable example.

## Related

<CardGroup cols={2}>
  <Card title="Retrieval" icon="magnifying-glass" href="/docs/integrate/retrieval">
    Single-index querying, filters, and hybrid search.
  </Card>

  <Card title="Python reference" icon="python" href="/docs/reference/python/classes/MossClient">
    `query_multi_index`, `load_indexes`, `unload_indexes`.
  </Card>
</CardGroup>

---

_Source: https://docs.moss.dev/docs/integrate/multi-index-search.md_
