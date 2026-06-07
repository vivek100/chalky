> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Overview

> Semantic search in C with libmoss, the native Moss runtime.

`libmoss` is the native C library at the core of Moss. It exposes the same API
surface as the Python `moss-session` and Elixir `moss_session` packages through
a plain C ABI, so you can embed real-time semantic search directly into C, C++,
or any language with a C FFI.

It provides two handles:

* `MossClient` - the entry point. Construct it with your credentials, manage
  cloud indexes, load an index for querying, and open sessions.
* `MossSession` - a local index. Add and query documents on the same machine
  with no per-query network calls, then push to the cloud or pull an existing
  cloud index in.

## Install

`libmoss` ships as prebuilt binary release tarballs on GitHub, one per target
triple. Download the tarball for your platform from the
[releases page](https://github.com/usemoss/moss/releases) and extract it:

```bash theme={null}
VERSION=0.17.0

# Pick the tarball for your platform:
#   libmoss-v0.17.0-aarch64-apple-darwin.tar.gz      (macOS, Apple Silicon)
#   libmoss-v0.17.0-x86_64-apple-darwin.tar.gz       (macOS, Intel)
#   libmoss-v0.17.0-x86_64-unknown-linux-gnu.tar.gz  (Linux, x86_64)
#   libmoss-v0.17.0-aarch64-unknown-linux-gnu.tar.gz (Linux, arm64)

TARGET=aarch64-apple-darwin
curl -L -o libmoss.tar.gz \
  "https://github.com/usemoss/moss/releases/download/libmoss-v${VERSION}/libmoss-v${VERSION}-${TARGET}.tar.gz"
mkdir -p libmoss && tar -xzf libmoss.tar.gz -C libmoss
```

Each tarball contains:

* `libmoss.dylib` (macOS) / `libmoss.so` (Linux) - the shared library
* `libmoss.a` - the static library
* `libmoss.h` - the C header

<Note>
  `libmoss` is distributed only as GitHub binary releases. It is not published to
  crates.io.
</Note>

## Link

Point your compiler at the extracted `libmoss` directory for both the header
(`-I`) and the libraries (`-L`).

<CodeGroup>
  ```bash macOS theme={null}
  clang your_app.c -o your_app \
    -I/path/to/libmoss -L/path/to/libmoss -lmoss \
    -framework Security -framework SystemConfiguration
  ```

  ```bash Linux theme={null}
  gcc your_app.c -o your_app \
    -I/path/to/libmoss -L/path/to/libmoss -lmoss \
    -lpthread -lm -ldl
  ```
</CodeGroup>

At runtime the dynamic loader needs to find the shared library:

<CodeGroup>
  ```bash macOS theme={null}
  export DYLD_LIBRARY_PATH=/path/to/libmoss
  ./your_app
  ```

  ```bash Linux theme={null}
  export LD_LIBRARY_PATH=/path/to/libmoss
  ./your_app
  ```
</CodeGroup>

### Static linking

To produce a self-contained binary, replace `-lmoss` with the full path to
`libmoss.a` and add the platform libraries. No `DYLD_LIBRARY_PATH` /
`LD_LIBRARY_PATH` is needed at runtime.

<CodeGroup>
  ```bash macOS theme={null}
  clang your_app.c -o your_app \
    -I/path/to/libmoss /path/to/libmoss/libmoss.a \
    -framework Security -framework SystemConfiguration -lresolv
  ```

  ```bash Linux theme={null}
  gcc your_app.c -o your_app \
    -I/path/to/libmoss /path/to/libmoss/libmoss.a \
    -lpthread -lm -ldl
  ```
</CodeGroup>

## Quick start

Open a session, add documents (embedded locally with the built-in model),
query, and push the index to the cloud:

```c theme={null}
#include "libmoss.h"
#include <stdio.h>

int main(void) {
    MossClient *client = NULL;
    moss_client_new("your-project-id", "your-project-key", &client);

    // Open a session (auto-embeds with the built-in model).
    MossSession *session = NULL;
    moss_client_session(client, "my-index", NULL, &session);

    // Add documents. Metadata is optional; pass NULL / 0 to skip it.
    MossDocumentInfo docs[] = {
        { .id = "1", .text = "Billing refund request" },
        { .id = "2", .text = "How to grow tomatoes" },
    };
    size_t added = 0, updated = 0;
    moss_session_add_docs(session, docs, 2, NULL, &added, &updated);

    // Query locally - no network round trip.
    MossSearchResult *result = NULL;
    moss_session_query(session, "refund", NULL, &result);
    for (size_t i = 0; i < result->doc_count; i++) {
        printf("%s  score=%.4f\n", result->docs[i].id, result->docs[i].score);
    }
    moss_free_search_result(result);

    // Push to the cloud so other devices can load it.
    MossPushIndexResult *push = NULL;
    moss_session_push_index(session, &push);
    moss_free_push_index_result(push);

    moss_session_free(session);
    moss_client_free(client);
    return 0;
}
```

To query a cloud index from a `MossClient` instead, load it into memory first
with [`moss_client_load_index`](./api#mossclient) and then call
[`moss_client_query`](./api#mossclient). A `MossClient` query always runs
against a loaded index, so the load step is required.

```c theme={null}
MossIndexInfo *loaded = NULL;
moss_client_load_index(client, "my-index", NULL, &loaded);  // load first
moss_free_index_info(loaded);

MossSearchResult *result = NULL;
moss_client_query(client, "my-index", "refund", NULL, &result);  // then query
moss_free_search_result(result);
```

<Note>
  Every fallible call returns a `MossResult` code. The quick start omits the
  checks for brevity; production code should inspect the return value and call
  [`moss_last_error()`](./api#error-handling) on failure. See the
  [examples](./examples) for the full pattern.
</Note>

## Embedding models

Pass the model via `MossSessionOptions.model_id` when opening a session. The
default (`NULL`) uses the built-in model and embeds documents and queries
locally.

| Model                   | Behavior                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| `moss-minilm` (default) | Auto-embeds documents and queries locally.                                               |
| `moss-mediumlm`         | Higher quality, slightly slower.                                                         |
| `custom`                | You supply embeddings via `MossDocumentInfo.embedding` and `MossQueryOptions.embedding`. |

```c theme={null}
MossSessionOptions opts = { .model_id = "moss-mediumlm" };
MossSession *session = NULL;
moss_client_session(client, "my-index", &opts, &session);
```

## Next steps

* [API reference](./api) - every `MossClient` and `MossSession` function,
  memory-management rules, error handling, and the metadata-filter format.
* [Examples](./examples) - runnable session, cloud CRUD, and metadata-filtering
  programs.

---

_Source: https://docs.moss.dev/docs/reference/c/getting-started.md_
