> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# SessionIndex

> Local-first, in-process index for real-time indexing and querying.

[@moss-dev/moss](../api) / SessionIndex

# SessionIndex

A local-first, in-process index for real-time indexing and querying. All operations
(`addDocs`, `deleteDocs`, `query`) run in process memory with no cloud round-trip per
operation. Call [`pushIndex()`](#pushindex) to persist the session to the cloud.

Construct a session with [`MossClient.session()`](./MossClient#session); the constructor is
not used directly.

## Example

```typescript theme={null}
import { MossClient } from '@moss-dev/moss';

const client = new MossClient('your-project-id', 'your-project-key');

const session = await client.session('chat-session-123');
await session.addDocs([{ id: '1', text: 'Customer asked about billing' }]);
const results = await session.query('billing question');
await session.pushIndex();
```

## Accessors

| Property   | Type                                     | Description                                                                      |
| ---------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| `name`     | `string`                                 | The session index name. Identifies the cloud index on `pushIndex` / `loadIndex`. |
| `docCount` | `number`                                 | Number of documents currently in the local session.                              |
| `modelId`  | [`MossModel`](../type-aliases/MossModel) | The embedding model the session is configured for.                               |

## Methods

### addDocs()

> **addDocs**(`docs`, `options?`): `Promise`\<\{ `added`: `number`; `updated`: `number` }>

Adds or updates documents in the local session index. For built-in models, embeddings are
generated locally. For `modelId: "custom"`, each document must carry an `embedding`.

#### Parameters

| Parameter  | Type                                               | Description                       |
| ---------- | -------------------------------------------------- | --------------------------------- |
| `docs`     | [`DocumentInfo`](../interfaces/DocumentInfo)\[]    | Documents to add or update.       |
| `options?` | [`MutationOptions`](../interfaces/MutationOptions) | Mutation options (e.g. `upsert`). |

#### Returns

`Promise`\<\{ `added`: `number`; `updated`: `number` }>

***

### deleteDocs()

> **deleteDocs**(`docIds`): `Promise`\<`number`>

Deletes documents from the local session by id. Returns the number removed.

#### Parameters

| Parameter | Type        | Description             |
| --------- | ----------- | ----------------------- |
| `docIds`  | `string`\[] | Document ids to delete. |

#### Returns

`Promise`\<`number`>

***

### getDocs()

> **getDocs**(`options?`): `Promise`\<[`DocumentInfo`](../interfaces/DocumentInfo)\[]>

Fetches documents currently in the local session.

#### Parameters

| Parameter  | Type                                                       | Description              |
| ---------- | ---------------------------------------------------------- | ------------------------ |
| `options?` | [`GetDocumentsOptions`](../interfaces/GetDocumentsOptions) | Pass `docIds` to filter. |

#### Returns

`Promise`\<[`DocumentInfo`](../interfaces/DocumentInfo)\[]>

***

### query()

> **query**(`query`, `options?`): `Promise`\<[`SearchResult`](../interfaces/SearchResult)>

Hybrid (keyword + semantic) search over the local session index, entirely in-memory. For
`modelId: "custom"`, an explicit `options.embedding` is required.

#### Parameters

| Parameter  | Type                                         | Description                                             |
| ---------- | -------------------------------------------- | ------------------------------------------------------- |
| `query`    | `string`                                     | The search query text.                                  |
| `options?` | [`QueryOptions`](../interfaces/QueryOptions) | Query options (`topK`, `alpha`, `embedding`, `filter`). |

#### Returns

`Promise`\<[`SearchResult`](../interfaces/SearchResult)>

***

### loadIndex()

> **loadIndex**(`indexName`, `options?`): `Promise`\<`number`>

Loads an existing cloud index into the session by name. With `options.autoRefresh = true`,
the SDK polls the cloud index and pulls newer versions in on subsequent reads (paused while
the session has un-pushed local edits). Returns the number of documents loaded.

#### Parameters

| Parameter   | Type                                                     | Description                                       |
| ----------- | -------------------------------------------------------- | ------------------------------------------------- |
| `indexName` | `string`                                                 | Name of the cloud index to load into the session. |
| `options?`  | [`LoadSessionOptions`](../interfaces/LoadSessionOptions) | Auto-refresh settings.                            |

#### Returns

`Promise`\<`number`>

***

### pushIndex()

> **pushIndex**(): `Promise`\<[`PushIndexResult`](../interfaces/PushIndexResult)>

Uploads the session to the cloud, creating or replacing the index with the same name.
Documents are pushed with their locally-computed embeddings; no server-side re-embedding.

#### Returns

`Promise`\<[`PushIndexResult`](../interfaces/PushIndexResult)>

***

### saveToDisk()

> **saveToDisk**(`cachePath`): `Promise`\<`void`>

Persists the session to `<cachePath>/<name>/` for offline reuse without a cloud round-trip.

#### Parameters

| Parameter   | Type     | Description                        |
| ----------- | -------- | ---------------------------------- |
| `cachePath` | `string` | Directory to write the session to. |

***

### loadFromDisk()

> **loadFromDisk**(`cachePath`): `Promise`\<`number`>

Restores a session previously written by `saveToDisk`. Returns the number of documents loaded.

#### Parameters

| Parameter   | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| `cachePath` | `string` | Directory a session was saved to. |

#### Returns

`Promise`\<`number`>

---

_Source: https://docs.moss.dev/docs/reference/js/classes/SessionIndex.md_
