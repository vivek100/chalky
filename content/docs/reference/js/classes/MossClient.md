> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# MossClient

> Async-first semantic search client for vector similarity operations.

[@moss-dev/moss](../api) / MossClient

# MossClient

MossClient - Async-first semantic search client for vector similarity operations.

All mutations (createIndex, addDocs, deleteDocs) are async operations
that run server-side and poll until complete.

## Example

```typescript theme={null}
import { MossClient } from '@moss-dev/moss';

const client = new MossClient('your-project-id', 'your-project-key');

// Create an index with documents (polls until complete)
const result = await client.createIndex('docs', [
  { id: '1', text: 'Machine learning fundamentals' },
  { id: '2', text: 'Deep learning neural networks' }
]);

// Add docs (polls until complete)
await client.addDocs('docs', [
  { id: '3', text: 'Natural language processing' }
]);

// Query the index
await client.loadIndex('docs');
const results = await client.query('docs', 'AI and neural networks');
```

## Constructors

### Constructor

> **new MossClient**(`projectId`, `projectKey`): `MossClient`

Creates a new MossClient instance.

#### Parameters

| Parameter    | Type     | Description                                                                           |
| ------------ | -------- | ------------------------------------------------------------------------------------- |
| `projectId`  | `string` | Your project identifier.                                                              |
| `projectKey` | `string` | Your project authentication key. Use the `projectKey` form for server-side code only. |

#### Returns

`MossClient`

### Constructor (custom authenticator)

> **new MossClient**(`projectId`, `authenticator`): `MossClient`

Creates a new MossClient instance with a custom authenticator. Use this pattern from
browser or untrusted clients where the `projectKey` must never be embedded in shipped code.
See the [Custom Authenticator](../custom-authenticator) guide for details.

#### Parameters

| Parameter       | Type             | Description                                                               |
| --------------- | ---------------- | ------------------------------------------------------------------------- |
| `projectId`     | `string`         | Your project identifier.                                                  |
| `authenticator` | `IAuthenticator` | Implementation that returns a short-lived bearer token from your backend. |

## Methods

### createIndex()

> **createIndex**(`indexName`, `docs`, `options?`): `Promise`\<[`MutationResult`](../interfaces/MutationResult)>

Creates a new index with the provided documents via async upload.

Handles the full flow: init, upload, build, then poll until complete.
Returns when the index is ready.

When all documents have pre-computed embeddings, they are serialized as raw
float32 in the binary upload. When no documents have embeddings, the server
generates embeddings in batches (dimension=0 flow).

Mixed documents (some with embeddings, some without) are rejected.

#### Parameters

| Parameter   | Type                                                     | Description                                         |
| ----------- | -------------------------------------------------------- | --------------------------------------------------- |
| `indexName` | `string`                                                 | Name of the index to create.                        |
| `docs`      | [`DocumentInfo`](../interfaces/DocumentInfo)\[]          | Documents, optionally with pre-computed embeddings. |
| `options?`  | [`CreateIndexOptions`](../interfaces/CreateIndexOptions) | Optional model ID and progress callback.            |

#### Returns

`Promise`\<[`MutationResult`](../interfaces/MutationResult)>

Promise that resolves to MutationResult when the index is ready.

#### Throws

If the index already exists or creation fails.

#### Example

```typescript theme={null}
const result = await client.createIndex('knowledge-base', [
  { id: 'doc1', text: 'Introduction to AI' },
  { id: 'doc2', text: 'Machine learning basics' }
], {
  onProgress: (p) => console.log(`${p.status} ${p.progress}%`),
});
```

***

### getIndex()

> **getIndex**(`indexName`): `Promise`\<[`IndexInfo`](../interfaces/IndexInfo)>

Gets information about a specific index.

#### Parameters

| Parameter   | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| `indexName` | `string` | Name of the index to retrieve. |

#### Returns

`Promise`\<[`IndexInfo`](../interfaces/IndexInfo)>

Promise that resolves to IndexInfo object.

#### Throws

If the index does not exist.

#### Example

```typescript theme={null}
const info = await client.getIndex('knowledge-base');
console.log(`Index has ${info.docCount} documents`);
```

***

### listIndexes()

> **listIndexes**(): `Promise`\<[`IndexInfo`](../interfaces/IndexInfo)\[]>

Lists all available indexes.

#### Returns

`Promise`\<[`IndexInfo`](../interfaces/IndexInfo)\[]>

Promise that resolves to array of IndexInfo objects.

#### Example

```typescript theme={null}
const indexes = await client.listIndexes();
indexes.forEach(index => {
  console.log(`${index.name}: ${index.docCount} docs`);
});
```

