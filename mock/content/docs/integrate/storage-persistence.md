> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Storage & Persistence

> Persist loaded indexes to disk and keep them in sync with the cloud.

## How indexes are stored

Indexes live in the cloud. The SDKs fetch them into memory with
`loadIndex()` / `load_index()` so queries run locally without network round
trips. The canonical copy is always the cloud index - your local process holds
an in-memory snapshot for fast retrieval.

## Disk cache (JS SDK)

The JS SDK can cache the downloaded index to disk so subsequent loads skip
the network fetch when the cloud data hasn't changed. Pass a `cachePath` to
`loadIndex()`:

```ts theme={null}
import { MossClient } from '@moss-dev/moss'

const client = new MossClient(projectId, projectKey)

await client.loadIndex('my-index', {
  cachePath: '/var/cache/moss',
})
```

Auto-refresh writes through to the same cache, so restarts stay warm.

## Hot reload & auto-refresh

Enable `autoRefresh` to periodically poll the cloud and hot-swap the
in-memory index when a newer version is detected - in-flight queries are not
interrupted.

<CodeGroup>
  ```ts JavaScript theme={null}
  await client.loadIndex('my-index', {
    autoRefresh: true,
    pollingIntervalInSeconds: 300, // every 5 minutes
  })
  ```

  ```python Python theme={null}
  await client.load_index(
      "my-index",
      auto_refresh=True,
      polling_interval_in_seconds=300,
  )
  ```
</CodeGroup>

Calling `loadIndex()` again without `autoRefresh` stops the polling loop and
replaces the in-memory snapshot with a fresh download.

---

_Source: https://docs.moss.dev/docs/integrate/storage-persistence.md_
