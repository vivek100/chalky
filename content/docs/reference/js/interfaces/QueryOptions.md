> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# QueryOptions

[@moss-dev/moss](../api) / QueryOptions

# Interface: QueryOptions

Optional parameters for semantic queries.

## Properties

| Property     | Type                                               | Description                                                                                                                                                                                |
| ------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `embedding?` | `number`\[]                                        | Caller-provided embedding vector. When supplied, the service/client skips embedding generation.                                                                                            |
| `topK?`      | `number`                                           | Number of top results to return. Overrides method-level defaults.                                                                                                                          |
| `alpha?`     | `number`                                           | Weight for hybrid search fusion. `1.0` = pure semantic, `0.0` = pure keyword. **Default** `0.8`.                                                                                           |
| `filter?`    | [`MetadataFilter`](../type-aliases/MetadataFilter) | Optional metadata filter applied to the query. Supports field conditions and `$and` / `$or` composition. See [`FilterCondition`](../type-aliases/FilterCondition) for supported operators. |

---

_Source: https://docs.moss.dev/docs/reference/js/interfaces/QueryOptions.md_
