> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# LoadIndexesResult

[moss v1.4.0](../README)

[moss](../api) / LoadIndexesResult

# Interface: LoadIndexesResult

The result of [`MossClient.load_indexes()`](../classes/MossClient#load_indexes-names-auto_refresh-polling_interval_in_seconds).
Bulk loading is best-effort - failures on individual names do not roll back successes.

## Properties

* **loaded**: `List[str]` - Names of the indexes that loaded successfully.
* **failed**: `Dict[str, str]` - Mapping of index name → error message for the names that failed to load.

---

_Source: https://docs.moss.dev/docs/reference/python/interfaces/LoadIndexesResult.md_
