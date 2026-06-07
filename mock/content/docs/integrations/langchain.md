> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# LangChain

> Use Moss as a retriever in LangChain chains and agents for sub-10ms semantic search.

Integrate Moss semantic search into [LangChain](https://python.langchain.com/) using a custom retriever and agent tool. This setup lets you use Moss in standard LangChain RAG pipelines and agentic workflows with sub-10ms retrieval latency.

> **Note:** For complete examples including RAG chains and ReAct agents, see the [LangChain cookbook](https://github.com/usemoss/moss/tree/main/examples/cookbook/langchain).

## Why use Moss with LangChain?

LangChain's retriever interface is the standard way to plug external knowledge into LLM chains. Moss delivers sub-10ms semantic search that slots directly into this interface, giving your chains and agents fast, accurate retrieval without the latency overhead of traditional vector databases.

## Required tools

* [Moss](https://www.moss.dev/) account with project credentials
* [OpenAI](https://openai.com/api/) API key (for LLM and agent usage)
* [Python](https://www.python.org/) 3.11+

## Integration guide

<Steps>
  <Step title="Installation">
    ```bash theme={null}
    pip install moss langchain langchain-openai python-dotenv
    ```
  </Step>

  <Step title="Environment setup">
    Create a `.env` file in your project root.

    ```bash .env theme={null}
    # Moss Credentials
    MOSS_PROJECT_ID=your_project_id
    MOSS_PROJECT_KEY=your_project_key
    MOSS_INDEX_NAME=your_index_name

    # OpenAI
    OPENAI_API_KEY=sk-...
    ```
  </Step>

  <Step title="Use as a retriever">
    The cookbook provides a `MossRetriever` class that implements LangChain's `BaseRetriever` interface. It loads the Moss index once and returns `Document` objects with metadata and relevance scores.

    ```python theme={null}
    from moss_langchain import MossRetriever

    retriever = MossRetriever(
        project_id="your-project-id",
        project_key="your-project-key",
        index_name="your-index-name",
        top_k=3,
        alpha=0.5,
    )

    # Use in async contexts (recommended)
    docs = await retriever.ainvoke("What is the return policy?")
    for doc in docs:
        print(doc.page_content, doc.metadata["score"])
    ```
  </Step>

  <Step title="Use as an agent tool">
    The cookbook also provides a `get_moss_tool()` function that wraps the retriever as a LangChain `Tool`, so agents can search the knowledge base autonomously.

    ```python theme={null}
    from moss_langchain import MossRetriever, get_moss_tool

    retriever = MossRetriever(
        project_id="your-project-id",
        project_key="your-project-key",
        index_name="your-index-name",
    )

    tool = get_moss_tool(retriever)
    # tool.name == "moss_search"
    # Use with create_openai_functions_agent or any LangChain agent
    ```
  </Step>
</Steps>

---

_Source: https://docs.moss.dev/docs/integrations/langchain.md_
