> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Quickstart

> Install, authenticate, create an index, and query it (JS/Python tabs)

Follow one path to a visible result. Choose your language tab.

## Prerequisites:

* Node.js 18+ or Python 3.10+
* Valid Moss project credentials (`MOSS_PROJECT_ID`, `MOSS_PROJECT_KEY`)
* JS: `@moss-dev/moss`; Python: `moss`

<Steps>
  <Step title="Install">
    <CodeGroup>
      ```bash JavaScript theme={null}
      npm install @moss-dev/moss
      ```

      ```bash Python theme={null}
      pip install moss
      ```
    </CodeGroup>
  </Step>

  <Step title="Configure credentials">
    From the Moss portal, copy your project credentials. Set them as env vars:

    ```bash theme={null}
    export MOSS_PROJECT_ID="your_project_id"
    export MOSS_PROJECT_KEY="your_project_key"
    ```
  </Step>

  <Step title="Create and query an index">
    Save and run `npx tsx quickstart.ts` or `python quickstart.py`):

    <CodeGroup>
      ```ts JavaScript theme={null}
      import { MossClient, DocumentInfo } from '@moss-dev/moss'
      const client = new MossClient(process.env.MOSS_PROJECT_ID!, process.env.MOSS_PROJECT_KEY!)
      const documents: DocumentInfo[] = [
        { id: 'doc1', text: 'How do I track my order? You can track your order by logging into your account.', metadata: { category: 'shipping' } },
        { id: 'doc2', text: 'What is your return policy? We offer a 30-day return policy for most items.', metadata: { category: 'returns' } },
        { id: 'doc3', text: 'How can I change my shipping address? Contact our customer service team.', metadata: { category: 'support' } },
      ]
      const indexName = 'faqs'
      await client.createIndex(indexName, documents, { modelId: 'moss-minilm' }) // default; use 'moss-mediumlm' for higher accuracy
      await client.loadIndex(indexName)
      const results = await client.query(indexName, 'How do I return a damaged product?', { topK: 3 })
      console.log(results.docs[0])
      ```

      ```python Python theme={null}
      import os
      import asyncio
      from moss import MossClient, DocumentInfo, QueryOptions
      client = MossClient(os.getenv("MOSS_PROJECT_ID"), os.getenv("MOSS_PROJECT_KEY"))
      index_name = "faqs"
      documents = [
          DocumentInfo(id="doc1", text="How do I track my order? You can track your order by logging into your account.", metadata={"category": "shipping"}),
          DocumentInfo(id="doc2", text="What is your return policy? We offer a 30-day return policy for most items.", metadata={"category": "returns"}),
          DocumentInfo(id="doc3", text="How can I change my shipping address? Contact our customer service team.", metadata={"category": "support"}),
      ]
      async def main():
          await client.create_index(index_name, documents, "moss-minilm")  # default; use "moss-mediumlm" for higher accuracy
          await client.load_index(index_name)
          results = await client.query(index_name, "How do I return a damaged product?", QueryOptions(top_k=3, alpha=0.6))
          print(f"  ID: {results.docs[0].id}")
          print(f"  Text: {results.docs[0].text}")
          print(f"  Score: {results.docs[0].score}")
      asyncio.run(main())
      ```
    </CodeGroup>
  </Step>
</Steps>

## Example output

```json theme={null}
{
  "id": "doc2",
  "score": 0.88,
  "text": "What is your return policy? We offer a 30-day return policy for most items."
}
```

<Tip>Need keyword-heavy results? In the Python SDK, use `alpha=0.0` for pure keyword, `alpha=1.0` for pure semantic, or a blend in between (see Retrieval for details).</Tip>

## Next steps

You just created a cloud index and queried it. Moss does much more:

<CardGroup cols={2}>
  <Card title="Core concepts" icon="book" href="/docs/start/core-concepts">
    Indexes, embeddings, retrieval, sessions, and sync in one place.
  </Card>

  <Card title="Sessions" icon="bolt" href="/docs/integrate/sessions">
    Local-first, real-time indexing during a live interaction.
  </Card>

  <Card title="Hybrid search" icon="scale-balanced" href="/docs/integrate/hybrid-search">
    Blend semantic and keyword scoring with `alpha`.
  </Card>

  <Card title="Metadata filtering" icon="filter" href="/docs/integrate/metadata-filtering">
    Narrow results with `$eq`, `$in`, `$near`, and more.
  </Card>

  <Card title="Custom embeddings" icon="vector-square" href="/docs/integrate/custom-embeddings">
    Bring your own vectors instead of the built-in model.
  </Card>

  <Card title="Multi-index search" icon="layer-group" href="/docs/integrate/multi-index-search">
    Query several indexes at once for a global top-K.
  </Card>

  <Card title="Data hydration & sync" icon="cloud-arrow-down" href="/docs/build/data-hydration-sync">
    Hydrate on-device indexes and keep them fresh.
  </Card>

  <Card title="SDK Overview" icon="code" href="/docs/reference/sdk">
    Full per-language API: Python, JavaScript, Swift, Elixir, Browser, C.
  </Card>
</CardGroup>

---

_Source: https://docs.moss.dev/docs/start/quickstart.md_
