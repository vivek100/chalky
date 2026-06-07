> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# MetadataFilter

[@moss-dev/moss](../api) / MetadataFilter

# Type Alias: MetadataFilter

Composable metadata filter passed to [`QueryOptions.filter`](../interfaces/QueryOptions). Metadata
filtering narrows query results to only documents whose metadata satisfies the filter. It is
evaluated on the loaded (local) index; load the index via `loadIndex()` before querying.

```ts theme={null}
type MetadataFilter =
  | { field: string; condition: FilterCondition }
  | { $and: MetadataFilter[] }
  | { $or:  MetadataFilter[] };
```

## Shapes

* **Field condition** - compare a single metadata field using a [`FilterCondition`](./FilterCondition) operator.
* **`$and`** - logical AND of nested filters; a document must satisfy every entry.
* **`$or`** - logical OR of nested filters; a document must satisfy at least one entry.

## Example

```ts theme={null}
import { MossClient } from '@moss-dev/moss';

const client = new MossClient(projectId, projectKey);
await client.loadIndex('products');

const results = await client.query('products', 'running shoes', {
  topK: 5,
  alpha: 0.6,
  filter: {
    $and: [
      { field: 'category', condition: { $eq: 'shoes' } },
      { field: 'price',    condition: { $lt: 100 } },
    ],
  },
});
```

---

_Source: https://docs.moss.dev/docs/reference/js/type-aliases/MetadataFilter.md_
