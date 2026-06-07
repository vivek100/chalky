> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Authentication

> Configure project credentials for the Moss SDKs

For SDK access, export your Moss project credentials in the shell.

```bash theme={null}
export MOSS_PROJECT_ID=your_project_id
export MOSS_PROJECT_KEY=your_project_key
```

<CodeGroup>
  ```ts JavaScript theme={null}
  import { MossClient } from '@moss-dev/moss'
  const client = new MossClient(process.env.MOSS_PROJECT_ID!, process.env.MOSS_PROJECT_KEY!)
  ```

  ```python Python theme={null}
  import os
  from moss import MossClient

  client = MossClient(os.getenv('MOSS_PROJECT_ID'), os.getenv('MOSS_PROJECT_KEY'))
  ```
</CodeGroup>

## Session authentication

Project credentials are validated when a session is opened: `client.session(...)` raises if they're invalid. For long-lived sessions, tokens are cached and auto-refreshed, so you stay authenticated without re-supplying credentials. See [Sessions](/docs/integrate/sessions).

---

_Source: https://docs.moss.dev/docs/integrate/authentication.md_
