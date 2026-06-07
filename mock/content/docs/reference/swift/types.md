> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Types

> Structs and enums used across the Moss Swift SDK.

[Swift SDK](./api) / Types

Reference for the structs and enums passed to and returned from
[`MossClient`](./classes/MossClient) and [`MossSession`](./classes/MossSession).

## DocumentInfo

A document stored in or returned from an index. Conforms to `Codable`.

```swift theme={null}
public struct DocumentInfo: Codable {
    public let id: String
    public let text: String
    public let metadata: [String: String]?   // optional, defaults to nil
    public let embedding: [Float]?            // optional, defaults to nil
}
```

| Field       | Type                | Description                                                                                 |
| ----------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `id`        | `String`            | Unique document id.                                                                         |
| `text`      | `String`            | Document text.                                                                              |
| `metadata`  | `[String: String]?` | Optional string key/value metadata, usable in filters.                                      |
| `embedding` | `[Float]?`          | Optional pre-computed embedding. Required when the session/index uses the `"custom"` model. |

## QueryOptions

```swift theme={null}
public struct QueryOptions {
    public var topK: Int        // default 5
    public var alpha: Float     // default 0.8
    public var filterJson: String?
}
```

| Field        | Type      | Description                                                                                |
| ------------ | --------- | ------------------------------------------------------------------------------------------ |
| `topK`       | `Int`     | Number of results to return. Default `5`.                                                  |
| `alpha`      | `Float`   | Hybrid blend: `1.0` = pure semantic, `0.0` = pure keyword. Default `0.8` (semantic-heavy). |
| `filterJson` | `String?` | Optional metadata filter as a JSON string (`$eq`, `$and`, `$in`, `$near`, …).              |

See [Querying](./querying) for hybrid-search and metadata-filtering examples.

## SearchResult

Returned by `query(...)`.

```swift theme={null}
public struct SearchResult {
    public let docs: [QueryResult]
    public let query: String
    public let timeMs: UInt64
}
```

## QueryResult

A single match within a [`SearchResult`](#searchresult).

```swift theme={null}
public struct QueryResult {
    public let id: String
    public let score: Float
    public let text: String
    public let metadata: [String: String]?
}
```

## ModelRef

Reference to an embedding model with version information. Surfaced on
[`IndexInfo`](#indexinfo).

```swift theme={null}
public struct ModelRef {
    public let id: String
    public let version: String?
}
```

| Field     | Type      | Description                                 |
| --------- | --------- | ------------------------------------------- |
| `id`      | `String`  | Model identifier.                           |
| `version` | `String?` | Model version (semver or build identifier). |

## IndexInfo

Metadata about a cloud index. Returned by
[`getIndex`](./classes/MossClient#getindex_) and
[`listIndexes`](./classes/MossClient#listindexes).

```swift theme={null}
public struct IndexInfo {
    public let id: String
    public let name: String
    public let status: String
    public let docCount: Int
    public let model: ModelRef
    public let version: String?
    public let createdAt: String?
    public let updatedAt: String?
}
```

| Field       | Type       | Description                                                              |
| ----------- | ---------- | ------------------------------------------------------------------------ |
| `id`        | `String`   | Unique identifier of the index.                                          |
| `name`      | `String`   | Human-readable name of the index.                                        |
| `status`    | `String`   | Current build status (e.g. `NotStarted`, `Building`, `Ready`, `Failed`). |
| `docCount`  | `Int`      | Number of documents in the index.                                        |
| `model`     | `ModelRef` | Embedding model bound to the index.                                      |
| `version`   | `String?`  | Index build/format version.                                              |
| `createdAt` | `String?`  | When the index was created.                                              |
| `updatedAt` | `String?`  | When the index was last updated.                                         |

## SessionOptions

Passed to [`MossClient.session(_:options:)`](./classes/MossClient#session_options).

```swift theme={null}
public struct SessionOptions {
    public var modelId: String?    // optional, defaults to nil
}
```

| Field     | Type      | Description                                                                                                                             |
| --------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `modelId` | `String?` | Embedding model id. `nil` = platform default (`moss-litelm` on iOS). Pass `"custom"` to supply embeddings via `DocumentInfo.embedding`. |

## PushIndexResult

Returned by [`MossSession.pushIndex()`](./classes/MossSession#pushindex). Poll
`jobId` with [`getJobStatus`](./classes/MossClient#getjobstatus_) until
`status` is `ready`.

```swift theme={null}
public struct PushIndexResult {
    public let jobId: String
    public let indexName: String
    public let docCount: Int
    public let status: String
}
```

## MutationResult

Returned by the cloud document operations
[`createIndex`](./classes/MossClient#createindex_docs_modelid),
[`addDocs`](./classes/MossClient#adddocs_docs_upsert), and
[`deleteDocs`](./classes/MossClient#deletedocs_docids) after the operation
completes.

```swift theme={null}
public struct MutationResult {
    public let jobId: String
    public let indexName: String
    public let docCount: Int
}
```

| Field       | Type     | Description                                              |
| ----------- | -------- | -------------------------------------------------------- |
| `jobId`     | `String` | Identifier of the async job that performed the mutation. |
| `indexName` | `String` | Name of the index that was mutated.                      |
| `docCount`  | `Int`    | Number of documents in the index after the mutation.     |

## RefreshResult

Returned by [`refreshIndex`](./classes/MossClient#refreshindex_).

```swift theme={null}
public struct RefreshResult {
    public let indexName: String
    public let previousUpdatedAt: String
    public let newUpdatedAt: String
    public let wasUpdated: Bool
}
```

| Field               | Type     | Description                                    |
| ------------------- | -------- | ---------------------------------------------- |
| `indexName`         | `String` | Name of the index that was refreshed.          |
| `previousUpdatedAt` | `String` | Timestamp before the refresh.                  |
| `newUpdatedAt`      | `String` | Timestamp after the refresh.                   |
| `wasUpdated`        | `Bool`   | `true` when a newer cloud version was applied. |

## JobStatus

Returned by [`getJobStatus`](./classes/MossClient#getjobstatus_).

```swift theme={null}
public struct JobStatus {
    public let jobId: String
    public let status: String
    public let progress: Double
    public let currentPhase: String?
    public let error: String?
    public let createdAt: String
    public let updatedAt: String
    public let completedAt: String?
}
```

## MemoryPressureLevel

Passed to [`onMemoryPressure`](./classes/MossClient#onmemorypressure_).

```swift theme={null}
public enum MemoryPressureLevel: UInt8 {
    case low = 0        // hint: drop hot caches
    case critical = 1   // drop everything reclaimable; on-disk caches kept
}
```

## MossError

Thrown for any failure reported by the underlying runtime. Conforms to
`LocalizedError`, so `error.localizedDescription` returns the message.

```swift theme={null}
public struct MossError: LocalizedError {
    public let code: Int32
    public let message: String
}
```

---

_Source: https://docs.moss.dev/docs/reference/swift/types.md_
