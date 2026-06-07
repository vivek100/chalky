> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Deployment / Production

> Checklist for shipping Moss-backed features

## Checklist

* Configure API keys via env vars
* Persist indexes to a durable path
* Monitor index size and query latency
* Enable sync (optional) and test offline mode
* Add health checks for embedding/runtime services

## Security

* Keep data local whenever possible
* Encrypt synced data at rest/in transit

## Observability

* Track query latency (p50/p95) and index size growth
* Log index lifecycle events (create/load/delete, rebuilds)
* Establish backup/export cadence for disaster recovery

---

_Source: https://docs.moss.dev/docs/integrate/deployment-production.md_
