> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# JobProgress

[@moss-dev/moss](../api) / JobProgress

# Interface: JobProgress

Progress update passed to the `onProgress` callback during async operations.

## Properties

| Property       | Type                                             |
| -------------- | ------------------------------------------------ |
| `jobId`        | `string`                                         |
| `status`       | [`JobStatus`](../type-aliases/JobStatus)         |
| `progress`     | `number`                                         |
| `currentPhase` | [`JobPhase`](../type-aliases/JobPhase) \| `null` |

---

_Source: https://docs.moss.dev/docs/reference/js/interfaces/JobProgress.md_
