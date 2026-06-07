> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Indexing Data

> Prepare and upsert your content into Moss indexes

## Data model

Each document has an `id` and `text` (plus optional metadata). Use `moss-minilm` as the default model.

## Examples

<CodeGroup>
  ```ts JavaScript theme={null}
  import { MossClient } from '@moss-dev/moss'
  const client = new MossClient(process.env.MOSS_PROJECT_ID!, process.env.MOSS_PROJECT_KEY!)
  await client.createIndex('my-index', [
    { id: 'doc-1', text: '...', metadata: { category: 'faq', tags: 'returns,shipping', lang: 'en' } },
    { id: 'doc-2', text: '...' }
  ], { modelId: 'moss-minilm' })

  // Upsert more docs later
  await client.addDocs('my-index', [
    { id: 'doc-2', text: 'updated text' }, // will be updated
    { id: 'doc-3', text: 'new text' }
  ], { upsert: true })

  // Fetch specific docs
  const subset = await client.getDocs('my-index', { docIds: ['doc-1', 'doc-3'] })

  // Delete docs or the index when done
  await client.deleteDocs('my-index', ['doc-3'])
  await client.deleteIndex('my-index')
  ```

  ```python Python theme={null}
  from moss import MossClient, DocumentInfo, MutationOptions, GetDocumentsOptions

  client = MossClient(project_id, project_key)
  await client.create_index('my-index', [
      DocumentInfo(id='doc-1', text='...', metadata={'category': 'faq', 'tags': 'returns,shipping', 'lang': 'en'}),
      DocumentInfo(id='doc-2', text='...')
  ], 'moss-minilm')

  # Upsert more docs later
  await client.add_docs('my-index', [
      DocumentInfo(id='doc-2', text='updated text'),
      DocumentInfo(id='doc-3', text='new text')
  ], MutationOptions(upsert=True))

  # Fetch specific docs
  subset = await client.get_docs('my-index', GetDocumentsOptions(doc_ids=['doc-1', 'doc-3']))

  # Delete docs or the index when done
  await client.delete_docs('my-index', ['doc-3'])
  await client.delete_index('my-index')
  ```
</CodeGroup>

## Local-first indexing (sessions)

`createIndex` / `create_index` builds an index through the cloud (then keeps it usable locally). When you need to index *during* a live interaction - adding transcript turns mid-call or building a per-user working set - use a **session** instead. A session indexes documents locally in real time with no cloud round trip, embedding each document on-device, and lets you optionally push the result to the cloud when you're done.

```python theme={null}
import asyncio
from moss import DocumentInfo, MossClient

async def main():
    client = MossClient(project_id, project_key)

    # Create or resume a local index by name.
    session = await client.session(index_name="my-session-index")

    # Index locally in real time - embedded on-device, no network.
    await session.add_docs([
        DocumentInfo(id="turn-1", text="Customer confirmed the refund was received."),
    ])

    # Optionally push the session to the cloud when done.
    await session.push_index()

asyncio.run(main())
```

See [Sessions](/docs/integrate/sessions) for the full create-resume-query-push lifecycle.

## Notes

* `createIndex` / `create_index` will sync indexes to cloud (if enabled) while remaining usable locally
* Supports multiple indexes per project; pick the model per index:
  * `moss-minilm`: fast, lightweight (default)
  * `moss-mediumlm`: higher accuracy, still efficient
  * Use `moss-minilm` for speed-first, edge/offline use; use `moss-mediumlm` when you need higher recall/precision

## Chunking tips

* Aim for \~200-500 tokens per chunk
* Overlap 10-20% to preserve context
* Normalize whitespace and strip boilerplate

---

_Source: https://docs.moss.dev/docs/integrate/indexing-data.md_
