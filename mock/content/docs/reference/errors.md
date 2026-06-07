> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Errors & Troubleshooting

> Reference for common Moss SDK errors and how to fix them

## Error reference

| Error                        | Cause                                                   | Fix                                                                                         |
| ---------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `Unauthorized`               | Missing or invalid credentials                          | Set `MOSS_PROJECT_ID` and `MOSS_PROJECT_KEY` in your environment                            |
| `Index not found`            | Querying or loading an index that doesn't exist         | Call `createIndex()` first; verify the name matches exactly (case-sensitive)                |
| `Index not loaded`           | Calling `query()` before `loadIndex()`                  | Call `loadIndex(name)` before `query()`. `query()` throws if the index isn't loaded locally |
| `Index already exists`       | Calling `createIndex()` on an existing index name       | Use `addDocs()` with `upsert: true` to update documents, or delete the index first          |
| `Missing embeddings runtime` | Invalid or unrecognised `modelId`                       | Use `moss-minilm`, `moss-mediumlm`, or `custom`                                             |
| `Embedding required`         | Using `modelId: 'custom'` without providing `embedding` | Supply an `embedding` array on every document and every `query()` call                      |
| `Job failed`                 | Async mutation error                                    | Inspect `JobStatusResponse.error` via `getJobStatus(jobId)`                                 |

***

## Common scenarios

### Search results are irrelevant

* **Try hybrid search**: lower `alpha` for more keyword matching (default is `0.8`):
  ```ts theme={null}
  await client.query('my-index', 'query text', { topK: 5, alpha: 0.5 })
  ```
* **Check document chunking**: very long documents dilute embedding signal. Aim for 200-500 tokens per chunk.
* **Switch models**: try `moss-mediumlm` for higher accuracy.

***

## SDK error behaviour

* Most methods throw if the target index does not exist.
* `createIndex()` throws if the index already exists.
* `loadIndex()` throws if the index does not exist in cloud storage or loading fails.

If a job reaches `"failed"`, its `JobStatusResponse.error` will be non-null. The job's `currentPhase` (see [JobPhase](/docs/reference/js/type-aliases/JobPhase)) can hint at where it failed - a job stuck on `downloading` usually means a network issue.

***

## Still stuck?

* Join the [Moss Discord](https://discord.gg/eMXExuafBR) for community help
* Open an issue on [GitHub](https://github.com/usemoss/moss)

---

_Source: https://docs.moss.dev/docs/reference/errors.md_
