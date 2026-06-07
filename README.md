# Moss Browser Agent Demo

Embeddable browser voice agent demo for Moss-powered website guidance.

The app demonstrates an SDK-style integration:

- Host pages add stable `data-agent-id` attributes to important links and buttons.
- `lib/agent-sdk` renders a floating voice widget, connects LiveKit, records microphone audio, transcribes with OpenAI, searches Moss in the browser, speaks with OpenAI TTS, and validates selector actions before execution.
- `scripts/index-landing.ts` builds the first Moss page index.
- `scripts/verify-landing-selectors.ts` verifies selectors against the running app.

## Run

```bash
npm install
npm run moss:index-landing
npm run build
npm run start
```

Open:

```text
http://127.0.0.1:3000/integrations
```

For the local browser-only prototype, env values are read from `.env.local` and exposed through `NEXT_PUBLIC_UNSAFE_*` values in `next.config.mjs`.

## SDK Shape

The demo app consumes the SDK globally from `app/layout.tsx`:

```tsx
<AgentWidget
  appId="moss-browser-agent-demo"
  indexName="moss-demo-landing"
  contextDocs={landingAgentDocs}
  pageId="site"
/>
```

The current SDK modules live under:

```text
lib/agent-sdk/
  AgentWidget.tsx
  BrowserAgentRuntime.ts
  LiveKitVoiceSession.ts
  index.ts
```

## Important Scripts

```bash
npm run moss:index-landing
BASE_URL=http://127.0.0.1:3000 npm run verify:landing-selectors
npm run build
```

## Routes

- `/integrations`
- `/integrations/livekit`
- `/integrations/vapi`
- `/integrations/langchain`
- `/docs`
- `/dashboard`
- `/dashboard/api-keys`
- `/demo`

The next expansion is a site-wide context generator that crawls every route and creates one Moss index for page text and selector chunks.
