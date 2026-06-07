import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import type { AgentContextDoc } from "../lib/agent-context";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3010";
const contextPath = resolve(process.cwd(), "content", "agent-context", "site-context.json");

if (!existsSync(contextPath)) {
  throw new Error("Missing generated site context. Run npm run moss:generate-site-context first.");
}

function routeFrom(url: string) {
  return new URL(url).pathname.replace(/\/$/, "") || "/";
}

async function main() {
  const docs = JSON.parse(readFileSync(contextPath, "utf8")) as AgentContextDoc[];
  const elementDocs = docs.filter((doc) => doc.metadata.type === "page_element" && doc.metadata.selector);
  const byRoute = new Map<string, AgentContextDoc[]>();

  for (const doc of elementDocs) {
    const route = doc.metadata.route;
    byRoute.set(route, [...(byRoute.get(route) || []), doc]);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const failures: string[] = [];

  let routeIndex = 0;
  for (const [route, routeDocs] of byRoute) {
    routeIndex += 1;
    if (routeIndex % 20 === 0 || routeIndex === 1) {
      console.log(`Verifying ${routeIndex}/${byRoute.size}: ${route}`);
    }
    await page.goto(new URL(route, baseUrl).toString(), { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(100);

    for (const doc of routeDocs) {
      const selector = doc.metadata.selector;
      const locator = page.locator(selector);
      const count = await locator.count();
      if (count !== 1) {
        failures.push(`${doc.id}: expected 1 match for ${selector} on ${route}, found ${count}`);
        continue;
      }

      if (!(await locator.isVisible())) {
        failures.push(`${doc.id}: selector is present but not visible on ${route}`);
        continue;
      }

      if (doc.metadata.action === "navigate" && doc.metadata.targetRoute) {
        const href = await locator.getAttribute("href").catch(() => null);
        if (!href) {
          failures.push(`${doc.id}: navigate action is missing href`);
          continue;
        }
        const actualRoute = routeFrom(new URL(href, baseUrl).toString());
        if (actualRoute !== doc.metadata.targetRoute) {
          failures.push(`${doc.id}: expected href route ${doc.metadata.targetRoute}, got ${actualRoute}`);
        }
      }
    }
  }

  await browser.close();

  if (failures.length) {
    console.error("Agent context verification failed:");
    for (const failure of failures.slice(0, 80)) console.error(`- ${failure}`);
    if (failures.length > 80) console.error(`...and ${failures.length - 80} more`);
    process.exit(1);
  }

  console.log(`Agent context verification passed for ${elementDocs.length} selectors across ${byRoute.size} routes.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
