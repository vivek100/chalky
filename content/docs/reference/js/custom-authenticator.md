> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Custom Authenticator (JS)

> Authenticate browser/frontend clients without shipping your projectKey.

By default, `MossClient` authenticates using your `projectId` and `projectKey`:

```ts theme={null}
import { MossClient } from '@moss-dev/moss';

const client = new MossClient('your-project-id', 'your-project-key');
```

This works well for **server-side** code where secrets stay on the backend. For **browser / frontend** use, you should never embed your `projectKey` in client-side code. Instead, implement a custom `IAuthenticator` that fetches a short-lived token from your own backend.

## The `IAuthenticator` interface

The SDK exports `IAuthenticator` and `AuthToken` types from `@moss-dev/moss`. Their
shapes are shown below for reference - you don't need to redefine them in your code.

```ts theme={null}
// Exported from '@moss-dev/moss' - shown here for reference
interface AuthToken {
  token: string;      // Bearer token to send with each request
  expiresIn: number;  // Token lifetime in seconds, as returned by your backend
}

interface IAuthenticator {
  getAuthToken(): Promise<AuthToken>;
  getAuthHeader(): Promise<string>; // returns "Bearer <token>"
}
```

Both methods must be implemented. The SDK calls `getAuthHeader()` before every request.

## Recommended setup

### 1. Your backend - expose a token endpoint

Your backend holds the `projectKey` securely and uses the SDK to fetch a token, returning it directly to the frontend.

```ts theme={null}
// Example: Express route on your backend
import express from 'express';
import { MossClient } from '@moss-dev/moss';

const app = express();
const moss = new MossClient('your-project-id', 'your-project-key');

// Protect this route with your own auth middleware
app.get('/api/moss-token', yourAuthMiddleware, async (req, res) => {
  try {
    // getAuthToken() returns { token, expiresIn } - forward it directly
    res.json(await moss.getAuthToken());
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve token' });
  }
});
```

### 2. Your frontend - implement `IAuthenticator`

Since your backend forwards the Moss auth response unchanged, `response.json()` already matches the `AuthToken` shape - no manual mapping needed.

```ts theme={null}
import { MossClient } from '@moss-dev/moss';
import type { IAuthenticator, AuthToken } from '@moss-dev/moss';

class MyBackendAuthenticator implements IAuthenticator {
  async getAuthToken(): Promise<AuthToken> {
    const response = await fetch('/api/moss-token', {
      credentials: 'include', // include your session cookie / auth header
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Moss token: HTTP ${response.status}`);
    }

    return response.json(); // shape matches AuthToken: { token, expiresIn }
  }

  async getAuthHeader(): Promise<string> {
    const { token } = await this.getAuthToken();
    return `Bearer ${token}`;
  }
}

// Pass your authenticator to MossClient
const client = new MossClient('your-project-id', new MyBackendAuthenticator());
```

## Token caching

The SDK automatically wraps your authenticator with an internal caching layer. Tokens are cached for `expiresIn - 60` seconds, so your backend is only called when the token is about to expire - not on every SDK request. No extra setup is needed.

<Tip>Make sure your backend returns the correct `expiresIn` value so the cache TTL is accurate.</Tip>

## Summary

| Use case               | How to initialize                                         |
| ---------------------- | --------------------------------------------------------- |
| Server-side (Node.js)  | `new MossClient(projectId, projectKey)`                   |
| Frontend - custom auth | `new MossClient(projectId, new MyBackendAuthenticator())` |

**Rule of thumb:** your `projectKey` must never appear in browser-facing code. The custom authenticator pattern ensures it stays on your server while the frontend still gets authenticated access to Moss.

---

_Source: https://docs.moss.dev/docs/reference/js/custom-authenticator.md_
