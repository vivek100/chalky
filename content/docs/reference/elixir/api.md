> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Overview

> On-device semantic search for Elixir with the Moss Elixir SDK.

The Moss Elixir SDK (`moss` on Hex.pm) brings semantic search to Elixir
applications. Documents are embedded and queried on-device through a
high-performance Rust core, with optional cloud sync. The SDK ships built-in
embedding models, hybrid (semantic + keyword) search, and per-session indexing
for real-time workflows.

## Requirements

* Elixir 1.15 or higher
* OTP 26 or higher
* Valid Moss project credentials (`project_id` and `project_key`)

## Install

Add `moss` to your dependencies in `mix.exs`:

```elixir theme={null}
# mix.exs
defp deps do
  [{:moss, "~> 1.0"}]
end
```

Then fetch it:

```bash theme={null}
mix deps.get
```

Sign up at [the Moss portal](https://portal.usemoss.dev) to get your
`project_id` and `project_key`.

## Two ways to search

The Elixir SDK exposes two entry points:

* [`Moss.Client`](./classes/Client) - the entry point. Construct it with your
  credentials, manage cloud indexes, and load indexes into memory for fast local
  querying.
* [`Moss.Session`](./classes/Session) - a local, in-session index. Index
  documents in memory during a live workflow with no cloud round trips, then
  push to the cloud when done.

## Load before query

Querying always runs against an index that has been loaded into memory. Call
[`Moss.Client.load_index/3`](./classes/Client#load_index-client-name-opts) first,
then [`Moss.Client.query/4`](./classes/Client#query-client-name-query_text-opts).
Queries run entirely in-memory with no network round trip. There is no query
path that runs without first loading the index (or opening a session).

## Quick start

Create a client, create and populate a cloud index, load it, and query:

```elixir theme={null}
alias Moss.{Client, DocumentInfo}

# Initialize the client with your project credentials
{:ok, client} = Client.new("your-project-id", "your-project-key")

# Prepare documents to index
documents = [
  %DocumentInfo{
    id: "doc1",
    text: "How do I track my order? Log into your account to see live status.",
    metadata: %{"category" => "shipping"}
  },
  %DocumentInfo{
    id: "doc2",
    text: "What is your return policy? We offer a 30-day return policy.",
    metadata: %{"category" => "returns"}
  }
]

# Create a cloud index (defaults to the moss-minilm model)
{:ok, _} = Client.create_index(client, "faqs", documents)

# Load the index into memory before querying
{:ok, _} = Client.load_index(client, "faqs")

# Query the loaded index
{:ok, result} = Client.query(client, "faqs", "How do I return a damaged product?", top_k: 3, alpha: 0.6)

IO.puts("Query: #{result.query}")

for doc <- result.docs do
  IO.puts("#{doc.id} (#{Float.round(doc.score, 4)}): #{doc.text}")
end
```

## Sessions

For real-time indexing during live workflows (voice AI agents, chat), open a
session. Documents are indexed in memory with no cloud round trip, and you can
push the index to the cloud when done:

```elixir theme={null}
{:ok, client} = Moss.Client.new("project-id", "project-key")
{:ok, session} = Moss.Client.session(client, "session-abc")

docs = [
  %Moss.DocumentInfo{id: "turn-1", text: "Customer: I need to cancel my subscription"},
  %Moss.DocumentInfo{id: "turn-2", text: "Agent: I can help with that. Can I ask why?"}
]

{:ok, {2, 0}} = Moss.Session.add_docs(session, docs)
{:ok, result} = Moss.Session.query(session, "subscription cancellation", top_k: 2)

# Push the session index to the cloud when done
{:ok, _} = Moss.Session.push_index(session)
```

## Models

Two built-in embedding models run entirely in the Rust core:

* `moss-minilm` - lightweight, optimized for speed (the default).
* `moss-mediumlm` - higher accuracy with reasonable performance.

Pass `model_id: "custom"` to supply your own pre-computed embeddings via
[`DocumentInfo.embedding`](./types#documentinfo). With a custom model, each
document must set `embedding`, and queries must pass an `embedding:` option.

## Reference

* **Classes** - [Moss.Client](./classes/Client), [Moss.Session](./classes/Session)
* **Types** - [DocumentInfo, SearchResult, QueryResultDoc, IndexInfo, and more](./types)

---

_Source: https://docs.moss.dev/docs/reference/elixir/api.md_
