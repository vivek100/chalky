> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Retrieval

> Choose vector, keyword, or hybrid retrieval

Moss supports three retrieval strategies, all over the same query call:

* **Vector similarity** (semantic) - matches on meaning
* **Keyword / BM25** - matches on exact terms
* **Hybrid** - blends both, tuned with `alpha`

An index must be loaded before you query it. Call
[`load_index()`](/docs/reference/python/classes/MossClient#load_index-name-auto_refresh-polling_interval_in_seconds)
(or open a [session](/docs/integrate/sessions)) first; queries then run entirely in-memory
(\~1-10 ms).

## Basic query

<CodeGroup>
  ```ts JavaScript theme={null}
  import { MossClient } from '@moss-dev/moss'
  const client = new MossClient(process.env.MOSS_PROJECT_ID!, process.env.MOSS_PROJECT_KEY!)
  await client.loadIndex('my-index')
  const results = await client.query('my-index', 'getting started latency', { topK: 5 })
  ```

  ```python Python theme={null}
  from moss import MossClient, QueryOptions
  import os

  client = MossClient(os.getenv("MOSS_PROJECT_ID"), os.getenv("MOSS_PROJECT_KEY"))
  await client.load_index("my-index")
  results = await client.query("my-index", "getting started latency", QueryOptions(top_k=5))
  ```
</CodeGroup>

## Go deeper

<CardGroup cols={2}>
  <Card title="Hybrid search" icon="scale-balanced" href="/docs/integrate/hybrid-search">
    Blend semantic and keyword scoring with `alpha`.
  </Card>

  <Card title="Metadata filtering" icon="filter" href="/docs/integrate/metadata-filtering">
    Narrow results by document metadata.
  </Card>

  <Card title="Custom embeddings" icon="vector-square" href="/docs/integrate/custom-embeddings">
    Bring your own query and document vectors.
  </Card>

  <Card title="Multi-index search" icon="layer-group" href="/docs/integrate/multi-index-search">
    Query several loaded indexes in one call.
  </Card>
</CardGroup>

## Tuning

* Adjust `topK` / `top_k` and score thresholds
* Layer metadata filters to narrow candidate sets
* Group queries by intent (returns, billing, onboarding) and tune per index
* Choose model per index: `moss-minilm` (fast) or `moss-mediumlm` (more accurate)

---

_Source: https://docs.moss.dev/docs/integrate/retrieval.md_
