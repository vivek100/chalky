> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Sessions

> Index and query locally in real time with a SessionIndex, then push to the cloud.

A session is a local, in-process index you read and write in real time, with no cloud round
trip on any operation. Sessions are how the Python SDK does indexing during a live
interaction: indexing transcript turns mid-call, building a per-user working set, or
accumulating context that is handed off between agents.

A session is a [`SessionIndex`](./classes/SessionIndex), created from
[`client.session()`](./classes/MossClient#session-index_name-model_id). For the full method
list, see the [SDK reference](./api).

## Create or resume

`client.session(index_name=...)` returns a `SessionIndex`. If a cloud index with that name
already exists, it auto-loads into the session (no re-embedding); otherwise the session
starts empty. The workflow is identical in both cases, so you do not branch on whether the
index exists.

```python theme={null}
import asyncio
from moss import DocumentInfo, MossClient, QueryOptions

async def main():
    client = MossClient(MOSS_PROJECT_ID, MOSS_PROJECT_KEY)

    # Auto-loads from cloud if the index exists, starts fresh if not.
    session = await client.session(index_name="my-session-index")
    print(f"{session.doc_count} existing docs loaded")

asyncio.run(main())
```

## Mutate and query locally

`add_docs`, `delete_docs`, and `get_docs` run in-memory; `add_docs` embeds locally via the
Rust core with no network call. `query` also runs entirely in-memory (\~1-10 ms) and supports
the same metadata filter syntax as [`client.query()`](./classes/MossClient#query-name-query-options).

```python theme={null}
session = await client.session(index_name="call-123")

# Add or update docs - appended to whatever was loaded.
added, updated = await session.add_docs([
    DocumentInfo(id="turn-1", text="Customer reported a duplicate charge on their March invoice."),
    DocumentInfo(id="turn-2", text="Agent confirmed the refund would arrive in 3-5 business days."),
])
print(f"{added} added, {updated} updated (total: {session.doc_count})")

# Query locally.
results = await session.query("refund timeline", QueryOptions(top_k=3))
for doc in results.docs:
    print(f"{doc.id} score={doc.score:.3f} {doc.text}")

# Fetch and delete by id, all in-memory.
some = await session.get_docs()
await session.delete_docs(["turn-1"])
```

## Persist to the cloud

`push_index()` uploads the session - documents and their locally-computed embeddings - to
the cloud under the session's name, creating or replacing that index. No server-side
re-embedding occurs.

```python theme={null}
result = await session.push_index()
print(f"Pushed {result.doc_count} docs (job {result.job_id}) status={result.status}")
```

## Extend an existing index

Because `session()` resumes by name, the same code extends an index across runs. Resume,
append new documents, then push back to overwrite the cloud copy with the combined set.

```python theme={null}
session = await client.session(index_name="my-session-index")  # loads prior docs

await session.add_docs([
    DocumentInfo(id="follow-up-1", text="Customer called back to confirm the refund was received."),
    DocumentInfo(id="follow-up-2", text="Refund of $49.99 appeared on the statement within 3 days."),
])

results = await session.query("refund outcome and customer satisfaction", QueryOptions(top_k=3))
await session.push_index()   # creates or overwrites the cloud index
```

## Live-call context: short-term plus long-term

A session is short-term context - the working set for the current interaction. A persistent
cloud index loaded with [`load_index()`](./classes/MossClient#load_index-name-auto_refresh-polling_interval_in_seconds)
is long-term context - durable knowledge shared across interactions. A typical live call
loads a cloud FAQ index for long-term context and opens a session for short-term context,
then queries both for each turn.

```python theme={null}
import asyncio
from moss import DocumentInfo, MossClient, QueryOptions

async def main():
    client = MossClient(MOSS_PROJECT_ID, MOSS_PROJECT_KEY)

    # Long-term context: a persistent cloud index, loaded for in-process queries.
    await client.load_index("support-faqs")

    # Short-term context: a session for this specific call.
    session = await client.session(index_name="call-abc")

    # As each turn arrives, index it locally (~1-5 ms).
    await session.add_docs([
        DocumentInfo(id="turn-1", text="Customer was billed twice for the same renewal."),
    ])

    # Query both for context on the current turn.
    user_turn = "why was I charged twice"
    recent = await session.query(user_turn, QueryOptions(top_k=3))          # this call
    knowledge = await client.query("support-faqs", user_turn, QueryOptions(top_k=3))  # all-time

    context = list(recent.docs) + list(knowledge.docs)
    for doc in context:
        print(f"{doc.id} score={doc.score:.3f} {doc.text}")

    # At call end, persist the session for future retrieval.
    await session.push_index()
    await client.unload_index("support-faqs")

asyncio.run(main())
```

## Behavior notes

* The session's embedding model is set by `model_id` on `session()` (default `"moss-minilm"`;
  also `"moss-mediumlm"` or `"custom"`). When resuming an existing cloud index, omit
  `model_id` to adopt the stored model - passing a different one raises a `ValueError`. All
  participants resuming the same index must use the same model.
* With `model_id="custom"`, each document must carry its own `.embedding` and every query
  must pass `QueryOptions.embedding`. See [Custom embeddings](./custom-embeddings).
* Project credentials are validated when the session is opened; `session()` raises if they
  are invalid.

## Related

<CardGroup cols={2}>
  <Card title="SessionIndex reference" icon="cube" href="./classes/SessionIndex">
    Every session method and property.
  </Card>

  <Card title="Metadata filtering" icon="filter" href="./metadata-filtering">
    Filter inside a session query.
  </Card>
</CardGroup>

---

_Source: https://docs.moss.dev/docs/reference/python/sessions.md_
