> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# IndexInfo

[@moss-dev/moss](../api) / IndexInfo

# Interface: IndexInfo

Information about an index including metadata and status.

## Properties

| Property    | Type                                                      | Description                          |
| ----------- | --------------------------------------------------------- | ------------------------------------ |
| `id`        | `string`                                                  | Unique identifier of the index.      |
| `name`      | `string`                                                  | Human-readable name of the index.    |
| `version`   | `string` \| `null`                                        | Index build/format version (semver). |
| `status`    | `"NotStarted"` \| `"Building"` \| `"Ready"` \| `"Failed"` | Current status of the index.         |
| `docCount`  | `number`                                                  | Number of documents in the index.    |
| `createdAt` | `string`                                                  | When the index was created.          |
| `updatedAt` | `string`                                                  | When the index was last updated.     |
| `model`     | [`ModelRef`](./ModelRef)                                  | Model used for embeddings.           |

---

_Source: https://docs.moss.dev/docs/reference/js/interfaces/IndexInfo.md_
