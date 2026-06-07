import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MossClient, type DocumentInfo } from "@moss-dev/moss";
import type { AgentContextDoc } from "../lib/agent-context";

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;

  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), "..", ".env.local"));
loadEnvFile(resolve(process.cwd(), "..", "..", ".env.local"));

const projectId = process.env.MOSS_PROJECT_ID;
const projectKey = process.env.MOSS_PROJECT_KEY;
const indexName = process.env.MOSS_SITE_INDEX_NAME || process.env.MOSS_INDEX_NAME || "moss-demo-site";
const contextPath = resolve(process.cwd(), "content", "agent-context", "site-context.json");

if (!projectId || !projectKey) {
  throw new Error("Missing MOSS_PROJECT_ID or MOSS_PROJECT_KEY. Add them to .env.local.");
}

const mossProjectId = projectId;
const mossProjectKey = projectKey;

if (!existsSync(contextPath)) {
  throw new Error("Missing generated site context. Run npm run moss:generate-site-context first.");
}

const docs = JSON.parse(readFileSync(contextPath, "utf8")) as AgentContextDoc[];

async function main() {
  const client = new MossClient(mossProjectId, mossProjectKey);
  const mossDocs: DocumentInfo[] = docs.map((doc) => ({
    id: doc.id,
    text: doc.text,
    metadata: doc.metadata
  }));

  try {
    await client.getIndex(indexName);
    console.log(`Index '${indexName}' exists. Upserting ${mossDocs.length} docs...`);
    await client.addDocs(indexName, mossDocs, {
      upsert: true,
      onProgress: (progress) => console.log(`${progress.status}: ${progress.progress}%`)
    });
  } catch {
    console.log(`Creating index '${indexName}' with ${mossDocs.length} docs...`);
    await client.createIndex(indexName, mossDocs, {
      onProgress: (progress) => console.log(`${progress.status}: ${progress.progress}%`)
    });
  }

  await client.loadIndex(indexName);
  const result = await client.query(indexName, "show me livekit voice agent docs", { topK: 5 });
  console.log(`Indexed ${mossDocs.length} documents into '${indexName}'.`);
  console.log("Smoke query top matches:");
  for (const doc of result.docs) {
    console.log(`- ${doc.id} (${doc.score?.toFixed?.(3) ?? "n/a"})`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
