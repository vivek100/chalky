> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Sessions

> Local-first, real-time indexing in JavaScript with create-resume-query-push.

A session is a local index you read and write in real time, with no cloud round trip on any
operation. Sessions are how Moss indexes data during a live interaction - indexing transcript
turns mid-call, building a per-user working set, or accumulating context that is handed off
between agents.

A session is a [`SessionIndex`](./classes/SessionIndex), created from
[`client.session()`](./classes/MossClient#session). It requires a client built with a
`projectKey`; calling `session()` on a client built with a custom authenticator throws.

## Create or resume

`client.session(name)` returns a `SessionIndex`. If a cloud index with that name already
exists it auto-loads into the session (no re-embedding); otherwise the session starts empty.
The workflow is identical in both cases, and `name` is also the target when
[`pushIndex()`](./classes/SessionIndex#pushindex) is called.

```typescript theme={null}
import { MossClient } from '@moss-dev/moss'

const client = new MossClient(process.env.MOSS_PROJECT_ID!, process.env.MOSS_PROJECT_KEY!)

// Create or resume by name.
const session = await client.session('call-123')
console.log(`${session.docCount} existing docs loaded`)

// Mutate locally - appended to whatever was loaded. Embeds in-process, no network.
await session.addDocs([
  { id: 'turn-1', text: 'Customer reported a duplicate charge on their March invoice.' },
])

// Query locally (~1-10ms). Same options as MossClient.query (topK, alpha, filter, embedding).
const results = await session.query('billing issue', { topK: 3 })
results.docs.forEach(d => console.log(d.id, d.score, d.text))

// Fetch and delete by id, also local.
const docs = await session.getDocs({ docIds: ['turn-1'] })
await session.deleteDocs(['turn-1'])

// Persist to the cloud under the session name (no server-side re-embedding).
const pushed = await session.pushIndex()
console.log(`Pushed ${pushed.docCount} docs (job ${pushed.jobId})`)
```

## Short-term vs. long-term context

A session is short-term context - the working set for the current interaction. A persistent
cloud index loaded with [`client.loadIndex()`](./classes/MossClient#loadindex) is long-term
context - durable knowledge shared across interactions. Most real-time apps query both: load
a cloud index for long-term knowledge, open a session for the live turns, and query each.

```typescript theme={null}
import { MossClient } from '@moss-dev/moss'

const client = new MossClient(process.env.MOSS_PROJECT_ID!, process.env.MOSS_PROJECT_KEY!)

// Long-term context: load a persistent cloud index into memory.
await client.loadIndex('product-faqs')

// Short-term context: open a session for the live call.
const session = await client.session('call-123')

// As the call progresses, index transcript turns locally.
await session.addDocs([
  { id: 'turn-1', text: 'Customer was billed twice for the same subscription renewal.' },
  { id: 'turn-2', text: 'Customer requested a refund for the duplicate charge of $49.99.' },
])

// On each new turn, query both: the FAQ index for knowledge, the session for what was said.
const userQuestion = 'how long does a refund take'
const [knowledge, recall] = await Promise.all([
  client.query('product-faqs', userQuestion, { topK: 3 }),
  session.query(userQuestion, { topK: 3 }),
])

// At the end of the call, persist the session for future retrieval.
await session.pushIndex()
```

## Loading a cloud index into a session

A session can also pull an existing cloud index into its local store with
[`loadIndex()`](./classes/SessionIndex#loadindex). With `autoRefresh: true` the SDK polls the
cloud and pulls newer versions in on subsequent reads (paused while the session has un-pushed
local edits).

```typescript theme={null}
const session = await client.session('call-123')
const loaded = await session.loadIndex('product-faqs', { autoRefresh: true })
console.log(`${loaded} docs loaded into the session`)
```

## Behavior notes

* Every session operation (`addDocs`, `deleteDocs`, `getDocs`, `query`) runs in process memory
  with no per-operation cloud round trip.
* The embedding model is set by the optional second argument to `session()` (default
  `"moss-minilm"`; also `"moss-mediumlm"` or `"custom"`). When resuming an existing cloud
  index, omit the model to adopt the stored one - all participants resuming the same index
  must use the same model.
* With `modelId: 'custom'`, each added document must carry an `embedding` and every `query`
  must pass an `embedding`. See [Custom embeddings](./custom-embeddings).
* `pushIndex()` uploads documents with their locally-computed embeddings; no server-side
  re-embedding occurs.

## Related

* [SessionIndex reference](./classes/SessionIndex) - every session method.
* [MossClient.session()](./classes/MossClient#session) - open or resume a session.
* [Metadata filtering](./metadata-filtering) - filter inside a session query.
* [SDK reference](./api) - the full JavaScript SDK overview.

---

_Source: https://docs.moss.dev/docs/reference/js/sessions.md_
