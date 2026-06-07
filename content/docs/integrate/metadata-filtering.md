> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Metadata Filtering

> Narrow query results to documents whose metadata matches a filter.

Attach metadata to documents at index time, then constrain queries to the documents whose
metadata matches a filter. Filtering is evaluated on the **locally loaded index**, so call
[`load_index()`](/docs/reference/python/classes/MossClient#load_index-name-auto_refresh-polling_interval_in_seconds)
(or open a [session](/docs/integrate/sessions)) before querying with a filter.

## Operators

| Operator                     | Meaning                                                          |
| ---------------------------- | ---------------------------------------------------------------- |
| `$eq`, `$ne`                 | equals / not equals                                              |
| `$gt`, `$gte`, `$lt`, `$lte` | greater / less than                                              |
| `$in`, `$nin`                | value in / not in a list                                         |
| `$near`                      | within a haversine distance of a point: `"lat,lng,radiusMeters"` |

Compose multiple conditions with `$and` / `$or` (nestable). A single condition can be passed
on its own without a wrapper.

## Implementation

Runnable, per-language examples (catalog filters, geo `$near`, and filtering inside a
session) live in the SDK guides:

* [Python](/docs/reference/python/metadata-filtering)
* [JavaScript](/docs/reference/js/metadata-filtering)

## Related

<CardGroup cols={2}>
  <Card title="Hybrid search" icon="scale-balanced" href="/docs/integrate/hybrid-search">
    Blend semantic and keyword scoring.
  </Card>

  <Card title="Retrieval" icon="magnifying-glass" href="/docs/integrate/retrieval">
    Retrieval strategies overview.
  </Card>
</CardGroup>

---

_Source: https://docs.moss.dev/docs/integrate/metadata-filtering.md_
