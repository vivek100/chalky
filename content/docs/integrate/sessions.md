> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Sessions

> Local-first, real-time indexing with create-resume-query-push.

A **session** is a local index you read and write in real time, with no cloud round trip
on any operation. Sessions are how Moss does indexing *during* a live interaction -
indexing transcript turns mid-call, building a per-user working set, or accumulating
context that's handed off between agents.

A session is represented by a [`SessionIndex`](/docs/reference/python/classes/SessionIndex),
created from [`MossClient.session()`](/docs/reference/python/classes/MossClient#session-index_name-model_id).

## Lifecycle

<Steps>
  <Step title="Create or resume">
    `client.session(name)` returns a `SessionIndex`. If a cloud index with that name already
    exists, it auto-loads into the session (no re-embedding); otherwise the session starts
    empty. The workflow is identical in both cases.
  </Step>

  <Step title="Mutate locally">
    `add_docs`, `delete_docs`, and `get_docs` run in-memory. `add_docs` embeds locally via the
    Rust core - no network. With `model_id="custom"`, each document must carry its own
    `.embedding`.
  </Step>

  <Step title="Query locally">
    `query` runs entirely in-memory (\~1-10 ms) and supports the same metadata filter syntax as
    [`MossClient.query()`](/docs/reference/python/classes/MossClient#query-name-query-options).
  </Step>

  <Step title="Persist (optional)">
    `push_index()` uploads the session - documents and their locally-computed embeddings - to
    the cloud under the session's name, creating or replacing that index. No server-side
    re-embedding occurs.
  </Step>
</Steps>

## Short-term vs. long-term context

A session is **short-term context** - the working set for the current interaction. A
persistent cloud index loaded with
[`load_index()`](/docs/reference/python/classes/MossClient#load_index-name-auto_refresh-polling_interval_in_seconds)
is **long-term context** - durable knowledge shared across interactions. Most real-time
apps query both; see [Live-call context](/docs/build/live-call-context).

## Models

The session's embedding model is set by the `model_id` argument to `session()` (default
`"moss-minilm"`; also `"moss-mediumlm"` or `"custom"`). When resuming an existing cloud
index, omit `model_id` to adopt the stored model - passing a different one raises a
`ValueError`. All participants resuming the same index must use the same model.

## Authentication

Project credentials are validated when the session is opened; `session()` raises if they're
invalid. See [Authentication](/docs/integrate/authentication).

## Implementation

Runnable, per-language examples (create-or-resume, mutate, query, push) live in the SDK guides:

* [Python](/docs/reference/python/sessions)
* [JavaScript](/docs/reference/js/sessions)

## Related

<CardGroup cols={2}>
  <Card title="Real-time local indexing" icon="gauge-high" href="/docs/build/real-time-local-indexing">
    Why sessions are sub-10 ms.
  </Card>

  <Card title="Cross-agent handoff" icon="arrow-right-arrow-left" href="/docs/build/cross-agent-handoff">
    Resume a session on another agent or channel.
  </Card>
</CardGroup>

---

_Source: https://docs.moss.dev/docs/integrate/sessions.md_
