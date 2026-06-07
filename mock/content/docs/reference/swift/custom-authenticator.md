> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Custom Authenticator

> Authenticate the Swift client with short-lived tokens from your backend.

[Swift SDK](./api) / Custom Authenticator

For shipped iOS apps, don't embed your long-lived `projectKey` in the binary.
Instead, implement the `Authenticator` protocol so the SDK fetches a
short-lived bearer token from your backend whenever it needs one.

## The protocol

```swift theme={null}
public protocol Authenticator: AnyObject, Sendable {
    func getAuthHeader() async throws -> String
}
```

The native runtime calls `getAuthHeader()` whenever it needs a fresh token for
an outbound request. Implementations typically fetch the token from your
server and cache it until expiry. The method may be called from any thread.

## Return-value contract

Return **the raw bearer token only** - do **not** include the `Bearer ` prefix.
The SDK constructs the full `Authorization: Bearer <token>` header itself.

```swift theme={null}
// ✅ correct
return "eyJhbGciOi..."

// ❌ wrong - the SDK prepends `Bearer ` itself
return "Bearer eyJhbGciOi..."
```

<Note>
  This differs from the JavaScript SDK's `IAuthenticator`, which returns the full
  `Bearer ...` value. The JS SDK builds the request in userland; the Swift SDK
  passes the token through the native layer, which adds the prefix. Don't copy
  the JS convention here.
</Note>

## Example

```swift theme={null}
import Moss

final class MyAuth: Authenticator {
    func getAuthHeader() async throws -> String {
        // Fetch / refresh a bearer token from your server.
        try await myServer.fetchMossToken()
    }
}

let client = try MossClient(projectId: "your-project-id", authenticator: MyAuth())
defer { client.close() }
```

See [`MossClient`](./classes/MossClient#initprojectidauthenticatorbaseurl) for
the matching initializer.

---

_Source: https://docs.moss.dev/docs/reference/swift/custom-authenticator.md_
