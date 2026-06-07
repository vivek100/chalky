> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Metadata filtering

> Narrow query results to documents whose metadata matches a filter.

Attach metadata to documents at index time, then constrain queries to the documents whose
metadata matches a filter passed as [`QueryOptions.filter`](./interfaces/QueryOptions).
Filtering is evaluated on the locally loaded index, so call
[`load_index()`](./classes/MossClient#load_index-name-auto_refresh-polling_interval_in_seconds)
(or open a [session](./sessions)) before querying with a filter.

## Operators

| Operator                     | Meaning                                                          |
| ---------------------------- | ---------------------------------------------------------------- |
| `$eq`, `$ne`                 | equals / not equals                                              |
| `$gt`, `$gte`, `$lt`, `$lte` | greater / less than                                              |
| `$in`, `$nin`                | value in / not in a list                                         |
| `$near`                      | within a haversine distance of a point: `"lat,lng,radiusMeters"` |

Compose multiple conditions with `$and` / `$or` (nestable). A single condition can be passed
on its own without a wrapper.

## On a loaded index

```python theme={null}
import asyncio
from datetime import datetime
from moss import DocumentInfo, MossClient, QueryOptions

async def main():
    client = MossClient(MOSS_PROJECT_ID, MOSS_PROJECT_KEY)

    docs = [
        DocumentInfo(id="doc1", text="Running shoes with breathable mesh for daily training.",
                     metadata={"category": "shoes", "price": "79", "city": "new-york",
                               "location": "40.7580,-73.9855"}),
        DocumentInfo(id="doc2", text="Trail running shoes built for rocky terrain.",
                     metadata={"category": "shoes", "price": "149", "city": "seattle",
                               "location": "47.6062,-122.3321"}),
        DocumentInfo(id="doc3", text="Lightweight city backpack with laptop compartment.",
                     metadata={"category": "bags", "price": "95", "city": "new-york",
                               "location": "40.7505,-73.9934"}),
    ]

    index = f"catalog-{datetime.now():%Y%m%d-%H%M%S}"
    await client.create_index(index, docs)
    await client.load_index(index)   # required before filtering

    # $eq - a single condition needs no wrapper.
    await client.query(index, "running gear",
        QueryOptions(top_k=5, filter={"field": "category", "condition": {"$eq": "shoes"}}))

    # $and - shoes under $100.
    await client.query(index, "running shoes",
        QueryOptions(top_k=5, alpha=0.6, filter={"$and": [
            {"field": "category", "condition": {"$eq": "shoes"}},
            {"field": "price",    "condition": {"$lt": "100"}},
        ]}))

    # $in - city in a set.
    await client.query(index, "city essentials",
        QueryOptions(top_k=5, filter={"field": "city", "condition": {"$in": ["new-york"]}}))

    # $near - within 5km of Times Square.
    await client.query(index, "city products",
        QueryOptions(top_k=5, filter={"field": "location",
                                      "condition": {"$near": "40.7580,-73.9855,5000"}}))

asyncio.run(main())
```

## Inside a session

A [session](./sessions) query takes the same filter syntax, evaluated in-memory against the
local session index. The example below indexes a call transcript and applies a range of
operators.

```python theme={null}
session = await client.session(index_name="call-123")
await session.add_docs([
    DocumentInfo(id="t1", text="Customer opened the call about an incorrect charge.",
                 metadata={"speaker": "agent", "topic": "billing", "priority": "3"}),
    DocumentInfo(id="t2", text="I need a full refund for the duplicate charge of $49.99.",
                 metadata={"speaker": "customer", "topic": "refund", "priority": "5"}),
    DocumentInfo(id="t3", text="The refund will be processed within 3 to 5 business days.",
                 metadata={"speaker": "agent", "topic": "refund", "priority": "4"}),
])

# $eq - customer turns only.
await session.query("what did the customer say",
    QueryOptions(top_k=5, filter={"field": "speaker", "condition": {"$eq": "customer"}}))

# $ne - exclude agent turns.
await session.query("what was discussed",
    QueryOptions(top_k=5, filter={"field": "speaker", "condition": {"$ne": "agent"}}))

# $gt - priority > 3.
await session.query("urgent issues",
    QueryOptions(top_k=5, filter={"field": "priority", "condition": {"$gt": "3"}}))

# $or - refund or upgrade topics.
await session.query("account changes",
    QueryOptions(top_k=5, filter={"$or": [
        {"field": "topic", "condition": {"$eq": "refund"}},
        {"field": "topic", "condition": {"$eq": "upgrade"}},
    ]}))
```

## Related

<CardGroup cols={2}>
  <Card title="Hybrid search" icon="scale-balanced" href="./hybrid-search">
    Blend semantic and keyword scoring.
  </Card>

  <Card title="Sessions" icon="bolt" href="./sessions">
    Filter against a live local index.
  </Card>
</CardGroup>

---

_Source: https://docs.moss.dev/docs/reference/python/metadata-filtering.md_
