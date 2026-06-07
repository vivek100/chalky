> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# MossClient

> Semantic search client for vector similarity operations.

[moss v1.4.0](../README)

[moss](../api) / MossClient

# MossClient

Semantic search client for vector similarity operations.

All mutations and reads go through the Rust core. Querying runs against an index that
has been loaded into memory with [`load_index()`](#load_index-name-auto_refresh-polling_interval_in_seconds)
(or [`load_indexes()`](#load_indexes-names-auto_refresh-polling_interval_in_seconds)) -
load the index before you query it.

For real-time, local-first indexing during a live interaction, use
[`session()`](#session-index_name-model_id), which returns a
[`SessionIndex`](./SessionIndex).

## Methods

### `create_index(name, docs, model_id)`

Create a new index and populate it with documents.

When `model_id` is omitted, the SDK picks `"moss-minilm"` when no documents
carry pre-computed embeddings and `"custom"` when every document provides an
`embedding`. Mixed documents are rejected.

#### Parameters

* **name** (`str`)
* **docs** (List\[[`DocumentInfo`](../interfaces/DocumentInfo)])
* **model\_id** (`Optional[str]` = `None`)

#### Returns

[`MutationResult`](../interfaces/MutationResult)

***

### `add_docs(name, docs, options)`

Add or update documents in an index.

#### Parameters

* **name** (`str`)
* **docs** (List\[[`DocumentInfo`](../interfaces/DocumentInfo)])
* **options** (Optional\[[`MutationOptions`](../interfaces/MutationOptions)] = `None`)

#### Returns

[`MutationResult`](../interfaces/MutationResult)

***

### `delete_docs(name, doc_ids)`

Delete documents from an index by their IDs.

#### Parameters

* **name** (`str`)
* **doc\_ids** (`List[str]`)

#### Returns

[`MutationResult`](../interfaces/MutationResult)

***

### `get_job_status(job_id)`

Get the status of a bulk operation job.

#### Parameters

* **job\_id** (`str`)

#### Returns

[`JobStatusResponse`](../interfaces/JobStatusResponse)

***

### `get_index(name)`

Get information about a specific index.

#### Parameters

* **name** (`str`)

#### Returns

[`IndexInfo`](../interfaces/IndexInfo)

***

### `list_indexes()`

List all indexes with their information.

#### Returns

List\[[`IndexInfo`](../interfaces/IndexInfo)]

***

### `delete_index(name)`

Delete an index and all its data.

#### Parameters

* **name** (`str`)

#### Returns

`bool`

***

### `get_docs(name, options)`

Retrieve documents from an index.

#### Parameters

* **name** (`str`)
* **options** (Optional\[[`GetDocumentsOptions`](../interfaces/GetDocumentsOptions)] = `None`)

#### Returns

List\[[`DocumentInfo`](../interfaces/DocumentInfo)]

***

### `load_index(name, auto_refresh, polling_interval_in_seconds)`

Downloads an index from the cloud into memory for fast local querying. An index must be
loaded before you can [`query()`](#query-name-query-options) it; once loaded, queries run
entirely in-memory (\~1-10 ms). Set `auto_refresh=True` to keep the loaded index in sync
with cloud updates by polling every `polling_interval_in_seconds`.

#### Parameters

* **name** (`str`)
* **auto\_refresh** (`bool` = `False`)
* **polling\_interval\_in\_seconds** (`int` = `600`)

#### Returns

`str`

***

### `unload_index(name)`

Unload an index from memory.

#### Parameters

* **name** (`str`)

***

### `query(name, query, options)`

Perform a semantic similarity search against a loaded index. Call
[`load_index(name)`](#load_index-name-auto_refresh-polling_interval_in_seconds) first;
queries then run entirely in-memory (\~1-10 ms). Metadata filtering is supported on
locally loaded indexes.

#### Parameters

* **name** (`str`)
* **query** (`str`)
* **options** (Optional\[[`QueryOptions`](../interfaces/QueryOptions)] = `None`): Query options (`top_k`, `alpha`, `embedding`, `filter`).

#### Returns

[`SearchResult`](../interfaces/SearchResult)

***

### `query_multi_index(names, query, options)`

Search across multiple loaded indexes and return the global top-K. All requested indexes
must be loaded locally and share the same embedding model. Each result document is tagged
with its source `index_name`.

`options.top_k` is the **global** cap across the merged result. See [Multi-index search](/docs/integrate/multi-index-search).

#### Parameters

* **names** (`List[str]`): Non-empty list of loaded index names.
* **query** (`str`)
* **options** (Optional\[[`QueryOptions`](../interfaces/QueryOptions)] = `None`)

#### Returns

[`SearchResult`](../interfaces/SearchResult) - `docs` carry `index_name` per result.

***

### `load_indexes(names, auto_refresh, polling_interval_in_seconds)`

Bulk-load many indexes into memory. Best-effort: a failure on one name does not roll back
the others. `auto_refresh` and `polling_interval_in_seconds` apply to the whole batch.

#### Parameters

* **names** (`List[str]`)
* **auto\_refresh** (`bool` = `False`)
* **polling\_interval\_in\_seconds** (`int` = `600`)

#### Returns

[`LoadIndexesResult`](../interfaces/LoadIndexesResult)

***

### `unload_indexes(names)`

Bulk-unload many indexes from memory. Idempotent for names that aren't loaded.

#### Parameters

* **names** (`List[str]`)

***

### `session(index_name, model_id)`

Create or resume a local, real-time [`SessionIndex`](./SessionIndex). If a cloud index with
the given name already exists, it is auto-loaded into the session (no re-embedding);
otherwise the session starts empty. The `index_name` is also the target when
[`push_index()`](./SessionIndex#push_index) is later called.

Raises `ValueError` if an existing cloud index uses a different model than an explicit
`model_id`. See the [Sessions guide](/docs/integrate/sessions).

#### Parameters

* **index\_name** (`str`)
* **model\_id** (`Optional[str]` = `None`): Local embedding model. Defaults to `"moss-minilm"`. Other options: `"moss-mediumlm"`, `"custom"`.

#### Returns

[`SessionIndex`](./SessionIndex)

---

_Source: https://docs.moss.dev/docs/reference/python/classes/MossClient.md_
