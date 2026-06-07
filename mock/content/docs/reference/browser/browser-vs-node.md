> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Browser vs Node

> Choose between the Moss Browser/WASM SDK and the Node SDK.

[Browser SDK](./api) / Browser vs Node

Moss ships two JavaScript clients. They share a similar API surface but target
different environments. Pick the one that matches where your code runs.

## Which one do I use?

* Use [`@moss-dev/moss-web`](./api) for client-side, in-browser search. Queries
  run locally on WebAssembly, so once an index is loaded there are no server
  round-trips and no data leaves the device.
* Use [`@moss-dev/moss`](../js/api) for server-side (Node.js) workloads, such as
  API routes, backend services, and pipelines.

```typescript theme={null}
// In the browser
import { MossClient } from "@moss-dev/moss-web";

// On the server (Node.js)
import { MossClient } from "@moss-dev/moss";
```

## Differences

|                   | `@moss-dev/moss-web` (Browser)                                       | `@moss-dev/moss` (Node)                                  |
| ----------------- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| Environment       | Modern browsers, runs on WebAssembly                                 | Node.js server-side                                      |
| Where queries run | Locally in the browser after `loadIndex`                             | Server-side runtime                                      |
| Sessions          | Not supported                                                        | Supported (`client.session()`)                           |
| Persistence       | In-browser, per device                                               | Server-side                                              |
| Credentials       | Use a custom authenticator; never ship a `projectKey` in client code | `projectKey` can be used directly in trusted server code |

<Note>
  Both clients require an index to be loaded before querying. In the browser SDK,
  call [`loadIndex`](./classes/MossClient#loadindex) before
  [`query`](./classes/MossClient#query).
</Note>

---

_Source: https://docs.moss.dev/docs/reference/browser/browser-vs-node.md_
