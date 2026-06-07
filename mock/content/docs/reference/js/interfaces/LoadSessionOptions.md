> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# LoadSessionOptions

[@moss-dev/moss](../api) / LoadSessionOptions

# Interface: LoadSessionOptions

Options for [`SessionIndex.loadIndex()`](../classes/SessionIndex#loadindex) when pulling an
existing cloud index into a session.

## Properties

| Property                    | Type      | Description                                                                                                                                                                                                                      |
| --------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autoRefresh?`              | `boolean` | When `true`, the SDK starts a background poller that pulls newer cloud versions of this index into the session at the configured interval. Paused automatically while the session has un-pushed local edits. **Default** `false` |
| `pollingIntervalInSeconds?` | `number`  | Poll interval in seconds. Only used when `autoRefresh` is `true`. **Default** `600 (10 minutes)`                                                                                                                                 |

---

_Source: https://docs.moss.dev/docs/reference/js/interfaces/LoadSessionOptions.md_
