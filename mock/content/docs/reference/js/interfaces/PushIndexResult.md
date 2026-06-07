> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# PushIndexResult

[@moss-dev/moss](../api) / PushIndexResult

# Interface: PushIndexResult

Returned by [`SessionIndex.pushIndex()`](../classes/SessionIndex#pushindex) when a local
session is persisted to the cloud.

## Properties

| Property    | Type     | Description                                                                                                                             |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `jobId`     | `string` | ID of the background job that builds the cloud index. Pass to [`getJobStatus()`](../classes/MossClient#getjobstatus) to track progress. |
| `indexName` | `string` | Name of the cloud index that was created or replaced.                                                                                   |
| `docCount`  | `number` | Number of documents pushed.                                                                                                             |
| `status`    | `string` | Status of the push operation.                                                                                                           |

---

_Source: https://docs.moss.dev/docs/reference/js/interfaces/PushIndexResult.md_
