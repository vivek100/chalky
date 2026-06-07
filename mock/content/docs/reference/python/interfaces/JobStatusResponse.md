> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# JobStatusResponse

[moss v1.0.1](../README)

[moss](../api) / JobStatusResponse

# Interface: JobStatusResponse

Full status response from get\_job\_status.

## Properties

* **job\_id**: `str`
* **status**: [`JobStatus`](./JobStatus)
* **progress**: `float`
* **current\_phase**: Optional\[[`JobPhase`](./JobPhase)]
* **error**: `Optional[str]`
* **created\_at**: `str`
* **updated\_at**: `str`
* **completed\_at**: `Optional[str]`

---

_Source: https://docs.moss.dev/docs/reference/python/interfaces/JobStatusResponse.md_
