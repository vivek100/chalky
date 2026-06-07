> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# FilterCondition

[@moss-dev/moss](../api) / FilterCondition

# Type Alias: FilterCondition

A single condition evaluated against one metadata field inside a [`MetadataFilter`](./MetadataFilter).

```ts theme={null}
type FilterCondition =
  | { $eq:  string | number }
  | { $ne:  string | number }
  | { $gt:  string | number }
  | { $gte: string | number }
  | { $lt:  string | number }
  | { $lte: string | number }
  | { $in:  (string | number)[] }
  | { $nin: (string | number)[] }
  | { $near: string };
```

## Operators

| Operator | Description                                                                 |
| -------- | --------------------------------------------------------------------------- |
| `$eq`    | Field is equal to the given value.                                          |
| `$ne`    | Field is not equal to the given value.                                      |
| `$gt`    | Field is strictly greater than the value.                                   |
| `$gte`   | Field is greater than or equal to the value.                                |
| `$lt`    | Field is strictly less than the value.                                      |
| `$lte`   | Field is less than or equal to the value.                                   |
| `$in`    | Field matches any value in the array.                                       |
| `$nin`   | Field does not match any value in the array.                                |
| `$near`  | Geo-proximity match against the field (accepts an encoded location string). |

## Example

```ts theme={null}
// Documents whose `price` is between 50 and 100
{ field: 'price', condition: { $gte: 50 } }
{ field: 'price', condition: { $lt: 100 } }
```

---

_Source: https://docs.moss.dev/docs/reference/js/type-aliases/FilterCondition.md_
