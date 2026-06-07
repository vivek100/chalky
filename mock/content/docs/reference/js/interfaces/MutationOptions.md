> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# MutationOptions

[@moss-dev/moss](../api) / MutationOptions

# Interface: MutationOptions

Options for async mutation operations (addDocs, deleteDocs).

## Properties

| Property      | Type                   | Description                                                                                        |
| ------------- | ---------------------- | -------------------------------------------------------------------------------------------------- |
| `upsert?`     | `boolean`              | Whether to update existing documents with the same ID. Only applies to addDocs. **Default** `true` |
| `onProgress?` | (`progress`) => `void` | Callback invoked with progress updates (\~every 2s) while the server is processing.                |

---

_Source: https://docs.moss.dev/docs/reference/js/interfaces/MutationOptions.md_
