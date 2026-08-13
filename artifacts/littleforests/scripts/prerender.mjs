/**
 * Post-build prerender step.
 *
 * Why this exists: the site is a client-rendered React SPA. Vite's build
 * output (dist/public/index.html) is just `<div id="root">` — real content
 * only appears after JS runs in a browser. Most AI crawlers (GPTBot,
 * ClaudeBot, PerplexityBot, ChatGPT-User) do not execute JavaScript, and
 * Googlebot's JS rendering is delayed/unreliable for indexing. So every
 * route needs a static HTML snapshot with the real, rendered content.
 *
 * This script:
 *   1. Starts the built Express server locally (so /api/* routes work
 *      against the real database).
 *   2. Fetches the live product list so every /products/:id page gets a
 *      snapshot, not just the static pages.
 *   3. Uses Puppeteer to visit each route, wait for it to fully render
 *      (including react-helmet-async's title/meta/JSON-LD injection into
 *      <head>, and React Query's data fetch), and captures the final HTML.
 *   4. Writes each snapshot to dist/public/<route>/index.html, so Vercel's
 *      static file handling serves the real content directly — no server
 *      round-trip needed at request time, and no risk of showing crawlers
 *      something different from what users eventually see (React still
 *      hydrates on top of this HTML exactly as normal).
 *
 * Requires: the real API/DB to be reachable (same env vars as production),
 * and network access to download Puppeteer's bundled Chromium during
 * `npm install` (this happens automatically in Vercel's build step, which
 * has full internet access).
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';

const PORT = 5000;
const ORIGIN = `http://localhost:${PORT}`;
const OUT_DIR = path.resolve('dist/public');

const STATIC_ROUTES = ['/', '/about', '/green-towns', '/contact', '/donate', '/blog'];

async function waitForServer(timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${ORIGIN}/api/products`);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await sleep(500);
  }
  throw new Error(`Server did not become ready on ${ORIGIN} within ${timeoutMs}ms`);
}

async function getProductRoutes() {
  try {
    const res = await fetch(`${ORIGIN}/api/products`);
    if (!res.ok) throw new Error(`GET /api/products -> ${res.status}`);
    const products = await res.json();
    if (!Array.isArray(products)) return [];
    return products
      .filter((p) => p && p.id != null)
      .map((p) => `/products/${p.id}`);
  } catch (err) {
    console.error('[prerender] Could not fetch product list — skipping product pages:', err.message);
    return [];
  }
}

async function snapshotRoute(browser, route) {
  const page = await browser.newPage();
  try {
    await page.goto(`${ORIGIN}${route}`, { waitUntil: 'networkidle0', timeout: 30_000 });
    // Give React Query + react-helmet-async a beat to settle after the
    // network-idle event (helmet updates <head> synchronously on render,
    // but a trailing state update can land a tick later).
    await sleep(300);
    const html = await page.content();

    const outPath =
      route === '/' ? path.join(OUT_DIR, 'index.html') : path.join(OUT_DIR, route.slice(1), 'index.html');
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, 'utf-8');
    console.log(`[prerender] ${route} -> ${path.relative(process.cwd(), outPath)}`);
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('[prerender] Starting built server...');
  const server = spawn('node', ['dist/index.js'], {
    env: { ...process.env, VERCEL: '', PORT: String(PORT) },
    stdio: 'inherit',
  });

  const cleanup = () => {
    if (!server.killed) server.kill();
  };
  process.on('exit', cleanup);
  process.on('SIGINT', () => {
    cleanup();
    process.exit(1);
  });

  try {
    await waitForServer();
    console.log('[prerender] Server ready.');

    const productRoutes = await getProductRoutes();
    const routes = [...STATIC_ROUTES, ...productRoutes];
    console.log(`[prerender] Snapshotting ${routes.length} routes (${productRoutes.length} products)...`);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    try {
      // Sequential on purpose — keeps DB/API load predictable during build
      // and makes failures easy to attribute to a specific route.
      for (const route of routes) {
        try {
          await snapshotRoute(browser, route);
        } catch (err) {
          console.error(`[prerender] FAILED ${route}:`, err.message);
        }
      }
    } finally {
      await browser.close();
    }

    console.log('[prerender] Done.');
  } finally {
    cleanup();
  }
}

main().catch((err) => {
  console.error('[prerender] Fatal error:', err);
  process.exit(1);
});
