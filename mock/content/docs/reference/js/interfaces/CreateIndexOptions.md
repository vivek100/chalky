> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# CreateIndexOptions

[@moss-dev/moss](../api) / CreateIndexOptions

# Interface: CreateIndexOptions

Options for creating an index.

## Properties

| Property      | Type                   | Description                                                                                               |
| ------------- | ---------------------- | --------------------------------------------------------------------------------------------------------- |
| `modelId?`    | `string`               | Embedding model to use. Defaults to "moss-minilm", or "custom" if documents have pre-computed embeddings. |
| `onProgress?` | (`progress`) => `void` | Callback invoked with progress updates (\~every 2s) while the server is processing.                       |

---

_Source: https://docs.moss.dev/docs/reference/js/interfaces/CreateIndexOptions.md_
