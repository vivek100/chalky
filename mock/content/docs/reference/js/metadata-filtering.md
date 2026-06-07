> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Metadata filtering

> Narrow JavaScript query results to documents whose metadata matches a filter.

Attach metadata to documents at index time, then constrain queries to the documents whose
metadata matches a filter. Filtering is evaluated on the locally loaded index, so call
[`loadIndex()`](./classes/MossClient#loadindex) (or open a [session](./sessions)) before
querying with a filter. The filter is passed as
[`QueryOptions.filter`](./interfaces/QueryOptions).

## Operators

A single condition compares one metadata field with a
[`FilterCondition`](./type-aliases/FilterCondition) operator.

| Operator                     | Meaning                                                          |
| ---------------------------- | ---------------------------------------------------------------- |
| `$eq`, `$ne`                 | equals / not equals                                              |
| `$gt`, `$gte`, `$lt`, `$lte` | greater / less than                                              |
| `$in`, `$nin`                | value in / not in a list                                         |
| `$near`                      | within a haversine distance of a point: `"lat,lng,radiusMeters"` |

Compose multiple conditions with `$and` / `$or` (nestable). A single condition can be passed
on its own without a wrapper. See [`MetadataFilter`](./type-aliases/MetadataFilter) for the
full filter shape.

## Examples

```typescript theme={null}
import { MossClient } from '@moss-dev/moss'

const client = new MossClient(process.env.MOSS_PROJECT_ID!, process.env.MOSS_PROJECT_KEY!)

await client.createIndex('catalog', [
  { id: 'doc1', text: 'Running shoes with breathable mesh for daily training.',
    metadata: { category: 'shoes', price: '79', city: 'new-york', location: '40.7580,-73.9855' } },
  { id: 'doc2', text: 'Trail running shoes built for rocky terrain.',
    metadata: { category: 'shoes', price: '149', city: 'seattle', location: '47.6062,-122.3321' } },
  { id: 'doc3', text: 'Lightweight city backpack with laptop compartment.',
    metadata: { category: 'bags', price: '95', city: 'new-york', location: '40.7505,-73.9934' } },
])

await client.loadIndex('catalog') // required before filtering

// $eq - a single condition needs no wrapper.
await client.query('catalog', 'running gear', {
  topK: 5,
  filter: { field: 'category', condition: { $eq: 'shoes' } },
})

// $and - shoes under $100.
await client.query('catalog', 'running shoes', {
  topK: 5,
  alpha: 0.6,
  filter: {
    $and: [
      { field: 'category', condition: { $eq: 'shoes' } },
      { field: 'price',    condition: { $lt: 100 } },
    ],
  },
})

// $or - refund or upgrade topics.
await client.query('catalog', 'city essentials', {
  topK: 5,
  filter: {
    $or: [
      { field: 'city', condition: { $eq: 'new-york' } },
      { field: 'city', condition: { $eq: 'seattle' } },
    ],
  },
})

// $in - city in a set.
await client.query('catalog', 'city essentials', {
  topK: 5,
  filter: { field: 'city', condition: { $in: ['new-york', 'seattle'] } },
})

// $near - within 5km of Times Square.
await client.query('catalog', 'city products', {
  topK: 5,
  filter: { field: 'location', condition: { $near: '40.7580,-73.9855,5000' } },
})
```

## Filtering inside a session

The same filter syntax works on a [session](./sessions) query, evaluated entirely in-memory.

```typescript theme={null}
const session = await client.session('call-123')
await session.addDocs([
  { id: 't1', text: 'Customer opened the call about an incorrect charge.',
    metadata: { speaker: 'agent', topic: 'billing', priority: '3' } },
  { id: 't2', text: 'I need a full refund for the duplicate charge.',
    metadata: { speaker: 'customer', topic: 'refund', priority: '5' } },
])

// Customer turns about refunds only.
await session.query('what did the customer want', {
  topK: 5,
  filter: {
    $and: [
      { field: 'speaker', condition: { $eq: 'customer' } },
      { field: 'topic',   condition: { $eq: 'refund' } },
    ],
  },
})
```

## Related

* [Hybrid search](./hybrid-search) - blend semantic and keyword scoring.
* [Sessions](./sessions) - filter inside a live session.
* [MetadataFilter](./type-aliases/MetadataFilter) and [FilterCondition](./type-aliases/FilterCondition) - filter types.
* [SDK reference](./api) - the full JavaScript SDK overview.

---

_Source: https://docs.moss.dev/docs/reference/js/metadata-filtering.md_
