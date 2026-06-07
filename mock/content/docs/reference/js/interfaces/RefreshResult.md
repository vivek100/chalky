> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# RefreshResult

[@moss-dev/moss](../api) / RefreshResult

# Interface: RefreshResult

Result of an index refresh operation. Reports whether a loaded index was updated
with a newer version from the cloud.

## Properties

| Property            | Type      | Description                                                                     |
| ------------------- | --------- | ------------------------------------------------------------------------------- |
| `indexName`         | `string`  | Name of the index that was refreshed.                                           |
| `previousUpdatedAt` | `string`  | Timestamp before the refresh operation.                                         |
| `newUpdatedAt`      | `string`  | Timestamp after the refresh operation.                                          |
| `wasUpdated`        | `boolean` | Whether the index was actually updated (true if the cloud had a newer version). |

---

_Source: https://docs.moss.dev/docs/reference/js/interfaces/RefreshResult.md_
