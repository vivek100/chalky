> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Moss.Session

> Local in-session index for real-time embedding, search, and cloud sync.

[Elixir SDK](../api) / Moss.Session

# Moss.Session

A local, in-session index backed by the Rust core. Index documents in memory
during a live workflow (voice AI agents, chat) and query them with no cloud round
trips, then push the index to the cloud when done.

Sessions are opened with
[`Moss.Client.session/3`](./Client#session-client-index_name-opts), which handles
credentials and auto-loads from the cloud if an index with the given name already
exists. The functions below take the session reference returned by that call.

For built-in models (`"moss-minilm"`, `"moss-mediumlm"`), embeddings are computed
automatically in the Rust core. For `model_id: "custom"`, each document must set
`.embedding`, and [`query/3`](#query-session-query_text-opts) requires an
`:embedding` option.

## Example

```elixir theme={null}
{:ok, client} = Moss.Client.new("project-id", "project-key")
{:ok, session} = Moss.Client.session(client, "session-abc")

docs = [
  %Moss.DocumentInfo{id: "turn-1", text: "Customer: I need to cancel my subscription"},
  %Moss.DocumentInfo{id: "turn-2", text: "Agent: I can help with that. Can I ask why?"}
]

{:ok, {2, 0}} = Moss.Session.add_docs(session, docs)
{:ok, result} = Moss.Session.query(session, "subscription cancellation", top_k: 2)
{:ok, push_result} = Moss.Session.push_index(session)
```

## Methods

### `add_docs(session, docs, opts)`

Add or update documents in the session index, embedding them in the Rust core.
Returns the counts of documents added (new IDs) and updated (existing IDs).

For built-in models embeddings are computed automatically. For
`model_id: "custom"`, each document must have `.embedding` set.

#### Parameters

* **session** (`GenServer.server()`)
* **docs** (list of [`Moss.DocumentInfo`](../types#documentinfo))
* **opts** (`keyword()` = `[]`): supports `:upsert` (boolean, default `true`).

#### Returns

`{:ok, {added, updated}}` or `{:error, String.t()}`

```elixir theme={null}
{:ok, {2, 0}} = Moss.Session.add_docs(session, docs)
```

***

### `delete_docs(session, doc_ids)`

Delete documents from the session index by their IDs. Returns the number of
documents actually deleted (missing IDs are ignored).

#### Parameters

* **session** (`GenServer.server()`)
* **doc\_ids** (list of `String.t()`)

#### Returns

`non_neg_integer()`

```elixir theme={null}
deleted = Moss.Session.delete_docs(session, ["turn-1"])
```

***

### `get_docs(session, opts)`

Retrieve documents from the session index.

#### Parameters

* **session** (`GenServer.server()`)
* **opts** (`keyword()` = `[]`): supports `:doc_ids` (list of strings). When provided, only those documents are returned; otherwise all documents are returned.

#### Returns

`[Moss.DocumentInfo.t()]`

```elixir theme={null}
docs = Moss.Session.get_docs(session, doc_ids: ["turn-1"])
```

***

### `query(session, query_text, opts)`

Run a semantic similarity search against the session index. For built-in models
the query is embedded automatically in the Rust core. For `model_id: "custom"`,
pass the query embedding via the `:embedding` option. Metadata filtering is
supported.

#### Parameters

* **session** (`GenServer.server()`)
* **query\_text** (`String.t()`)
* **opts** (`keyword()` = `[]`): supports `:top_k` (integer, default `5`), `:alpha` (float, default `0.8`), `:filter` (map), and `:embedding` (list of floats, required for `model_id: "custom"`).

#### Returns

`{:ok, Moss.SearchResult.t()}` or `{:error, String.t()}`

```elixir theme={null}
{:ok, result} = Moss.Session.query(session, "subscription cancellation", top_k: 2, alpha: 0.6)
```

`alpha` tunes the hybrid blend: `1.0` is pure semantic, `0.0` is pure keyword,
and the default `0.8` is semantic-heavy.

***

### `load_index(session, index_name)`

Load an existing cloud index into this session. Returns the document count loaded.
After loading, the session behaves as a local index: subsequent add, delete, and
query operations run in memory without hitting the network.

#### Parameters

* **session** (`GenServer.server()`)
* **index\_name** (`String.t()`)

#### Returns

`{:ok, non_neg_integer()}` or `{:error, String.t()}`

```elixir theme={null}
{:ok, doc_count} = Moss.Session.load_index(session, "faqs")
```

***

### `push_index(session)`

Push the local session index to the cloud, creating or replacing the server-side
index. Returns a [`Moss.PushIndexResult`](../types#pushindexresult) with a
`job_id`; poll it with
[`Moss.Client.get_job_status/2`](./Client#get_job_status-client-job_id) until the
status is `ready`.

#### Parameters

* **session** (`GenServer.server()`)

#### Returns

`{:ok, Moss.PushIndexResult.t()}` or `{:error, String.t()}`

```elixir theme={null}
{:ok, push_result} = Moss.Session.push_index(session)
```

---

_Source: https://docs.moss.dev/docs/reference/elixir/classes/Session.md_
