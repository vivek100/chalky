import { chromium } from "playwright";
import { landingAgentDocs } from "../lib/landing-agent-context";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const landingUrl = new URL("/integrations", baseUrl).toString();

function routeFrom(url: string) {
  const parsed = new URL(url);
  return parsed.pathname;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const failures: string[] = [];

  for (const doc of landingAgentDocs) {
    if (doc.metadata.type !== "page_element") continue;

    const { selector, action, label, targetRoute } = doc.metadata;
    if (!selector) {
      failures.push(`${doc.id}: missing selector metadata`);
      continue;
    }

    await page.goto(landingUrl, { waitUntil: "domcontentloaded" });

    const locator = page.locator(selector);
    const count = await locator.count();
    if (count !== 1) {
      failures.push(`${doc.id}: expected 1 match for ${selector}, found ${count}`);
      continue;
    }

    const first = locator.first();
    if (!(await first.isVisible())) {
      failures.push(`${doc.id}: selector is present but not visible (${selector})`);
      continue;
    }

    if (action === "navigate") {
      if (!targetRoute) {
        failures.push(`${doc.id}: navigate action missing targetRoute`);
        continue;
      }

      const beforeRoute = routeFrom(page.url());
      await first.click();

      if (beforeRoute !== targetRoute) {
        await page.waitForURL((url) => url.pathname === targetRoute, { timeout: 7000 });
      }
      await page.waitForLoadState("domcontentloaded", { timeout: 1000 }).catch(() => undefined);

      const actualRoute = routeFrom(page.url());
      if (actualRoute !== targetRoute) {
        failures.push(`${doc.id}: expected route ${targetRoute}, got ${actualRoute}`);
      }
    }

    if (action === "click" && label === "Talk to us") {
      await first.click();
      const dialog = page.getByRole("dialog");
      await dialog.waitFor({ state: "visible", timeout: 5000 });
      const title = dialog.getByRole("heading", { name: "Talk to us" });
      if (!(await title.isVisible())) {
        failures.push(`${doc.id}: click did not open the expected Talk to us dialog`);
      }
    }
  }

  await browser.close();

  if (failures.length) {
    console.error("Landing selector verification failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("Landing selector verification passed.");
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
