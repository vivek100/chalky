> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# QueryOptions

[moss v1.0.1](../README)

[moss](../api) / QueryOptions

# Interface: QueryOptions

Optional parameters for `MossClient.query()`.

## Properties

| Property    | Type                        | Description                                                                                                                                |
| ----------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `embedding` | `Optional[Sequence[float]]` | Caller-provided query embedding. When supplied, the service/client skips embedding generation.                                             |
| `top_k`     | `Optional[int]`             | Number of top results to return.                                                                                                           |
| `alpha`     | `Optional[float]`           | Weight for hybrid search fusion. `1.0` = pure semantic, `0.0` = pure keyword. **Default** `0.8`.                                           |
| `filter`    | `Optional[dict]`            | Metadata filter applied to the query. Honored on locally loaded indexes; load the index (or open a session) before querying with a filter. |

## Filter shape

The `filter` value is a dict with either a field condition or a logical
composition:

```python theme={null}
# Field condition
{"field": "city", "condition": {"$eq": "NYC"}}

# Logical composition
{"$and": [filter_a, filter_b, ...]}
{"$or":  [filter_a, filter_b, ...]}
```

Supported condition operators: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`,
`$in`, `$nin`, `$near`.

## Example

```python theme={null}
from moss import QueryOptions

options = QueryOptions(
    top_k=5,
    alpha=0.6,
    filter={
        "$and": [
            {"field": "category", "condition": {"$eq": "shoes"}},
            {"field": "price",    "condition": {"$lt": 100}},
        ],
    },
)
```

---

_Source: https://docs.moss.dev/docs/reference/python/interfaces/QueryOptions.md_