***

### deleteIndex()

> **deleteIndex**(`indexName`): `Promise`\<`boolean`>

Deletes an index and all its data.

#### Parameters

| Parameter   | Type     | Description                  |
| ----------- | -------- | ---------------------------- |
| `indexName` | `string` | Name of the index to delete. |

#### Returns

`Promise`\<`boolean`>

Promise that resolves to true if successful.

#### Throws

If the index does not exist.

#### Example

```typescript theme={null}
const deleted = await client.deleteIndex('old-index');
```

***

### addDocs()

> **addDocs**(`indexName`, `docs`, `options?`): `Promise`\<[`MutationResult`](../interfaces/MutationResult)>

Adds or updates documents in an index asynchronously.

The index rebuild happens server-side. This method polls until
the rebuild is complete and then returns.

#### Parameters

| Parameter   | Type                                               | Description                                           |
| ----------- | -------------------------------------------------- | ----------------------------------------------------- |
| `indexName` | `string`                                           | Name of the target index.                             |
| `docs`      | [`DocumentInfo`](../interfaces/DocumentInfo)\[]    | Documents to add or update.                           |
| `options?`  | [`MutationOptions`](../interfaces/MutationOptions) | Optional configuration (upsert, onProgress callback). |

#### Returns

`Promise`\<[`MutationResult`](../interfaces/MutationResult)>

Promise that resolves to MutationResult when the operation is complete.

#### Throws

If the index does not exist.

#### Example

```typescript theme={null}
const result = await client.addDocs('knowledge-base', [
  { id: 'new-doc', text: 'New content to index' }
], { upsert: true });
console.log(`Job ${result.jobId} completed`);
```

***

### deleteDocs()

> **deleteDocs**(`indexName`, `docIds`, `options?`): `Promise`\<[`MutationResult`](../interfaces/MutationResult)>

Deletes documents from an index by their IDs asynchronously.

The index rebuild happens server-side. This method polls until
the rebuild is complete and then returns.

#### Parameters

| Parameter   | Type                                               | Description                                   |
| ----------- | -------------------------------------------------- | --------------------------------------------- |
| `indexName` | `string`                                           | Name of the target index.                     |
| `docIds`    | `string`\[]                                        | Array of document IDs to delete.              |
| `options?`  | [`MutationOptions`](../interfaces/MutationOptions) | Optional configuration (onProgress callback). |

#### Returns

`Promise`\<[`MutationResult`](../interfaces/MutationResult)>

Promise that resolves to MutationResult when the operation is complete.

#### Throws

If the index does not exist.

#### Example

```typescript theme={null}
const result = await client.deleteDocs('knowledge-base', ['doc1', 'doc2']);
console.log(`Job ${result.jobId} completed`);
```

***

### getJobStatus()

> **getJobStatus**(`jobId`): `Promise`\<[`JobStatusResponse`](../interfaces/JobStatusResponse)>

Gets the current status of an async job.

#### Parameters

| Parameter | Type     | Description                                                 |
| --------- | -------- | ----------------------------------------------------------- |
| `jobId`   | `string` | The job ID returned by createIndex, addDocs, or deleteDocs. |

#### Returns

`Promise`\<[`JobStatusResponse`](../interfaces/JobStatusResponse)>

Promise that resolves to JobStatusResponse with progress details.

#### Example

```typescript theme={null}
const status = await client.getJobStatus(jobId);
console.log(`${status.status} - ${status.progress}%`);
```

***

### getDocs()

> **getDocs**(`indexName`, `options?`): `Promise`\<[`DocumentInfo`](../interfaces/DocumentInfo)\[]>

Retrieves documents from an index.

#### Parameters

| Parameter   | Type                                                       | Description                           |
| ----------- | ---------------------------------------------------------- | ------------------------------------- |
| `indexName` | `string`                                                   | Name of the target index.             |
| `options?`  | [`GetDocumentsOptions`](../interfaces/GetDocumentsOptions) | Optional configuration for retrieval. |

#### Returns

`Promise`\<[`DocumentInfo`](../interfaces/DocumentInfo)\[]>

Promise that resolves to array of documents.

#### Throws

If the index does not exist.

#### Example

```typescript theme={null}
// Get all documents
const allDocs = await client.getDocs('knowledge-base');

// Get specific documents
const specificDocs = await client.getDocs('knowledge-base', {
  docIds: ['doc1', 'doc2']
});
```

***

### loadIndex()

> **loadIndex**(`indexName`, `options?`): `Promise`\<`string`>

Downloads an index from the cloud into memory for fast local querying.

**How it works:**

