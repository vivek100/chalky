> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# MossModel

[@moss-dev/moss](../api) / MossModel

# Type Alias: MossModel

> **MossModel** = `"moss-minilm"` | `"moss-mediumlm"` | `"custom"`

Available embedding models for text-to-vector conversion.

Each model offers different trade-offs between speed, accuracy, and resource usage:

* **moss-minilm**: Lightweight model optimized for speed and efficiency.
  Best for applications requiring fast response times with moderate accuracy requirements.

* **moss-mediumlm**: Balanced model offering higher accuracy with reasonable performance.
  Best for applications where search quality is important and moderate latency is acceptable.

* **custom**: Use this when providing pre-computed embeddings from external sources.
  No embedding model is loaded. All documents must include embeddings, and all queries
  must provide embeddings via QueryOptions.embedding.

---

_Source: https://docs.moss.dev/docs/reference/js/type-aliases/MossModel.md_
