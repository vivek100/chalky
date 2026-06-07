> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# LiveKit

Integrate Moss Semantic Search SDK directly into a LiveKit Voice Agent. This setup allows your voice AI to perform ultra-low latency searches over your custom data to answer user questions in real-time. It pairs a persistent knowledge base with a per-call session that indexes the conversation as it happens.

## Why Use Moss with LiveKit?

Moss delivers sub-10ms semantic retrieval, ensuring your voice agents respond naturally without noticeable delays. A session gives each call its own local index, so the agent can recall what was said earlier in the conversation with no cloud round trip.

## Required Tools

* [Moss](https://www.moss.dev/)
* [LiveKit](https://livekit.io/)
* [OpenAI](https://openai.com/api/)
* [Deepgram](https://deepgram.com/)

## Integration Guide

<Steps>
  <Step title="Installation">
    Install the Moss SDK.

    ```bash theme={null}
    pip install moss \
        python-dotenv
    ```
  </Step>

  <Step title="Environment Setup">
    Create a `.env` file in your project root directory with your API keys.

    **File: `.env`**

    ```bash theme={null}
    # LiveKit Credentials, keep it as it is for local deployment, don't change it.
    LIVEKIT_URL=ws://localhost:7880
    LIVEKIT_API_KEY=devkey
    LIVEKIT_API_SECRET=secret

    # Moss Credentials
    MOSS_PROJECT_ID=your-moss-id
    MOSS_PROJECT_KEY=your-moss-key

    # AI Provider Keys
    OPENAI_API_KEY=sk-...
    DEEPGRAM_API_KEY=your-deepgram-key
    ```
  </Step>

  <Step title="Creating the Knowledge Base with Moss">
    Before the agent can answer questions, build the long-term knowledge base. Run this script once to upload your documents to Moss as a cloud index.

    **File: `build_index.py`**

    ```python theme={null}
    import asyncio
    import os
    from dotenv import load_dotenv
    from moss import MossClient, DocumentInfo

    load_dotenv()

    async def main():
        # Initialize the Moss Client
        client = MossClient(
            project_id=os.environ["MOSS_PROJECT_ID"],
            project_key=os.environ["MOSS_PROJECT_KEY"]
        )
        
        index_name = os.getenv("MOSS_INDEX_NAME", "product-knowledge")

        # Define documents
        docs = [
            DocumentInfo(
                id="1", 
                text="Our return policy allows returns within 30 days of purchase with a receipt."
            ),
            DocumentInfo(
                id="2", 
                text="Standard shipping takes 3-5 business days. Express shipping takes 1-2 days."
            ),
            DocumentInfo(
                id="3", 
                text="Technical support is available 24/7 via email at support@example.com."
            ),
        ]

        print(f"Creating index '{index_name}'...")
        
        await client.create_index(index_name, docs, model_id="moss-minilm")
        
        print("Index created successfully.")

    if __name__ == "__main__":
        asyncio.run(main())
    ```

    Run the builder:

    ```bash theme={null}
    python build_index.py
    ```
  </Step>

  <Step title="Building the Agent">
    This agent exposes Moss search as **function tools**. The LLM decides when to call them during a turn, reads the results, and uses them to answer, so it can search, refine, or skip retrieval on turns that don't need it.

    Two tools are registered:

    * `search_knowledge_base` queries the persistent knowledge base you built above (long-term context).
    * `search_conversation` queries this call's [session](/docs/reference/python/sessions) (short-term context) to recall something said earlier.

    Each user turn is also recorded into the session, and the session is pushed to the cloud when the call ends, so the conversation can be resumed or handed to another agent later.

    **File: `agent.py`**

    ```python theme={null}
    import logging
    import os
    from dotenv import load_dotenv
    from livekit.plugins import openai, deepgram, silero
    from livekit.plugins.turn_detector.english import EnglishModel
    from livekit.agents import (
        JobContext,
        WorkerOptions,
        cli,
        Agent,
        AgentSession,
        ChatContext,
        ChatMessage,
        RunContext,
        function_tool,
    )

    # Moss imports
    from moss import MossClient, DocumentInfo, QueryOptions

    load_dotenv()

    # Configuration
    MOSS_PROJECT_ID = os.getenv("MOSS_PROJECT_ID")
    MOSS_PROJECT_KEY = os.getenv("MOSS_PROJECT_KEY")
    KNOWLEDGE_INDEX = os.getenv("MOSS_INDEX_NAME", "product-knowledge")

    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("moss-agent")


    class MossSemanticRetrievalAgent(Agent):

        def __init__(self, moss_client: MossClient, moss_session):
            super().__init__(
                instructions="""
                    You are a helpful customer support voice assistant.
                    When you need facts about products or policies, call
                    search_knowledge_base. To recall something said earlier in this
                    call, call search_conversation. If the tools return nothing
                    useful, say you don't know.
                """
            )
            self.moss = moss_client
            self.moss_session = moss_session  # short-term, per-call SessionIndex
            self._turn = 0

        @function_tool
        async def search_knowledge_base(self, context: RunContext, query: str) -> str:
            """Search the product and support knowledge base.

            Args:
                query: A focused query describing the facts to look up.
            """
            results = await self.moss.query(
                KNOWLEDGE_INDEX, query, QueryOptions(top_k=5, alpha=0.8)
            )
            if not results.docs:
                return "No relevant entries found."
            return "\n".join(f"- {d.text}" for d in results.docs)

        @function_tool
        async def search_conversation(self, context: RunContext, query: str) -> str:
            """Recall something said earlier in this same call.

            Args:
                query: What to look for in the conversation so far.
            """
            results = await self.moss_session.query(query, QueryOptions(top_k=3))
            if not results.docs:
                return "Nothing relevant was said earlier in this call."
            return "\n".join(f"- {d.text}" for d in results.docs)

        async def on_user_turn_completed(self, turn_ctx: ChatContext, new_message: ChatMessage) -> None:
            # Record each turn in the session (local, ~1-5 ms) so it can be recalled
            # later via search_conversation and persisted at call end. This only
            # writes to the session; it does not inject anything into the prompt.
            self._turn += 1
            try:
                await self.moss_session.add_docs(
                    [DocumentInfo(id=f"user-turn-{self._turn}", text=new_message.text_content)]
                )
            except Exception as e:
                logger.error(f"Failed to index turn: {e}")

            await super().on_user_turn_completed(turn_ctx, new_message)


    async def entrypoint(ctx: JobContext):
        await ctx.connect()

        # Initialize Moss
        moss_client = MossClient(project_id=MOSS_PROJECT_ID, project_key=MOSS_PROJECT_KEY)

        # Long-term context: load the persistent knowledge base for in-process queries.
        try:
            await moss_client.load_index(KNOWLEDGE_INDEX)
            logger.info(f"Loaded knowledge index: {KNOWLEDGE_INDEX}")
        except Exception as e:
            logger.warning(f"Knowledge index not loaded: {e}. Run build_index.py first.")

        # Short-term context: open a session keyed to this call. It auto-loads if a
        # cloud index with this name already exists (an earlier handoff), or starts
        # empty for a brand-new call.
        call_id = f"call-{ctx.room.name}"
        moss_session = await moss_client.session(index_name=call_id)
        logger.info(f"Opened session '{call_id}' ({moss_session.doc_count} docs loaded)")

        # When the call ends, push the session to the cloud so the conversation can
        # be resumed later or handed off to another agent.
        async def persist_session():
            try:
                result = await moss_session.push_index()
                logger.info(f"Pushed session '{call_id}': {result.doc_count} docs")
            except Exception as e:
                logger.error(f"Failed to push session: {e}")

        ctx.add_shutdown_callback(persist_session)

        # Create the LiveKit voice pipeline.
        session = AgentSession(
            stt=deepgram.STT(),
            llm=openai.LLM(model="gpt-4o"),
            tts=openai.TTS(),
            turn_detection=EnglishModel(),
            vad=silero.VAD.load(),
        )

        # Start the session with our custom MossSemanticRetrievalAgent.
        await session.start(
            agent=MossSemanticRetrievalAgent(moss_client, moss_session),
            room=ctx.room,
        )

    if __name__ == "__main__":
        cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
    ```

    <Note>
      The session indexes each turn locally during the call and pushes to the cloud
      at the end, so a later session opened with the same name resumes the
      conversation, which is the basis for cross-agent handoff. See
      [Sessions](/docs/reference/python/sessions) for the full API.
    </Note>
  </Step>

  <Step title="Running the Agent">
    First, start the LiveKit server in development mode:

    ```bash theme={null}
    livekit-server --dev
    ```

    Then, in a separate terminal, start your worker. The necessary VAD models will handle themselves or be downloaded automatically if needed by the plugin.

    ```bash theme={null}
    python agent.py download-files
    python agent.py console
    ```
  </Step>
</Steps>

---

_Source: https://docs.moss.dev/docs/integrations/livekit.md_
