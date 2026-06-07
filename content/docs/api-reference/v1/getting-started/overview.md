> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Overview

> Control Plane endpoint structure and shared request schema.

All API actions are multiplexed through the `/v1/manage` endpoint. Provide an `action` string plus the required fields for that operation. On success, handlers return `2xx` JSON payloads outlined below. Failures return structured errors:

```json theme={null}
{
  "error": "Human-readable message",
  "action": "addDocs" // present on server errors
}
```

Shared request schema:

| Field       | Type   | Required | Notes                                                                                                                                           |
| ----------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `action`    | string | ✅        | One of `initUpload`, `startBuild`, `getJobStatus`, `getIndex`, `listIndexes`, `deleteIndex`, `addDocs`, `deleteDocs`, `getDocs`, `getIndexUrl`. |
| `projectId` | string | ✅        | Project identifier issued by Moss Control.                                                                                                      |
| `indexName` | string | ▶︎       | Required for index-scoped actions.                                                                                                              |

> **Required headers:** `x-project-key` with your project access key and `x-service-version: v1`.

## Supported actions at a glance

| Action         | Purpose                                         | Extra required fields                           |
| -------------- | ----------------------------------------------- | ----------------------------------------------- |
| `initUpload`   | Get a presigned URL to upload index data.       | `indexName`, `modelId`, `docCount`, `dimension` |
| `startBuild`   | Trigger an index build after uploading data.    | `jobId`                                         |
| `getJobStatus` | Check the status of an async build job.         | `jobId`                                         |
| `getIndex`     | Fetch metadata for a single index.              | `indexName`                                     |
| `listIndexes`  | Enumerate every index under the project.        | None                                            |
| `deleteIndex`  | Remove an index record and assets.              | `indexName`                                     |
| `getIndexUrl`  | Get download URLs for a built index.            | `indexName`                                     |
| `addDocs`      | Upsert documents into an existing index.        | `indexName`, `docs`                             |
| `deleteDocs`   | Remove documents by ID.                         | `indexName`, `docIds`                           |
| `getDocs`      | Retrieve stored documents (without embeddings). | `indexName`                                     |

---

_Source: https://docs.moss.dev/docs/api-reference/v1/getting-started/overview.md_
