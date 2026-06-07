> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Hybrid Search

> Blend semantic and keyword scoring with a single alpha parameter.

Semantic (vector) search captures meaning; keyword (BM25) search captures exact terms.
Hybrid search blends both with one parameter, `alpha`, so you can tune relevance per query
or per index. As with all queries, load the index first (or open a
[session](/docs/integrate/sessions)).

## The `alpha` parameter

| `alpha` | Behavior                                           |
| ------- | -------------------------------------------------- |
| `1.0`   | Pure semantic (embeddings only)                    |
| `0.0`   | Pure keyword (BM25 only)                           |
| between | Blends the two; default is semantic-heavy at `0.8` |

## Choosing alpha

* Lower `alpha` (toward keyword) when queries contain exact identifiers, SKUs, names, or jargon.
* Higher `alpha` (toward semantic) when queries are natural-language paraphrases.
* Tune per index and per intent (returns, billing, onboarding, etc.).

## Implementation

Runnable, per-language examples live in the SDK guides:

* [Python](/docs/reference/python/hybrid-search)
* [JavaScript](/docs/reference/js/hybrid-search)

## Related

<CardGroup cols={2}>
  <Card title="Metadata filtering" icon="filter" href="/docs/integrate/metadata-filtering">
    Constrain results by document metadata.
  </Card>

  <Card title="Custom embeddings" icon="vector-square" href="/docs/integrate/custom-embeddings">
    Bring your own vectors.
  </Card>
</CardGroup>

---

_Source: https://docs.moss.dev/docs/integrate/hybrid-search.md_
