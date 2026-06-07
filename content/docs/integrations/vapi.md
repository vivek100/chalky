> ## Documentation Index
> Fetch the complete documentation index at: https://docs.moss.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# VAPI

> Connect Moss semantic search to VAPI voice agents via a Custom Knowledge Base webhook.

Integrate Moss semantic search into a [VAPI](https://vapi.ai/) voice agent using the `vapi-moss` package. This setup lets your conversational AI perform sub-10ms knowledge base lookups through VAPI's Custom Knowledge Base webhook, so your agent can answer questions instantly during live calls.

> **Note:** For a complete FastAPI server example, see the [vapi-moss app](https://github.com/usemoss/moss/tree/main/apps/vapi-moss).

## Why use Moss with VAPI?

VAPI's Custom Knowledge Base webhook fires on every user turn, expecting fast document retrieval. Moss responds in under 10ms, keeping voice interactions natural and fluid without added latency from traditional RAG pipelines.

## Required tools

* [Moss](https://www.moss.dev/) account with project credentials
* [VAPI](https://vapi.ai/) account with a Conversational AI agent
* [Python](https://www.python.org/) 3.10+

## Integration guide

<Steps>
  <Step title="Installation">
    ```bash theme={null}
    pip install vapi-moss
    ```
  </Step>

  <Step title="Environment setup">
    Create a `.env` file in your project root with your credentials.

    ```bash .env theme={null}
    # Moss Credentials
    MOSS_PROJECT_ID=your_project_id
    MOSS_PROJECT_KEY=your_project_key
    MOSS_INDEX_NAME=your_index_name

    # VAPI Webhook Secret (from your VAPI Knowledge Base config)
    VAPI_WEBHOOK_SECRET=your_webhook_secret
    ```
  </Step>

  <Step title="Search and verify signatures">
    Use `MossVapiSearch` to query your index and `verify_vapi_signature` to validate incoming webhook requests.

    ```python theme={null}
    from vapi_moss import MossVapiSearch, verify_vapi_signature

    # Initialize the search client
    search = MossVapiSearch(
        index_name="my-faq-index",
        top_k=5,
        alpha=0.8,
    )

    # Load the index at startup
    await search.load_index()

    # Search
    result = await search.search("How do I return an item?")
    print(result.documents)    # [{"content": "...", "similarity": 0.92}, ...]
    print(result.time_taken_ms)  # 3

    # Verify webhook signatures
    is_valid = verify_vapi_signature(
        raw_body=request_bytes,
        signature_header=headers["x-vapi-signature"],
        secret="your-webhook-secret",
    )
    ```
  </Step>

  <Step title="Configure VAPI">
    In your VAPI dashboard:

    1. Navigate to your agent's settings
    2. Under **Knowledge Base**, select **Custom Knowledge Base**
    3. Set the webhook URL to your server endpoint (e.g., `https://your-server.com/webhook`)
    4. Add your webhook secret to enable signature verification
  </Step>
</Steps>

## Configuration

### MossVapiSearch

| Parameter     | Type    | Default  | Description                                                           |
| :------------ | :------ | :------- | :-------------------------------------------------------------------- |
| `project_id`  | `str`   | `None`   | Your Moss Project ID. Falls back to `MOSS_PROJECT_ID` env var.        |
| `project_key` | `str`   | `None`   | Your Moss Project Key. Falls back to `MOSS_PROJECT_KEY` env var.      |
| `index_name`  | `str`   | Required | The name of the Moss index to query.                                  |
| `top_k`       | `int`   | `5`      | Number of results to retrieve per query.                              |
| `alpha`       | `float` | `0.8`    | Hybrid search weighting. `0.0` = keyword only, `1.0` = semantic only. |

---

_Source: https://docs.moss.dev/docs/integrations/vapi.md_
