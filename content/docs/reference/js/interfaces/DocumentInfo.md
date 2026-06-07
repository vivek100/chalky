> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# DocumentInfo

[@moss-dev/moss](../api) / DocumentInfo

# Interface: DocumentInfo

Document that can be indexed and retrieved.

## Extended by

* [`QueryResultDocumentInfo`](./QueryResultDocumentInfo)

## Properties

| Property     | Type                          | Description                                     |
| ------------ | ----------------------------- | ----------------------------------------------- |
| `id`         | `string`                      | Unique identifier within an index.              |
| `text`       | `string`                      | REQUIRED canonical text to embed/search.        |
| `metadata?`  | `Record`\<`string`, `string`> | Optional metadata associated with the document. |
| `embedding?` | `number`\[]                   | Optional caller-provided embedding vector.      |

---

_Source: https://docs.moss.dev/docs/reference/js/interfaces/DocumentInfo.md_
