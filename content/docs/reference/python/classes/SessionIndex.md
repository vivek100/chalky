> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# SessionIndex

> Local, in-session index for real-time indexing and querying.

[moss v1.4.0](../README)

[moss](../api) / SessionIndex

# SessionIndex

A local, in-session index for real-time indexing and querying.

All operations (`add_docs`, `delete_docs`, `query`) run entirely in-memory with no
cloud round trips (\~1-10 ms). Open a session with
[`MossClient.session()`](./MossClient#session-index_name-model_id), which auto-loads an
existing cloud index by name or starts empty. Call `push_index()` at the end of the
session to persist the index to the cloud for future retrieval.

```python theme={null}
# Auto-loads from cloud if the index exists, starts fresh if not
session = await client.session(index_name="session-abc")

await session.add_docs([DocumentInfo(id="1", text="Customer asked about billing")])
results = await session.query("billing question")

result = await session.push_index()
# optionally: await client.get_job_status(result.job_id)
```

## Properties

* **name** (`str`): The index name.
* **doc\_count** (`int`): Number of documents in the local session index.

## Methods

### `add_docs(docs, options)`

Add or update documents in the local session index. Embeddings are generated locally
via the Rust core - no cloud round trip. When the session uses `model_id="custom"`, each
document must have `.embedding` set.

#### Parameters

* **docs** (List\[[`DocumentInfo`](../interfaces/DocumentInfo)])
* **options** (Optional\[[`MutationOptions`](../interfaces/MutationOptions)] = `None`)

#### Returns

`Tuple[int, int]` - `(added_count, updated_count)`

***

### `delete_docs(doc_ids)`

Delete documents from the local session index by their IDs.

#### Parameters

* **doc\_ids** (`List[str]`)

#### Returns

`int` - the number of documents deleted.

***

### `get_docs(options)`

Retrieve documents from the local session index.

#### Parameters

* **options** (Optional\[[`GetDocumentsOptions`](../interfaces/GetDocumentsOptions)] = `None`)

#### Returns

List\[[`DocumentInfo`](../interfaces/DocumentInfo)]

***

### `query(query, options)`

Perform a semantic search over the local session index. Runs entirely in-memory
(\~1-10 ms) with no cloud call. Supports the same metadata filter syntax as
[`MossClient.query()`](./MossClient#query-name-query-options).

When the session uses `model_id="custom"`, provide a query embedding via
`QueryOptions.embedding`.

#### Parameters

* **query** (`str`)
* **options** (Optional\[[`QueryOptions`](../interfaces/QueryOptions)] = `None`)

#### Returns

[`SearchResult`](../interfaces/SearchResult)

***

### `push_index()`

Push the local session index to the cloud. Sends all documents with their
locally-computed embeddings to the backend; the cloud index is created or replaced if
one already exists with the same name. No server-side re-embedding occurs.

#### Returns

[`PushIndexResult`](../interfaces/PushIndexResult)

---

_Source: https://docs.moss.dev/docs/reference/python/classes/SessionIndex.md_
