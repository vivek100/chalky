"use client";

import { Check, ChevronDown, ChevronUp, Mic, MicOff, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { connectBrowserLiveKit, type BrowserLiveKitSession } from "./LiveKitVoiceSession";
import { type ActionProposal, type AgentMessage, BrowserMossAgentRuntime, type SearchDoc } from "./BrowserAgentRuntime";

type BrowserAgentSession = {
  agentSessionId: string;
  pageId: string;
  pageIndex: string;
  currentRoute: string;
  conversationActive: boolean;
  messages: AgentMessage[];
  pendingAction?: ActionProposal;
  updatedAt: string;
};

type AgentStatus = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "action" | "error";

const DEFAULT_INDEX = process.env.NEXT_PUBLIC_UNSAFE_MOSS_INDEX_NAME || "moss-demo-landing";
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_UNSAFE_OPENAI_API_KEY || "";
const TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";
const TTS_MODEL = "gpt-4o-mini-tts";

export type AgentWidgetConfig = {
  appId: string;
  pageId?: string;
  indexName?: string;
  contextDocs?: SearchDoc[];
  contextUrl?: string;
  storageKey?: string;
  greeting?: string;
};

function createSession(config: Required<Pick<AgentWidgetConfig, "appId" | "indexName" | "storageKey">> & Pick<AgentWidgetConfig, "pageId">): BrowserAgentSession {
  return {
    agentSessionId: crypto.randomUUID(),
    pageId: config.pageId || "unknown",
    pageIndex: config.indexName,
    currentRoute: window.location.pathname,
    conversationActive: false,
    messages: [],
    updatedAt: new Date().toISOString()
  };
}

function isVisible(element: Element) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
}

function statusLabel(status: AgentStatus, liveKitStatus: string) {
  if (status === "connecting") return "Connecting...";
  if (status === "listening") return "Listening...";
  if (status === "thinking") return "Thinking...";
  if (status === "speaking") return "Speaking...";
  if (status === "action") return "Ready";
  if (status === "error") return "Needs attention";
  if (liveKitStatus === "connected") return "Talk to us";
  return "Talk to us";
}

