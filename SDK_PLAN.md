# Browser Agent SDK Plan

## Goal

Turn the demo into an embeddable browser-agent SDK that any website can install.

Host websites should only need to:

1. Add `data-agent-id` to key elements.
2. Build/index page context into Moss.
3. Mount the SDK widget once.

## Public Integration Shape

```tsx
import { AgentWidget } from "@/lib/agent-sdk";

<AgentWidget
  appId="customer-app"
  indexName="customer-site-index"
  contextDocs={generatedContextDocs}
  pageId="site"
/>
```

## SDK Modules

- `AgentWidget`: floating voice pill, transcript, approval UI.
- `BrowserAgentRuntime`: Moss search, OpenAI decision call, action proposal.
- `LiveKitVoiceSession`: browser-side LiveKit connection and mic publishing.
- `ActionExecutor`: selector validation and safe execution. Currently part of `AgentWidget`; extract next.
- `SessionStore`: localStorage session persistence. Currently part of `AgentWidget`; extract next.
- `ContextClient`: Moss browser SDK wrapper. Currently part of `BrowserAgentRuntime`; extract next.

## Site-Wide Context Track

Next scripts:

```text
scripts/generate-agent-context.ts
scripts/index-site-context.ts
scripts/verify-agent-context.ts
```

They should:

1. Discover routes from app data and docs manifest.
2. Visit each route with Playwright.
3. Extract page text chunks.
4. Extract selector/action chunks.
5. Verify every selector.
6. Upload one app-wide Moss index.

## Safety Contract

The model never executes raw selectors directly.

Execution must pass:

- selector exists
- selector matches exactly one element
- element is visible
- element is enabled for action
- confirmation is required for `confirm` actions
- `blocked` actions never execute
