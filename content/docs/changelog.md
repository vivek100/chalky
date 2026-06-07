> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Product Updates

<Tabs>
  <Tab title="Python">
    <Update label="2026-05-06" description="v1.1.0">
      * **Multi-index query**: new `query_multi_index(names, query, options)` searches across multiple loaded indexes and returns the global top-K, with each result tagged by source `index_name`.
      * **Bulk index lifecycle**: `load_indexes(names, ...)` (best-effort, returns `LoadIndexesResult { loaded, failed }`) and `unload_indexes(names)`.
      * `QueryResultDocumentInfo` now exposes an `index_name` field, set on multi-index results.
    </Update>

    <Update label="2026-03-29" description="v1.0.0">
      First stable release of the `moss` Python SDK (previously published as `inferedge-moss`).

      **Import path changed:** `from moss import MossClient` (was `from inferedge_moss import ...`)

      * **Semantic search** with built-in on-device models (`moss-minilm`, `moss-mediumlm`); embedding computation runs in Rust for speed; custom embeddings supported via `QueryOptions.embedding`
      * **Hybrid search** with keyword + semantic search and configurable alpha blending
      * **Metadata filtering** on locally loaded indexes with rich operators (`$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$and`, `$or`, `$near` for geo-distance)
      * **Cloud query fallback**: `query()` automatically falls back to the cloud API when the index is not loaded locally
      * **Hot reload & auto-refresh**: `load_index()` supports `auto_refresh` with configurable polling interval to detect and reload updated indexes
      * **Async bulk index pipeline**: binary upload, server-side build, poll until completion
      * **Index mutations**: `create_index`, `add_docs`, `delete_docs` return `MutationResult` with `job_id`, `index_name`, `doc_count`
      * **Multi-index support** for isolated search spaces
      * **Python 3.10 to 3.14** supported
    </Update>

    <Update label="2026-03-24" description="v1.0.0-beta.19">
      * Updated `inferedge-moss-core` dependency to `0.8.7`
      * Telemetry improvements
      * Embedding computation for built-in models (`moss-minilm`, `moss-mediumlm`) now runs in Rust; custom embeddings continue to be supported via `QueryOptions.embedding`
      * Fixed `list_indexes()` failing when the cloud API returns `null` for certain `IndexInfo` fields on indexes created by older SDK versions
    </Update>

    <Update label="2026-03-12" description="v1.0.0-beta.18">
      * Telemetry improvements
    </Update>

    <Update label="2026-02-26" description="v1.0.0-beta.17">
      * **Metadata Filtering**: `query()` now accepts an optional `filter` dict to narrow results by document metadata on locally loaded indexes
        * Comparison operators: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`
        * Set operators: `$in`, `$nin`
        * Composable with `$and` / `$or` for complex predicates (supports arbitrary nesting)
        * Numeric coercion: int and float filter values are automatically converted to strings for consistent matching
      * **Geo-distance filtering**: new `$near` operator filters documents by haversine distance from a `"lat,lng,radiusMeters"` value
      * When `filter` is passed to `query()` but the index is not loaded locally, a warning is logged and the filter is skipped (cloud query API does not yet support filtering)
      * Updated `inferedge-moss-core` dependency to `0.6.0`
    </Update>

    <Update label="2026-02-23" description="v1.0.0-beta.16">
      * Bumped `inferedge-moss-core` dependency to `0.5.0` to support session index telemetry and `push_index` improvements
    </Update>

    <Update label="2026-02-17" description="v1.0.0-beta.15">
      * All index mutations and reads now go through the Rust ManageClient, replacing the Python HTTP layer
      * Index creation uses an async bulk pipeline: binary upload → server-side build → poll until completion
      * `load_index` supports both V1 and V2 binary formats, with cloud query fallback when index isn't loaded locally
      * New return type `MutationResult` (with `job_id`, `index_name`, `doc_count`) for `create_index`, `add_docs`, `delete_docs`
      * `get_docs` takes `doc_ids` directly instead of wrapping in `GetDocumentsOptions`
    </Update>

    <Update label="2026-02-06" description="v1.0.0-beta.14">
      * Query latency reduced from \~2,300ms to \~10ms for 100K vectors
      * Optimized search pipeline reducing memory allocations
      * Significantly reduced memory overhead for large indexes (100K+ documents) in the context of hybrid search (keyword + semantic)
      * Enhanced performance across all index sizes
    </Update>

    <Update label="2026-02-02" description="v1.0.0-beta.13">
      * **Hot Reload & Auto-Refresh**: Indexes can now automatically detect and reload when updated in the cloud.
        * `load_index()` now accepts optional `auto_refresh` and `polling_interval_in_seconds` parameters
        * When `auto_refresh` is enabled, the SDK polls for updates at the configured interval (default: 600 seconds)
        * To stop auto-refresh, call `load_index()` again without the `auto_refresh` option
      * `load_index()` now allows reloading an already-loaded index (previously threw an error)
      * Index management now uses Rust core for improved performance and reliability
    </Update>

    <Update label="2026-01-30" description="v1.0.0-beta.12">
      * Adds partial support for Python 3.14 by disabling local embedding service functionality. Full support coming soon.
    </Update>

    <Update label="2026-01-29" description="v1.0.0-beta.11">
      * Adds support for user-supplied embeddings.
      * `query()` now automatically falls back to the cloud API when the index is not loaded locally, enabling queries without requiring `load_index()` first.
      * Adds better scoring evaluation for search results
    </Update>

    <Update label="2026-01-26" description="v1.0.0-beta.10">
      * Removes the '\<2' upper bound on numpy dependency.
    </Update>

    <Update label="2026-01-14" description="v1.0.0-beta.9">
      * Drops support for Python 3.9 and below.
      * Bug fix: Keyword search now functions correctly after `load_index()`.
      * New service endpoint with significant infrastructure upgrades. Management operations are now \~3× faster across most real-world use cases, providing faster index operations while also supporting larger payloads.
    </Update>

    <Update label="2025-12-15" description="v1.0.0-beta.8">
      * Updates `inferedge-moss-core` dependency to version 0.2.3 for new ARM64 wheel support.
    </Update>

    <Update label="2025-12-01" description="v1.0.0-beta.7">
      Adds IntelliSense support in all the IDEs
    </Update>

    <Update label="2025-11-29" description="v1.0.0-beta.6">
      Adds support for keyword search and alpha blending between keyword and semantic search.
    </Update>

    <Update label="2025-10-23" description="v1.0.0-beta.5">
      Removes Pipecat integration and MossContextRetriever from the SDK. Will be offered as a pipecat extension instead soon.
    </Update>

    <Update label="2025-10-09" description="v1.0.0-beta.4">
      Performance improvements for query() calls.
    </Update>

    <Update label="2025-10-09" description="v1.0.0-beta.3">
      * **MossContextRetriever**: Added Pipecat integration for real-time voice AI applications
        * Automatically enhances LLM conversations with semantic search results from Moss indexes
        * Seamless integration with OpenAI LLM context frames
    </Update>

    <Update label="2025-09-14" description="v1.0.0-beta.1">
      Initial release of inferedge-moss with core features:

      * Semantic search using transformer-based embeddings
      * Lightweight embedding models for edge computing; supports proprietary "moss-minilm" model
      * API key validation with secure host access
      * Cloudflare CDN support for fast model loading
      * Multi-index support for isolated search spaces
      * Add, update, and remove items across indexes
      * Query interface with configurable result count
      * Performance metrics tracking
    </Update>
  </Tab>

  <Tab title="JavaScript">
    <Update label="2026-05-05" description="v1.0.2">
      * Adds prebuilt binaries for `x86_64-apple-darwin` (Intel Macs).
    </Update>

    <Update label="2026-04-17" description="v1.0.1">
      * **Custom authenticator** for browser-safe authentication: new `MossClient.withAuthenticator()` and `IndexManager.withAuthenticator()` factory methods accept a JS-side token callback.
      * `CLOUD_API_MANAGE_URL` replaced by granular constants: `CLOUD_API_IDENTITY_URL`, `CLOUD_API_AUTH_URL`, etc.
    </Update>

    <Update label="2026-04-01" description="v1.0.0">
      First stable release of `@moss-dev/moss`.

      **Breaking changes**

      * **Package renamed** from `@inferedge/moss` to `@moss-dev/moss`. Update imports accordingly.

      **Behavior**

      * `query()` automatically falls back to cloud HTTP when the index is not loaded locally.
    </Update>

    <Update label="2026-03-30" description="v1.0.0-beta.8">
      * **Filesystem index caching**: `loadIndex()` accepts an optional `cachePath` in `LoadIndexOptions` to cache index binaries and documents to disk (Node.js/Bun only).
        * Cache is automatically invalidated when the cloud index is updated.
        * Auto-refresh also persists refreshed data to the cache.
        * Atomic writes prevent cache corruption from partial/interrupted writes.
        * Path traversal protection on index names.
        * Graceful fallback to re-download if cached data is corrupted.
      * **Metadata filtering**: `query()` accepts an optional `filter` in `QueryOptions` to narrow results by document metadata on locally loaded indexes.
        * Comparison operators: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`
        * Set operators: `$in`, `$nin`
        * Composable with `$and` / `$or` (supports arbitrary nesting)
        * Number values are automatically stringified for consistent matching
      * **Geo-distance filtering**: new `$near` operator filters documents by haversine distance from a `"lat,lng,radiusMeters"` value.
      * New exported types: `FilterCondition`, `MetadataFilter`.
    </Update>

    <Update label="2026-02-18" description="v1.0.0-beta.7">
      * Async job-based mutations (`createIndex`, `addDocs`, `deleteDocs`) with built-in polling and `onProgress` callbacks
      * Large index support - up to 100k documents via presigned upload + server-side build
      * New binary index format with smaller payloads and faster deserialization; existing indexes using the previous format are still supported
    </Update>

    <Update label="2026-02-02" description="v1.0.0-beta.6">
      * **Hot Reload & Auto-Refresh**: Indexes can now automatically detect and reload when updated in the cloud.
        * `loadIndex()` now accepts optional `LoadIndexOptions` with `autoRefresh` and `pollingIntervalInSeconds` parameters
        * When `autoRefresh` is enabled, the SDK polls for updates at the configured interval (default: 600 seconds)
        * To stop auto-refresh, call `loadIndex()` again without the `autoRefresh` option
      * `loadIndex()` now allows reloading an already-loaded index (previously threw an error)
    </Update>

    <Update label="2025-01-29" description="v1.0.0-beta.5">
      * Query optimizations for custom-embedding workflow
    </Update>

    <Update label="2025-01-28" description="v1.0.0-beta.4">
      * Fixed `ReferenceError: process is not defined` crash in browser environments. The SDK now works seamlessly across all JavaScript runtimes including browsers, Node.js, Deno, and Bun.
    </Update>

    <Update label="2025-01-24" description="v1.0.0-beta.3">
      **Added**

      * Support for user-supplied document embeddings during ingestion. The SDK supports optional `embedding` arrays in `DocumentInfo` payloads without using the native embedding service from moss.
      * Query overloads now accept `QueryOptions` so users can provide a custom embedding alongside query text.
      * Relaxed `modelId` requirement when creating indexes. The SDK aligns with the service default of `moss-minilm` when no explicit model is provided.
      * `query()` now automatically falls back to the cloud API when the index is not loaded locally, enabling queries without requiring `loadIndex()` first.

      **Enhancements**

      * New service endpoint with significant infrastructure upgrades. Management operations are now \~3× faster across most real-world use cases, providing faster index operations while also supporting larger payloads.
    </Update>

    <Update label="2025-11-30" description="v1.0.0-beta.2">
      **Fixed**

      * Fixed ESM (ES Module) import compatibility issue. The package now correctly exports as an ES module and can be imported using standard ESM syntax.

      **Upgrade Instructions**

      * Migrate from CommonJS (`require`) to ES Module syntax (`import`).
    </Update>

    <Update label="2025-10-01" description="v1.0.0-beta.1">
      Initial release of @inferedge/moss with core features:

      * Semantic search using transformer-based embeddings
      * Lightweight embedding models for edge computing; supports proprietary "moss-minilm" and "moss-mediumlm" models
      * Multi-index support for isolated search spaces
      * Add, update, and remove documents across indexes
      * Blazing fast querying support after loading indexes
      * TypeScript support with full type definitions
    </Update>
  </Tab>

  <Tab title="Moss CLI">
    <Update label="2026-04-24" description="v0.1.1">
      * Added named **config profiles** to switch between accounts and projects, and an **interactive mode** for `moss query`.
    </Update>
  </Tab>

  <Tab title="Portal">
    <Update label="2026-04-04">
      * Refreshed dashboard aesthetic and added **multi-org support** with team management.
    </Update>

    <Update label="2026-02-24">
      * Billing UI updates.
    </Update>

    <Update label="2026-02-23">
      * Self-service **password and profile updates** from account settings.
    </Update>
  </Tab>
</Tabs>

---

_Source: https://docs.moss.dev/docs/changelog.md_
