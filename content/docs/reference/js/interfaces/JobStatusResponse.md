> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# JobStatusResponse

[@moss-dev/moss](../api) / JobStatusResponse

# Interface: JobStatusResponse

Full job status response from getJobStatus.

## Properties

| Property       | Type                                             |
| -------------- | ------------------------------------------------ |
| `jobId`        | `string`                                         |
| `status`       | [`JobStatus`](../type-aliases/JobStatus)         |
| `progress`     | `number`                                         |
| `currentPhase` | [`JobPhase`](../type-aliases/JobPhase) \| `null` |
| `error?`       | `string` \| `null`                               |
| `createdAt`    | `string`                                         |
| `updatedAt`    | `string`                                         |
| `completedAt`  | `string` \| `null`                               |

---

_Source: https://docs.moss.dev/docs/reference/js/interfaces/JobStatusResponse.md_
