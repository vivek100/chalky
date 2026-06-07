> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Moss CLI

> Manage indexes, documents, and queries from the terminal

Manage indexes, documents, and queries from the terminal.

```bash theme={null}
pip install moss-cli
```

The installed binary is `moss`.

## Authentication

Credentials are resolved in this order:

1. CLI flags: `--project-id` and `--project-key`
2. Environment variables: `MOSS_PROJECT_ID` and `MOSS_PROJECT_KEY`
3. Config profile: selected by `--profile`, `MOSS_PROFILE`, or the active profile in `~/.moss/config.json`

```bash theme={null}
# Interactive setup (recommended)
moss init
moss init --profile staging

# Environment variables
export MOSS_PROJECT_ID="your-project-id"
export MOSS_PROJECT_KEY="your-project-key"

# Inline flags
moss index list --project-id "..." --project-key "..."

# Profile-based
moss index list --profile staging
moss profile list
```

## Quick start

```bash theme={null}
# 1. Save credentials
moss init

# 2. List indexes
moss index list

# 3. Create an index from a JSON file
moss index create my-index -f docs.json --wait

# 4. Search it
moss query my-index "what is machine learning"

# 5. Search via cloud API (skips local download)
moss query my-index "neural networks" --cloud
```

## Index management

```bash theme={null}
# Create
moss index create my-index -f documents.json --model moss-minilm
moss index create my-index -f documents.json --wait

# List
moss index list

# Inspect
moss index get my-index

# Delete
moss index delete my-index
moss index delete my-index --confirm     # skip prompt
```

| Flag               | Description                                      |
| ------------------ | ------------------------------------------------ |
| `--file` / `-f`    | Path to JSON/CSV document file, or `-` for stdin |
| `--model` / `-m`   | Embedding model (default: `moss-minilm`)         |
| `--wait` / `-w`    | Block until the build job finishes               |
| `--poll-interval`  | Seconds between status checks (default: `2.0`)   |
| `--confirm` / `-y` | Skip confirmation prompt on delete               |

## Document management

```bash theme={null}
# Add documents
moss doc add my-index -f new-docs.json
moss doc add my-index -f docs.json --upsert --wait

# Retrieve documents
moss doc get my-index
moss doc get my-index --ids doc1,doc2,doc3

# Delete documents
moss doc delete my-index --ids doc1,doc2
```

| Flag              | Description                                      |
| ----------------- | ------------------------------------------------ |
| `--file` / `-f`   | Path to JSON/CSV document file, or `-` for stdin |
| `--upsert` / `-u` | Update documents that already exist              |
| `--ids` / `-i`    | Comma-separated document IDs                     |
| `--wait` / `-w`   | Block until the job finishes                     |

## Query

Queries download the index locally by default and run on-device. Add `--cloud` to skip the download and hit the cloud query API.

```bash theme={null}
# Local query (downloads the index on first use)
moss query my-index "what is deep learning"

# Tune results
moss query my-index "neural networks" --top-k 20 --alpha 0.3

# Cloud query
moss query my-index "transformers" --cloud

# Metadata filter (local only)
moss query my-index "shoes" --filter '{"field": "category", "condition": {"$eq": "footwear"}}'

# Pipe from stdin
echo "what is AI" | moss query my-index

# JSON output for scripting
moss query my-index "query" --json | jq '.docs[0].text'
```

| Flag             | Description                                                                     |
| ---------------- | ------------------------------------------------------------------------------- |
| `--top-k` / `-k` | Number of results (default: `10`)                                               |
| `--alpha` / `-a` | Semantic weight; `0.0` is pure keyword, `1.0` is pure semantic (default: `0.8`) |
| `--cloud` / `-c` | Query via cloud API instead of downloading the index                            |
| `--filter`       | Metadata filter as JSON string. Local mode only.                                |
| `--interactive`  | REPL session against a single loaded index                                      |

### Interactive mode

```bash theme={null}
moss query my-index --interactive
moss query my-index --interactive --top-k 20 --alpha 0.4
```

In the prompt:

```
/set alpha 0.5
/set top-k 10
/exit
```

Interactive mode is local-only (does not support `--cloud`) and is not compatible with `--json`. With redirected or piped stdin, the piped query is run once and the session exits.

## Job tracking

```bash theme={null}
# Check status
moss job status <job-id>

# Wait with live progress
moss job status <job-id> --wait
```

## Profiles

```bash theme={null}
moss profile list
moss profile delete staging --force
```

## Document file formats

### JSON

```json theme={null}
[
  {"id": "doc1", "text": "Machine learning fundamentals", "metadata": {"topic": "ml"}},
  {"id": "doc2", "text": "Deep learning with neural networks"},
  {"id": "doc3", "text": "Natural language processing", "metadata": {"topic": "nlp"}}
]
```

A wrapper form is also accepted: `{"documents": [...]}`.

### CSV

```csv theme={null}
id,text,metadata
doc1,Machine learning fundamentals,"{""topic"": ""ml""}"
doc2,Deep learning with neural networks,
doc3,Natural language processing,"{""topic"": ""nlp""}"
```

### stdin

```bash theme={null}
cat docs.json | moss index create my-index -f -
cat docs.json | moss doc add my-index -f -
```

## Global options

| Flag            | Short | Description                                       |
| --------------- | ----- | ------------------------------------------------- |
| `--project-id`  | `-p`  | Project ID; overrides env and config              |
| `--project-key` |       | Project key; overrides env and config             |
| `--profile`     |       | Credential profile name; overrides `MOSS_PROFILE` |
| `--json`        |       | Machine-readable JSON output                      |
| `--verbose`     | `-v`  | Enable debug logging                              |

## Models

| Model           | Description                                                       |
| --------------- | ----------------------------------------------------------------- |
| `moss-minilm`   | Lightweight, optimized for speed (default)                        |
| `moss-mediumlm` | Higher accuracy with reasonable performance                       |
| `custom`        | Used automatically when documents include pre-computed embeddings |

---

_Source: https://docs.moss.dev/docs/integrations/moss-cli.md_
