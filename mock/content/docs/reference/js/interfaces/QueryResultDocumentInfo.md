> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# QueryResultDocumentInfo

[@moss-dev/moss](../api) / QueryResultDocumentInfo

# Interface: QueryResultDocumentInfo

Document result from a query with similarity score.

## Extends

* [`DocumentInfo`](./DocumentInfo)

## Properties

| Property     | Type                          | Description                                     | Inherited from                                                                    |
| ------------ | ----------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------- |
| `id`         | `string`                      | Unique identifier within an index.              | [`DocumentInfo`](./DocumentInfo).[`id`](./DocumentInfo#property-id)               |
| `text`       | `string`                      | REQUIRED canonical text to embed/search.        | [`DocumentInfo`](./DocumentInfo).[`text`](./DocumentInfo#property-text)           |
| `metadata?`  | `Record`\<`string`, `string`> | Optional metadata associated with the document. | [`DocumentInfo`](./DocumentInfo).[`metadata`](./DocumentInfo#property-metadata)   |
| `embedding?` | `number`\[]                   | Optional caller-provided embedding vector.      | [`DocumentInfo`](./DocumentInfo).[`embedding`](./DocumentInfo#property-embedding) |
| `score`      | `number`                      | Similarity score (0-1, higher = more similar).  | -                                                                                 |

---

_Source: https://docs.moss.dev/docs/reference/js/interfaces/QueryResultDocumentInfo.md_
