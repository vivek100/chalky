> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# MossSession

> On-device index for local embedding, search, persistence, and cloud sync.

[Swift SDK](../api) / MossSession

# MossSession

An on-device index handle for a single index, returned by
[`MossClient.session(_:options:)`](./MossClient#session_options). All embedding
runs locally with the bundled model; queries don't hit the network.

A session can be persisted to disk (`save` / `loadFromDisk`) or synced to the
cloud (`pushIndex` / `loadIndex`).

The class is thread-safe. `close()` (also called on `deinit`) blocks until
in-flight calls return before freeing the native handle.

## Example

```swift theme={null}
let session = try await client.session("notes")
defer { session.close() }

_ = try await session.addDocs([
  .init(id: "1", text: "first note"),
  .init(id: "2", text: "second note"),
])

let result = try await session.query("first")
result.docs.forEach { print($0.score, $0.id) }
```

## Properties

### name

```swift theme={null}
var name: String
```

The index name this session was opened against.

### docCount

```swift theme={null}
var docCount: Int
```

Current document count in the index.

## Methods

### close()

```swift theme={null}
func close()
```

Frees the native handle. Idempotent; also called on `deinit`.

***

### addDocs(\_:upsert:)

```swift theme={null}
func addDocs(_ docs: [DocumentInfo], upsert: Bool = true) async throws -> (added: Int, updated: Int)
```

Adds or upserts documents, embedding them on-device. Returns the counts of rows
added (new ids) and updated (existing ids). Takes
[`[DocumentInfo]`](../types#documentinfo).

***

### deleteDocs(\_:)

```swift theme={null}
func deleteDocs(_ docIds: [String]) async throws -> Int
```

Deletes documents by id. Returns the number actually deleted (missing ids are
ignored).

***

### getDocs(\_:)

```swift theme={null}
func getDocs(_ docIds: [String]? = nil) async throws -> [DocumentInfo]
```

Returns documents by id, or all documents when `docIds` is `nil`. An empty
array returns nothing. Returns [`[DocumentInfo]`](../types#documentinfo).

***

### query(\_:options:)

```swift theme={null}
func query(_ q: String, options: QueryOptions = QueryOptions()) async throws -> SearchResult
```

Embeds `q` on-device and runs a local similarity search. Tune with
[`QueryOptions`](../types#queryoptions) - hybrid `alpha` and metadata
filtering are covered in the [Querying guide](../querying). Returns a
[`SearchResult`](../types#searchresult).

### query(\_:embedding:options:)

```swift theme={null}
func query(_ q: String, embedding: [Float]?, options: QueryOptions = QueryOptions()) async throws -> SearchResult
```

Search variant that takes a caller-provided embedding, bypassing the on-device
model forward pass.

***

### save(toCachePath:)

```swift theme={null}
func save(toCachePath cachePath: String) async throws
```

Persists the session's index to disk under `cachePath` so it can be reopened
on the next launch without re-embedding.

***

### loadFromDisk(cachePath:)

```swift theme={null}
func loadFromDisk(cachePath: String) async throws -> Int
```

Restores a session previously written with `save(toCachePath:)`. Returns the
document count restored. The session's name must match the one used at save
time.

```swift theme={null}
try await session.save(toCachePath: NSTemporaryDirectory())
session.close()

let restored = try await client.session("notes")
try await restored.loadFromDisk(cachePath: NSTemporaryDirectory())
```

***

### pushIndex()

```swift theme={null}
func pushIndex() async throws -> PushIndexResult
```

Pushes the in-memory session to the cloud as a server-side index. Returns a
[`PushIndexResult`](../types#pushindexresult) with a `jobId`; poll
[`MossClient.getJobStatus`](./MossClient#getjobstatus_) until the status is
`ready`.

***

### loadIndex(\_:)

```swift theme={null}
func loadIndex(_ indexName: String) async throws -> Int
```

Pulls a server-side index into this session as a one-time hydration (returns
the doc count loaded, `0` if no such cloud index). The session then behaves as
a local one - subsequent add/delete/query don't hit the network.

```swift theme={null}
let push = try await session.pushIndex()
while try await client.getJobStatus(push.jobId).status != "ready" {
  try await Task.sleep(nanoseconds: 1_000_000_000)
}

let restored = try await client.session(push.indexName)
_ = try await restored.loadIndex(push.indexName)
let hits = try await restored.query("how do transformers work", options: .init(topK: 3))
```

---

_Source: https://docs.moss.dev/docs/reference/swift/classes/MossSession.md_
