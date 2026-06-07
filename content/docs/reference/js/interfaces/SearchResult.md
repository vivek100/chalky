> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# SearchResult

[@moss-dev/moss](../api) / SearchResult

# Interface: SearchResult

Search operation result.

## Properties

| Property         | Type                                                      | Description                                       |
| ---------------- | --------------------------------------------------------- | ------------------------------------------------- |
| `docs`           | [`QueryResultDocumentInfo`](./QueryResultDocumentInfo)\[] | Matching documents ordered by similarity score.   |
| `query`          | `string`                                                  | The original search query.                        |
| `indexName?`     | `string`                                                  | Name of the index that was searched.              |
| `timeTakenInMs?` | `number`                                                  | Time taken to execute the search in milliseconds. |

---

_Source: https://docs.moss.dev/docs/reference/js/interfaces/SearchResult.md_
