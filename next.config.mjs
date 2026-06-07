import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(path) {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_UNSAFE_MOSS_PROJECT_ID: process.env.NEXT_PUBLIC_UNSAFE_MOSS_PROJECT_ID || process.env.MOSS_PROJECT_ID || "",
    NEXT_PUBLIC_UNSAFE_MOSS_PROJECT_KEY: process.env.NEXT_PUBLIC_UNSAFE_MOSS_PROJECT_KEY || process.env.MOSS_PROJECT_KEY || "",
    NEXT_PUBLIC_UNSAFE_MOSS_INDEX_NAME: process.env.NEXT_PUBLIC_UNSAFE_MOSS_INDEX_NAME || process.env.MOSS_INDEX_NAME || "moss-demo-site",
    NEXT_PUBLIC_UNSAFE_OPENAI_API_KEY: process.env.NEXT_PUBLIC_UNSAFE_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "",
    NEXT_PUBLIC_UNSAFE_OPENAI_MODEL: process.env.NEXT_PUBLIC_UNSAFE_OPENAI_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini",
    NEXT_PUBLIC_UNSAFE_LIVEKIT_URL: process.env.NEXT_PUBLIC_UNSAFE_LIVEKIT_URL || process.env.LIVEKIT_URL || "",
    NEXT_PUBLIC_UNSAFE_LIVEKIT_API_KEY: process.env.NEXT_PUBLIC_UNSAFE_LIVEKIT_API_KEY || process.env.LIVEKIT_API_KEY || process.env.LIVEKIT_KEY || "",
    NEXT_PUBLIC_UNSAFE_LIVEKIT_API_SECRET:
      process.env.NEXT_PUBLIC_UNSAFE_LIVEKIT_API_SECRET || process.env.LIVEKIT_API_SECRET || process.env.LIVEKIT_SECRET || process.env.LIVEKIT_KEY || ""
  }
};

export default nextConfig;