1. Fetches the index assets from the cloud
2. Loads the embedding model for generating query embeddings
3. Executes a local similarity match between the query embedding and the retrieved index.

**Why use this?**
An index must be loaded before you can `query()` it. Once loaded, queries run entirely in-memory (\~1-10ms).

**Reload behavior:**
If the index is already loaded, calling `loadIndex()` again will:

* Stop any existing auto-refresh polling
* Download a fresh copy from the cloud
* Replace the in-memory index

**Auto-refresh (optional):**
Enable `autoRefresh: true` to periodically poll the cloud for updates.
When a newer version is detected, the index is automatically hot-swapped
without interrupting queries.

#### Parameters

| Parameter   | Type                                                 | Description                                             |
| ----------- | ---------------------------------------------------- | ------------------------------------------------------- |
| `indexName` | `string`                                             | Name of the index to load.                              |
| `options?`  | [`LoadIndexOptions`](../interfaces/LoadIndexOptions) | Optional configuration including auto-refresh settings. |

#### Returns

`Promise`\<`string`>

Promise that resolves to the index name.

#### Throws

If the index does not exist in the cloud or loading fails.

#### Example

```typescript theme={null}
// Simple load - enables fast local queries
await client.loadIndex('my-index');

// Now queries run locally (fast, no network calls)
const results = await client.query('my-index', 'search text');

// Load with auto-refresh to keep index up-to-date
await client.loadIndex('my-index', {
  autoRefresh: true,
  pollingIntervalInSeconds: 300, // Check cloud every 5 minutes
});

// Stop auto-refresh by reloading without the option
await client.loadIndex('my-index');
```

***

### query()

> **query**(`indexName`, `query`, `options?`): `Promise`\<[`SearchResult`](../interfaces/SearchResult)>

Performs a semantic similarity search against a loaded index. Call `loadIndex()` first;
queries then run entirely in-memory. Metadata filtering is supported on loaded indexes.

#### Parameters

| Parameter   | Type                                         | Description                                                                       |
| ----------- | -------------------------------------------- | --------------------------------------------------------------------------------- |
| `indexName` | `string`                                     | Name of the target index to search.                                               |
| `query`     | `string`                                     | The search query text.                                                            |
| `options?`  | [`QueryOptions`](../interfaces/QueryOptions) | Optional query configuration including topK (default: 5) and embedding overrides. |

#### Returns

`Promise`\<[`SearchResult`](../interfaces/SearchResult)>

Promise that resolves to SearchResult with matching documents.

#### Throws

If the specified index does not exist.

#### Example

```typescript theme={null}
const results = await client.query('knowledge-base', 'machine learning');
results.docs.forEach(doc => {
  console.log(`${doc.id}: ${doc.text} (score: ${doc.score})`);
});
```

***

### getAuthToken()

> **getAuthToken**(): `Promise`\<`AuthToken`>

Returns a short-lived auth token for the current project. This is primarily
useful for custom-authenticator patterns, where your backend mints tokens for
untrusted clients instead of shipping the `projectKey`. See the
[Custom Authenticator](../custom-authenticator) guide for details.

#### Returns

`Promise`\<`AuthToken`>

Promise that resolves to an `AuthToken` containing the `token` string and its
`expiresIn` lifetime in seconds.

#### Example

```typescript theme={null}
const { token, expiresIn } = await client.getAuthToken();
console.log(`Token valid for ${expiresIn}s`);
```

***

### session()

> **session**(`indexName`, `modelId?`): `Promise`\<[`SessionIndex`](./SessionIndex)>

Creates or resumes a local-first [`SessionIndex`](./SessionIndex). If a cloud index with the
given name already exists it is loaded into the session (no re-embedding); otherwise the
session starts empty. The `indexName` is also the target when
[`pushIndex()`](./SessionIndex#pushindex) is called.

Requires a client constructed with a project key. Calling `session()` on a client built with
a custom `IAuthenticator` throws.

#### Parameters

| Parameter   | Type                                     | Description                                                                                                 |
| ----------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `indexName` | `string`                                 | Cloud index name to create, resume, and push to.                                                            |
| `modelId?`  | [`MossModel`](../type-aliases/MossModel) | Embedding model for the session. **Default** `"moss-minilm"`. Other options: `"moss-mediumlm"`, `"custom"`. |

#### Returns

`Promise`\<[`SessionIndex`](./SessionIndex)>

#### Example

```typescript theme={null}
const session = await client.session('chat-session-123');
await session.addDocs([{ id: '1', text: 'Customer asked about billing' }]);
const results = await session.query('billing question');
await session.pushIndex();
```

---

_Source: https://docs.moss.dev/docs/reference/js/classes/MossClient.md_
