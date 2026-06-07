> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# DSPy

> Use Moss as a retrieval module in DSPy programs for sub-10ms semantic search.

Integrate Moss semantic search into [DSPy](https://dspy.ai/) as a retrieval module. This setup lets you use Moss in DSPy programs, including ReAct agents, with sub-10ms retrieval latency for fast, composable LLM pipelines.

> **Note:** For a complete Jupyter notebook walkthrough, see the [DSPy cookbook](https://github.com/usemoss/moss/tree/main/examples/cookbook/dspy).

## Why use Moss with DSPy?

DSPy's retrieval modules connect external knowledge sources to composable LLM programs. Moss delivers sub-10ms semantic search through a standard `Retrieve` interface, giving your DSPy pipelines fast, accurate retrieval without managing vector database infrastructure.

## Required tools

* [Moss](https://www.moss.dev/) account with project credentials
* [OpenAI](https://openai.com/api/) API key (for LLM usage)
* [Python](https://www.python.org/) 3.10+

## Integration guide

<Steps>
  <Step title="Installation">
    ```bash theme={null}
    pip install moss dspy nest-asyncio python-dotenv
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

  <Step title="Use as a configured retriever">
    The cookbook provides a `MossRM` class that extends `dspy.Retrieve`. Register it as DSPy's default retriever, then use `dspy.Retrieve` throughout your programs.

    ```python theme={null}
    from moss import MossClient
    from moss_dspy import MossRM
    import dspy

    client = MossClient("your-project-id", "your-project-key")

    retriever_model = MossRM(
        index_name="your-index-name",
        moss_client=client,
        k=3,
        alpha=0.5,
    )

    dspy.configure(rm=retriever_model)

    # Now dspy.Retrieve will use Moss
    retrieve = dspy.Retrieve(k=3)
    results = retrieve("What is the return policy?")
    print(results.passages)
    ```
  </Step>

  <Step title="Use as a ReAct agent tool">
    You can also use Moss as a tool inside a DSPy ReAct agent for multi-step reasoning with search.

    ```python theme={null}
    from moss import MossClient, QueryOptions
    import asyncio
    import nest_asyncio
    import dspy

    nest_asyncio.apply()

    client = MossClient("your-project-id", "your-project-key")
    INDEX_NAME = "your-index-name"
    asyncio.get_event_loop().run_until_complete(client.load_index(INDEX_NAME))

    def moss_search(query: str):
        """Searches the Moss knowledge base for relevant passages."""
        loop = asyncio.get_event_loop()
        options = QueryOptions(top_k=5, alpha=0)
        results = loop.run_until_complete(client.query(INDEX_NAME, query, options=options))
        if not results.docs:
            return "No relevant info found."
        return "\n".join([f"- {doc.text}" for doc in results.docs])

    react_agent = dspy.ReAct(
        signature="question -> answer",
        tools=[moss_search],
        max_iters=5,
    )

    result = react_agent(question="What payment methods are accepted?")
    print(result.answer)
    ```
  </Step>
</Steps>

## Configuration

### MossRM

| Parameter     | Type         | Default  | Description                                                           |
| :------------ | :----------- | :------- | :-------------------------------------------------------------------- |
| `index_name`  | `str`        | Required | The name of the Moss index to query.                                  |
| `moss_client` | `MossClient` | Required | An initialized Moss client instance.                                  |
| `k`           | `int`        | `3`      | Default number of passages to retrieve.                               |
| `alpha`       | `float`      | `0.5`    | Hybrid search weighting. `0.0` = keyword only, `1.0` = semantic only. |

---

_Source: https://docs.moss.dev/docs/integrations/dspy.md_
