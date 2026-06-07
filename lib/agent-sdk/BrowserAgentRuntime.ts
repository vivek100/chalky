export type AgentMessage = {
  role: "user" | "agent" | "system";
  text: string;
};

export type SearchDoc = {
  id: string;
  text: string;
  metadata?: Record<string, string>;
  score?: number;
};

export type ActionProposal = {
  docId: string;
  label: string;
  selector?: string;
  action: string;
  safety: string;
  targetRoute?: string;
  reason: string;
};

export type AgentDecision = {
  reply: string;
  action?: ActionProposal;
};

export type BrowserRuntimeState = {
  route: string;
  pageTitle: string;
  visibleElements: Array<{
    agentId: string;
    tag: string;
    label: string;
    href?: string;
    disabled: boolean;
  }>;
};

type OpenAIDecision = {
  reply?: string;
  docId?: string | null;
  action?: "navigate" | "click" | "focus" | null;
  needsConfirmation?: boolean;
};

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_UNSAFE_OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.NEXT_PUBLIC_UNSAFE_OPENAI_MODEL || "gpt-4.1-mini";
const MOSS_PROJECT_ID = process.env.NEXT_PUBLIC_UNSAFE_MOSS_PROJECT_ID || "";
const MOSS_PROJECT_KEY = process.env.NEXT_PUBLIC_UNSAFE_MOSS_PROJECT_KEY || "";

function compactMessages(messages: AgentMessage[]) {
  return messages.slice(-8).map((message) => `${message.role}: ${message.text}`).join("\n");
}

function getOutputText(payload: any) {
  if (typeof payload.output_text === "string") return payload.output_text;

  const parts: string[] = [];
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") parts.push(content.text);
    }
  }
  return parts.join("\n");
}

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] || text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1)) as OpenAIDecision;
  } catch {
    return null;
  }
}

function proposalFromDoc(doc: SearchDoc, query: string, actionOverride?: string | null): ActionProposal | null {
  const metadata = doc.metadata || {};
  if (metadata.type === "page_route" && metadata.targetRoute) {
    return {
      docId: doc.id,
      label: metadata.label || metadata.title || metadata.targetRoute,
      action: actionOverride || metadata.action || "navigate",
      safety: metadata.safety || "safe",
      targetRoute: metadata.targetRoute,
      reason: `The request "${query}" matched ${metadata.label || metadata.title || metadata.targetRoute}.`
    };
  }

  if (metadata.type !== "page_element" || !metadata.selector || !metadata.action) return null;

  return {
    docId: doc.id,
    label: metadata.label || "matching element",
    selector: metadata.selector,
    action: actionOverride || metadata.action,
    safety: metadata.safety || "confirm",
    targetRoute: metadata.targetRoute,
    reason: `The request "${query}" matched ${metadata.label || doc.id}.`
  };
}

function heuristicDecision(query: string, docs: SearchDoc[]): AgentDecision {
  const proposal = docs.map((doc) => proposalFromDoc(doc, query)).find(Boolean) || undefined;
  if (!proposal) {
    return {
      reply: docs[0]?.text
        ? `I found relevant context, but I do not see a validated page action for it yet. ${docs[0].text.slice(0, 180)}`
        : "I could not find a matching page element in the loaded page index."
    };
  }

  return {
    reply:
      proposal.safety === "safe"
        ? `I found ${proposal.label}. I can take you there.`
        : `I found ${proposal.label}. I need your confirmation before I use it.`,
    action: proposal
  };
}