export function AgentWidget({
  appId,
  pageId,
  indexName = DEFAULT_INDEX,
  contextDocs = [],
  contextUrl,
  storageKey,
  greeting = "Hi, I can guide you through this site. What would you like to find?"
}: AgentWidgetConfig) {
  const resolvedStorageKey = storageKey || `moss-agent-session:${appId}`;
  const [loadedContextDocs, setLoadedContextDocs] = useState<SearchDoc[]>(contextDocs);
  const [voiceMode, setVoiceMode] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [session, setSession] = useState<BrowserAgentSession | null>(null);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<AgentStatus>("connecting");
  const [liveKitStatus, setLiveKitStatus] = useState("not connected");
  const [bootError, setBootError] = useState<string | null>(null);
  const runtimeRef = useRef<BrowserMossAgentRuntime | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const liveKitRef = useRef<BrowserLiveKitSession | null>(null);
  const voiceModeRef = useRef(false);
  const startingRef = useRef(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(resolvedStorageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as BrowserAgentSession;
        setSession({
          ...parsed,
          currentRoute: window.location.pathname,
          conversationActive: parsed.conversationActive ?? false
        });
      } catch {
        window.localStorage.removeItem(resolvedStorageKey);
        setSession(createSession({ appId, pageId, indexName, storageKey: resolvedStorageKey }));
      }
    } else {
      setSession(createSession({ appId, pageId, indexName, storageKey: resolvedStorageKey }));
    }

    runtimeRef.current = new BrowserMossAgentRuntime(indexName, loadedContextDocs);
    runtimeRef.current
      .boot()
      .then(() => {
        setStatus("idle");
        setBootError(null);
      })
      .catch((error) => {
        setStatus("error");
        setBootError(error instanceof Error ? error.message : "Agent failed to boot.");
      });
  }, [appId, indexName, loadedContextDocs, pageId, resolvedStorageKey]);

  useEffect(() => {
    if (!contextUrl) {
      setLoadedContextDocs(contextDocs);
      return;
    }

    let cancelled = false;
    fetch(contextUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load agent context: HTTP ${response.status}`);
        return response.json();
      })
      .then((docs: SearchDoc[]) => {
        if (cancelled) return;
        setLoadedContextDocs(docs);
        runtimeRef.current?.setLocalDocs(docs);
      })
      .catch((error) => {
        if (!cancelled) {
          setBootError(error instanceof Error ? error.message : "Failed to load agent context.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [contextDocs, contextUrl]);

  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  useEffect(() => {
    if (!session) return;
    window.localStorage.setItem(
      resolvedStorageKey,
      JSON.stringify({
        ...session,
        currentRoute: window.location.pathname,
        updatedAt: new Date().toISOString()
      })
    );
  }, [session]);

  const audioSupported = useMemo(() => typeof window !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia) && "MediaRecorder" in window, []);
  const pendingAction = session?.pendingAction;
  const live = status === "connecting" || status === "listening" || status === "thinking" || status === "speaking";
  const hasMessages = Boolean(session?.messages.length || pendingAction || bootError);

  function updateSession(updater: (current: BrowserAgentSession) => BrowserAgentSession) {
    setSession((current) => {
      const base = current || createSession({ appId, pageId, indexName, storageKey: resolvedStorageKey });
      return updater(base);
    });
  }

  function appendMessage(message: AgentMessage) {
    updateSession((current) => ({
      ...current,
      conversationActive: true,
      currentRoute: window.location.pathname,
      messages: [...current.messages, message]
    }));
  }

  async function connectLiveKitIfNeeded(currentSession: BrowserAgentSession) {
    if (liveKitRef.current?.connected) return liveKitRef.current;

    const roomName = `moss-browser-agent-${currentSession.agentSessionId}`;
    const identity = `browser-agent-${currentSession.agentSessionId.slice(0, 8)}`;
    setLiveKitStatus("connecting");
    liveKitRef.current = await connectBrowserLiveKit(roomName, identity, setLiveKitStatus);
    return liveKitRef.current;
  }

  async function transcribeAudio(blob: Blob) {
    if (!OPENAI_API_KEY) throw new Error("Missing unsafe browser OpenAI API key.");

    const formData = new FormData();
    formData.append("model", TRANSCRIPTION_MODEL);
    formData.append("file", blob, "voice.webm");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) throw new Error(`Transcription failed with HTTP ${response.status}`);
    const payload = await response.json();
    return String(payload.text || "").trim();
  }

  async function speakWithOpenAI(text: string) {
    if (!OPENAI_API_KEY) return;

    setStatus("speaking");
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: TTS_MODEL,
        voice: "alloy",
        input: text,
        instructions: "Speak naturally and concisely, like an embedded voice agent guiding a website visitor."
      })
    });

    if (!response.ok) throw new Error(`Speech failed with HTTP ${response.status}`);

    const audioUrl = URL.createObjectURL(await response.blob());
    await new Promise<void>((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error("Speech playback failed."));
      };
      void audio.play().catch(reject);
    });
  }

  async function startListening() {
    if (startingRef.current || mediaRecorderRef.current?.state === "recording") return;
    const currentSession = session || createSession({ appId, pageId, indexName, storageKey: resolvedStorageKey });
    const chunks: Blob[] = [];

    try {
      startingRef.current = true;
      setVoiceMode(true);
      setStatus("connecting");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const liveKit = await connectLiveKitIfNeeded(currentSession);
      await liveKit.publishMicrophoneTrack(stream.getAudioTracks()[0]);

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = async () => {
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;

        if (!chunks.length) {
          setStatus("idle");
          return;
        }

        setStatus("thinking");
        try {
          const transcript = await transcribeAudio(new Blob(chunks, { type: "audio/webm" }));
          if (transcript) {
            await handleUserRequest(transcript, true);
          } else {
            setStatus("idle");
          }
        } catch (error) {
          appendMessage({ role: "system", text: error instanceof Error ? error.message : "Voice transcription failed." });
          setStatus("error");
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setStatus("listening");
    } catch (error) {
      appendMessage({ role: "system", text: error instanceof Error ? error.message : "Could not start microphone or LiveKit." });
      setStatus("error");
    } finally {
      startingRef.current = false;
    }
  }

  function stopListening() {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      return;
    }
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    setStatus("idle");
  }

  async function enterVoiceMode() {
    if (voiceModeRef.current && status === "listening") {
      stopListening();
      return;
    }

    setVoiceMode(true);
    setExpanded(false);

    const currentSession = session || createSession({ appId, pageId, indexName, storageKey: resolvedStorageKey });
    if (!currentSession.conversationActive && !currentSession.messages.length) {
      appendMessage({ role: "agent", text: greeting });
      try {
        await speakWithOpenAI(greeting);
      } catch {
        // Continue into listening even if playback fails.
      }
    }

    await startListening();
  }

  async function handleUserRequest(rawQuery: string, fromVoice = false) {
    const query = rawQuery.trim();
    if (!query || !runtimeRef.current) return;

    setStatus("thinking");
    appendMessage({ role: "user", text: query });

    try {
      const currentMessages = session?.messages || [];
      const decision = await runtimeRef.current.decide(query, currentMessages);

      updateSession((current) => ({
        ...current,
        conversationActive: true,
        messages: [...current.messages, { role: "agent", text: decision.reply }],
        pendingAction: decision.action,
        currentRoute: window.location.pathname
      }));

      await speakWithOpenAI(decision.reply).catch(() => undefined);

      if (decision.action) {
        setStatus("action");
        setExpanded(true);
      } else if (fromVoice && voiceModeRef.current) {
        await startListening();
      } else {
        setStatus("idle");
      }
    } catch (error) {
      const text = error instanceof Error ? error.message : "The browser agent failed.";
      appendMessage({ role: "system", text });
      setStatus("error");
      setExpanded(true);
    }
  }

  async function executeProposal(proposal: ActionProposal) {
    if (!proposal.selector && proposal.action === "navigate" && proposal.targetRoute) {
      window.location.assign(proposal.targetRoute);
      appendMessage({ role: "agent", text: `Done. I opened ${proposal.label}.` });
      updateSession((current) => ({ ...current, pendingAction: undefined, currentRoute: proposal.targetRoute || window.location.pathname }));
      setStatus("idle");
      return;
    }

    if (!proposal.selector) {
      appendMessage({ role: "system", text: `Blocked action. ${proposal.label} does not have a selector or route target.` });
      setStatus("error");
      setExpanded(true);
      return;
    }

    const matches = Array.from(document.querySelectorAll(proposal.selector));
    if (matches.length !== 1) {
      appendMessage({
        role: "system",
        text: `Blocked action. Selector ${proposal.selector} matched ${matches.length} elements.`
      });
      setStatus("error");
      setExpanded(true);
      return;
    }

    const element = matches[0] as HTMLElement;
    if (!isVisible(element)) {
      appendMessage({ role: "system", text: `Blocked action. ${proposal.label} is not visible.` });
      setStatus("error");
      setExpanded(true);
      return;
    }

    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.focus?.();

    if (proposal.action === "focus") {
      appendMessage({ role: "agent", text: `I focused ${proposal.label}.` });
      updateSession((current) => ({ ...current, pendingAction: undefined }));
      setStatus("idle");
      return;
    }

    if (proposal.action === "navigate" || proposal.action === "click") {
      element.click();
      appendMessage({ role: "agent", text: `Done. I used ${proposal.label}.` });
      updateSession((current) => ({ ...current, pendingAction: undefined, currentRoute: window.location.pathname }));
      setStatus("idle");
      return;
    }

    appendMessage({ role: "system", text: `Unsupported action: ${proposal.action}` });
    setStatus("error");
    setExpanded(true);
  }

  function leaveVoiceMode() {
    stopListening();
    liveKitRef.current?.disconnect();
    liveKitRef.current = null;
    setLiveKitStatus("not connected");
    setVoiceMode(false);
    setExpanded(false);
    setStatus(bootError ? "error" : "idle");
  }

  function resetSession() {
    window.localStorage.removeItem(resolvedStorageKey);
    liveKitRef.current?.disconnect();
    liveKitRef.current = null;
    setLiveKitStatus("not connected");
    setSession(createSession({ appId, pageId, indexName, storageKey: resolvedStorageKey }));
    setStatus(bootError ? "error" : "idle");
    setVoiceMode(false);
    setExpanded(false);
  }

  return (
    <div className="fixed bottom-7 right-7 z-50 flex w-[min(92vw,540px)] flex-col items-end gap-3">
      {expanded && hasMessages ? (
        <div className="max-h-[350px] w-full overflow-y-auto rounded-[24px] border border-moss-line bg-white/95 p-5 shadow-[0_24px_90px_rgba(18,16,28,0.18)] backdrop-blur">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-moss-muted">Live transcript</p>
          <div className="space-y-3">
            {bootError ? <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{bootError}</div> : null}
            {session?.messages.map((message, index) => (
              <div
                className={`max-w-[86%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto bg-[#f1e9ff] text-moss-ink"
                    : message.role === "system"
                      ? "mx-auto bg-amber-50 text-amber-900"
                      : "bg-moss-soft text-moss-ink"
                }`}
                key={`${message.role}-${index}`}
              >
                {message.text}
              </div>
            ))}
            {pendingAction ? (
              <div className="rounded-2xl border border-moss-line bg-white p-4 text-sm shadow-sm">
                <p className="font-medium text-moss-ink">{pendingAction.label}</p>
                <p className="mt-1 text-moss-muted">{pendingAction.reason}</p>
                <div className="mt-3 flex gap-2">
                  <button className="focus-ring inline-flex items-center gap-1 rounded-full bg-moss-ink px-3 py-2 text-xs font-medium text-white" onClick={() => executeProposal(pendingAction)}>
                    <Check size={14} /> {pendingAction.safety === "safe" ? "Run" : "Approve"}
                  </button>
                  <button className="focus-ring rounded-full border border-moss-line px-3 py-2 text-xs font-medium" onClick={() => updateSession((current) => ({ ...current, pendingAction: undefined }))}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void handleUserRequest(input);
              setInput("");
            }}
          >
            <input
              className="focus-ring min-w-0 flex-1 rounded-full border border-moss-line px-4 py-2 text-sm"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type only if needed..."
              value={input}
            />
            <button className="focus-ring grid size-10 place-items-center rounded-full bg-moss-ink text-white" aria-label="Send" type="submit">
              <Send size={17} />
            </button>
          </form>
        </div>
      ) : null}

      <div
        className={`flex h-[70px] min-w-[260px] items-center gap-3 rounded-full border bg-white px-5 shadow-[0_22px_80px_rgba(155,82,255,0.28)] transition-all ${
          voiceMode ? "border-[#b66cff]" : "border-transparent"
        }`}
      >
        <button
          className="focus-ring relative grid size-11 place-items-center rounded-full"
          data-agent-id="browser-agent-open"
          aria-label={voiceMode ? "Stop voice agent" : "Start voice agent"}
          disabled={!audioSupported || status === "connecting" || status === "thinking" || status === "speaking"}
          onClick={voiceMode ? (status === "listening" ? stopListening : startListening) : enterVoiceMode}
        >
          <span className={`absolute inset-0 rounded-full bg-[#d476ff]/25 ${live ? "animate-ping" : ""}`} />
          <span className="absolute inset-1 rounded-full bg-gradient-to-tr from-[#9d5cff] via-[#f3a6ff] to-white shadow-[0_0_18px_rgba(180,92,255,0.65)]" />
          <span className="relative size-5 rounded-full border-2 border-white/80" />
        </button>

        <button className="focus-ring min-w-[130px] text-left text-base font-semibold text-moss-ink" onClick={voiceMode ? undefined : enterVoiceMode}>
          {statusLabel(status, liveKitStatus)}
        </button>

        {voiceMode ? (
          <>
            <button
              className="focus-ring grid size-10 place-items-center rounded-full bg-moss-soft text-moss-ink"
              aria-label={status === "listening" ? "Stop recording" : "Start recording"}
              onClick={status === "listening" ? stopListening : startListening}
            >
              {status === "listening" ? <MicOff size={17} /> : <Mic size={17} />}
            </button>
            <button className="focus-ring grid size-10 place-items-center rounded-full bg-red-50 text-red-500" aria-label="End voice mode" onClick={leaveVoiceMode}>
              <X size={17} />
            </button>
            <button className="focus-ring grid size-10 place-items-center rounded-full text-moss-muted hover:bg-moss-soft" aria-label={expanded ? "Collapse transcript" : "Expand transcript"} onClick={() => setExpanded((value) => !value)}>
              {expanded ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
            </button>
          </>
        ) : (
          <button className="focus-ring grid size-10 place-items-center rounded-full text-moss-muted hover:bg-moss-soft" aria-label="Reset conversation" onClick={resetSession}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
