> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# PushIndexResult

[moss v1.4.0](../README)

[moss](../api) / PushIndexResult

# Interface: PushIndexResult

The result of [`SessionIndex.push_index()`](../classes/SessionIndex#push_index) -
returned when a local session index is persisted to the cloud.

## Properties

* **job\_id**: `str` - ID of the background job that builds the cloud index. Pass to [`MossClient.get_job_status()`](../classes/MossClient#get_job_status-job_id) to track progress.
* **index\_name**: `str` - Name of the cloud index that was created or replaced.
* **doc\_count**: `int` - Number of documents pushed.
* **status**: `str` - Status of the push operation.

---

_Source: https://docs.moss.dev/docs/reference/python/interfaces/PushIndexResult.md_