async function callOpenAI(query: string, docs: SearchDoc[], runtime: BrowserRuntimeState, messages: AgentMessage[]): Promise<OpenAIDecision | null> {
  if (!OPENAI_API_KEY) return null;

  const contextDocs = docs.map((doc, index) => ({
    rank: index + 1,
    id: doc.id,
    text: doc.text,
    metadata: doc.metadata,
    score: doc.score
  }));

  const prompt = [
    "You are a browser-resident voice agent embedded in the Moss demo website.",
    "Your job is to talk naturally and choose at most one validated page route or page element action from Moss search results.",
    "You cannot invent routes or selectors. Choose an action only from a returned document id.",
    "If a document safety is confirm, explain that confirmation is needed.",
    "Return only JSON with this shape:",
    '{"reply":"short spoken reply","docId":"matching document id or null","action":"navigate|click|focus|null","needsConfirmation":true}',
    "",
    `Current runtime state: ${JSON.stringify(runtime)}`,
    "",
    `Recent conversation:\n${compactMessages(messages)}`,
    "",
    `User said: ${query}`,
    "",
    `Moss results: ${JSON.stringify(contextDocs)}`
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: prompt,
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with HTTP ${response.status}`);
  }

  const payload = await response.json();
  return extractJson(getOutputText(payload));
}

export class BrowserMossAgentRuntime {
  private client: any = null;
  private loadedIndex: string | null = null;
  private localDocsById: Map<string, SearchDoc>;

  constructor(
    private readonly indexName: string,
    localDocs: SearchDoc[] = []
  ) {
    this.localDocsById = new Map(localDocs.map((doc) => [doc.id, doc]));
  }

  setLocalDocs(localDocs: SearchDoc[]) {
    this.localDocsById = new Map(localDocs.map((doc) => [doc.id, doc]));
  }

  async boot() {
    if (!MOSS_PROJECT_ID || !MOSS_PROJECT_KEY) {
      throw new Error("Missing unsafe browser Moss env values.");
    }

    if (!this.client) {
      const { MossClient } = await import("@moss-dev/moss-web");
      this.client = new MossClient(MOSS_PROJECT_ID, MOSS_PROJECT_KEY);
    }

    if (this.loadedIndex !== this.indexName) {
      await this.client.loadIndex(this.indexName);
      this.loadedIndex = this.indexName;
    }
  }

  readRuntimeState(): BrowserRuntimeState {
    const visibleElements = Array.from(document.querySelectorAll<HTMLElement>("[data-agent-id]"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const visible = rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
        if (!visible) return null;
        return {
          agentId: element.dataset.agentId || "",
          tag: element.tagName.toLowerCase(),
          label: (element.innerText || element.getAttribute("aria-label") || "").trim().slice(0, 80),
          href: element instanceof HTMLAnchorElement ? element.getAttribute("href") || undefined : undefined,
          disabled: element instanceof HTMLButtonElement ? element.disabled : false
        };
      })
      .filter(Boolean)
      .slice(0, 40) as BrowserRuntimeState["visibleElements"];

    return {
      route: window.location.pathname,
      pageTitle: document.title,
      visibleElements
    };
  }

  async search(query: string): Promise<SearchDoc[]> {
    await this.boot();
    const result = await this.client.query(this.indexName, query, { topK: 6 });
    return (result.docs || []).map((doc: SearchDoc) => {
      const localDoc = this.localDocsById.get(doc.id);
      if (!localDoc) return doc;

      return {
        ...doc,
        text: doc.text || localDoc.text,
        metadata: {
          ...localDoc.metadata,
          ...(doc.metadata || {})
        }
      };
    });
  }

  async decide(query: string, messages: AgentMessage[]): Promise<AgentDecision> {
    const docs = await this.search(query);
    const runtime = this.readRuntimeState();
    const openaiDecision = await callOpenAI(query, docs, runtime, messages);
    const heuristic = heuristicDecision(query, docs);

    if (!openaiDecision) return heuristic;

    const chosenDoc = docs.find((doc) => doc.id === openaiDecision.docId);
    const proposal = chosenDoc ? proposalFromDoc(chosenDoc, query, openaiDecision.action) || undefined : heuristic.action;

    return {
      reply: openaiDecision.reply || heuristic.reply,
      action: proposal
    };
  }
}
