import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { chromium } from "playwright";
import { getAgentRoutes } from "../lib/agent-routes";
import type { AgentContextDoc } from "../lib/agent-context";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3010";
const outPath = resolve(process.cwd(), "content", "agent-context", "site-context.json");
const publicOutPath = resolve(process.cwd(), "public", "agent-context", "site-context.json");

function idSafe(value: string) {
  return value.replace(/[^a-zA-Z0-9._/-]+/g, "-").replace(/\/+/g, "/");
}

async function main() {
  const routes = getAgentRoutes();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.addInitScript("globalThis.__name = (fn) => fn;");
  const docs: AgentContextDoc[] = [];

  for (const route of routes) {
    const url = new URL(route.route, baseUrl).toString();
    console.log(`Crawling ${route.route}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForLoadState("networkidle", { timeout: 3000 }).catch(() => undefined);

    const extracted = await page.evaluate(({ route, pageId, title, source }) => {
      const clean = (text: string | null | undefined) => (text || "").replace(/\s+/g, " ").trim();
      const quote = (value: string) => value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
      const cssEscape = (value: string) => {
        const css = (globalThis as any).CSS;
        return css?.escape ? css.escape(value) : value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
      };
      const visible = (element: Element) => {
        const html = element as HTMLElement;
        const rect = html.getBoundingClientRect();
        const style = getComputedStyle(html);
        return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
      };
      const unique = (selector: string) => document.querySelectorAll(selector).length === 1;
      const elementPath = (element: Element) => {
        const parts: string[] = [];
        let current: Element | null = element;
        while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.documentElement) {
          const parent: HTMLElement | null = current.parentElement as HTMLElement | null;
          const tag = current.tagName.toLowerCase();
          if (!parent) break;
          const currentTag = current.tagName;
          const siblings = Array.from(parent.children).filter((child) => child.tagName === currentTag);
          const index = siblings.indexOf(current) + 1;
          parts.unshift(`${tag}:nth-of-type(${index})`);
          const selector = parts.join(" > ");
          if (unique(selector)) return selector;
          current = parent;
        }
        return parts.join(" > ");
      };
      const selectorFor = (element: Element) => {
        const html = element as HTMLElement;
        const agentId = html.dataset.agentId;
        if (agentId) return `[data-agent-id='${quote(agentId)}']`;
        if (html.id && unique(`#${cssEscape(html.id)}`)) return `#${cssEscape(html.id)}`;
        const aria = html.getAttribute("aria-label");
        if (aria) {
          const ariaSelector = `${html.tagName.toLowerCase()}[aria-label='${quote(aria)}']`;
          if (unique(ariaSelector)) return ariaSelector;
        }
        const href = html instanceof HTMLAnchorElement ? html.getAttribute("href") : null;
        if (href) {
          const hrefSelector = `a[href='${quote(href)}']`;
          if (unique(hrefSelector)) return hrefSelector;
        }
        return elementPath(element);
      };
      const absoluteRoute = (href: string | null) => {
        if (!href) return "";
        try {
          const url = new URL(href, window.location.origin);
          if (url.origin !== window.location.origin) return "";
          return url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
        } catch {
          return "";
        }
      };

      const titleText = clean(document.querySelector("h1")?.textContent) || title || document.title;
      const textParts = Array.from(document.querySelectorAll("h1,h2,h3,p,li,th,td,label"))
        .map((node) => clean(node.textContent))
        .filter(Boolean);
      const pageText = [titleText, ...textParts].join("\n").slice(0, 9000);

      const elements = Array.from(document.querySelectorAll("a[href],button[data-agent-id],input[data-agent-id],textarea[data-agent-id],select[data-agent-id]"))
        .filter(visible)
        .map((element, index) => {
          const html = element as HTMLElement;
          const label = clean(html.innerText || html.getAttribute("aria-label") || html.getAttribute("placeholder") || html.getAttribute("name") || html.dataset.agentId);
          const href = html instanceof HTMLAnchorElement ? html.getAttribute("href") : "";
          const targetRoute = absoluteRoute(href);
          const tag = html.tagName.toLowerCase();
          const action = targetRoute ? "navigate" : tag === "input" || tag === "textarea" || tag === "select" ? "focus" : "click";
          const selector = selectorFor(element);
          const agentId = html.dataset.agentId || "";
          const nearby = clean(html.closest("section,article,main,header,footer,nav")?.querySelector("h1,h2,h3,p")?.textContent);
          return {
            id: `element:${route}:${index}:${agentId || label || tag}`,
            text: [
              `${label || tag} ${tag}.`,
              nearby ? `Nearby context: ${nearby}.` : "",
              targetRoute ? `Navigates to ${targetRoute}.` : "",
              `Page: ${titleText}. Route: ${route}.`
            ].filter(Boolean).join(" "),
            metadata: {
              type: "page_element",
              appId: "moss-browser-agent-demo",
              pageId,
              route,
              title: titleText,
              source,
              label: label || tag,
              selector,
              elementType: tag,
              action,
              safety: action === "navigate" || action === "focus" ? "safe" : "confirm",
              targetRoute
            }
          };
        })
        .filter((item) => item.metadata.selector)
        .slice(0, 28);

      return {
        pageDoc: {
          id: `page:${route}:text`,
          text: pageText,
          metadata: {
            type: "page_text",
            appId: "moss-browser-agent-demo",
            pageId,
            route,
            title: titleText,
            source
          }
        },
        elements
      };
    }, route);

    docs.push({
      id: idSafe(`route:${route.route}`),
      text: [
        `${route.title} page.`,
        `Route: ${route.route}.`,
        `Use this when the user asks to open, navigate to, go to, view, or learn about ${route.title}.`,
        `Source area: ${route.source}.`
      ].join(" "),
      metadata: {
        type: "page_route",
        appId: "moss-browser-agent-demo",
        pageId: route.pageId,
        route: route.route,
        title: route.title,
        label: route.title,
        source: route.source,
        action: "navigate",
        safety: "safe",
        targetRoute: route.route
      }
    });

    docs.push({
      id: idSafe(extracted.pageDoc.id),
      text: extracted.pageDoc.text,
      metadata: extracted.pageDoc.metadata
    });

    for (const element of extracted.elements) {
      docs.push({
        id: idSafe(element.id),
        text: element.text,
        metadata: element.metadata
      });
    }
  }

  await browser.close();

  mkdirSync(dirname(outPath), { recursive: true });
  mkdirSync(dirname(publicOutPath), { recursive: true });
  const json = JSON.stringify(docs, null, 2);
  writeFileSync(outPath, json);
  writeFileSync(publicOutPath, json);
  console.log(`Wrote ${docs.length} agent context docs.`);
  console.log(outPath);
  console.log(publicOutPath);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
