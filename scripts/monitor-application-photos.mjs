// Read-only monitor for product application photos.
//
// Compares the published CMS rows in Supabase (source of truth) with what the
// live static site actually ships, and remembers the previous run's CMS counts
// so silent CMS-side losses (e.g. a stale admin tab overwriting a product) are
// caught too. No AI, no writes to the CMS: it only reads, then reports.
//
// Env: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SITE_URL (optional),
//      STATE_FILE (optional, default .photo-monitor/state.json),
//      REPORT_FILE (optional, default .photo-monitor/report.md),
//      CHECK_ASSETS=1 to also request every live photo URL.
// Exit code 1 only when a *new* alert appears, so an ongoing problem is not
// re-notified every hour.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const LIVE_GRACE_MINUTES = 45;
const UNKNOWN_ALERT_AFTER = 3;

/** Return the object literal (including braces) that starts at `start`. */
export function sliceObjectLiteral(code, start) {
  let depth = 0;
  let quote = null;
  for (let i = start; i < code.length; i += 1) {
    const ch = code[i];
    if (quote) {
      if (ch === "\\") i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return code.slice(start, i + 1);
    }
  }
  return null;
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Count string entries of `field:[...]` inside an object literal, or null when absent. */
export function countArrayField(objectLiteral, field) {
  const match = objectLiteral.match(new RegExp(`(?:^|[{,])${field}:\\[([^\\]]*)\\]`));
  if (!match) return null;
  return (match[1].match(/"(?:[^"\\]|\\.)*"/g) ?? []).length;
}

/**
 * Find the product override map in the live JS (keyed by slug, with
 * applicationImageUrls/applicationThumbnailUrls) and return per-slug counts.
 */
export function parseLiveOverrides(code, slugs) {
  /** @type {Record<string, { images: number; thumbnails: number; urls: string[] }>} */
  const result = {};
  for (const slug of slugs) {
    const key = new RegExp(`[{,](?:"${escapeRegExp(slug)}"|${escapeRegExp(slug)}):\\{`, "g");
    let match;
    while ((match = key.exec(code)) !== null) {
      const literal = sliceObjectLiteral(code, match.index + match[0].length - 1);
      if (!literal || !/(^|[{,])applicationThumbnailUrls:\[/.test(literal)) continue;
      result[slug] = {
        images: countArrayField(literal, "applicationImageUrls") ?? 0,
        thumbnails: countArrayField(literal, "applicationThumbnailUrls") ?? 0,
        urls: [
          ...(literal.match(/applicationImageUrls:\[([^\]]*)\]/)?.[1].match(/"(?:[^"\\]|\\.)*"/g) ?? []),
          ...(literal.match(/applicationThumbnailUrls:\[([^\]]*)\]/)?.[1].match(/"(?:[^"\\]|\\.)*"/g) ?? []),
        ].map((value) => JSON.parse(value)),
      };
      break;
    }
  }
  return result;
}

/** Decide which findings are alerts given current CMS/live data and the previous state. */
export function evaluate({ cmsRows, live, previous, now = Date.now() }) {
  const findings = [];
  /** @type {Record<string, number>} */
  const cmsCounts = {};
  for (const row of cmsRows) {
    const count = Array.isArray(row.app) ? row.app.length : 0;
    cmsCounts[row.slug] = count;
    const ageMinutes = (now - new Date(row.updated_at).getTime()) / 60000;
    const liveEntry = live[row.slug];
    const settled = ageMinutes >= LIVE_GRACE_MINUTES;
    if (count > 0 && settled && !liveEntry) {
      findings.push({ kind: "LIVE_MISSING", slug: row.slug, detail: `CMS has ${count} application photos; product data not found on the live site` });
    } else if (liveEntry && settled && liveEntry.images < count) {
      findings.push({ kind: "LIVE_FEWER", slug: row.slug, detail: `live ${liveEntry.images} < CMS ${count}` });
    }
    const before = previous?.cmsCounts?.[row.slug];
    if (typeof before === "number" && count < before) {
      findings.push({ kind: "CMS_DECREASED", slug: row.slug, detail: `CMS ${before} → ${count} (row updated ${row.updated_at})` });
    }
  }
  for (const [slug, before] of Object.entries(previous?.cmsCounts ?? {})) {
    if (!(slug in cmsCounts) && before > 0) {
      findings.push({ kind: "CMS_PRODUCT_GONE", slug, detail: `published product with ${before} photos is no longer published` });
    }
  }
  return { findings, cmsCounts };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, init = {}, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(30000) });
      if (response.ok) return response;
      lastError = new Error(`${response.status} ${url}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts) await sleep(5000 * attempt);
  }
  throw lastError;
}

async function readCmsRows(supabaseUrl, key) {
  const response = await fetchWithRetry(
    `${supabaseUrl}/rest/v1/cms_products?status=eq.published&select=slug,updated_at,app:content->applicationImageUrls`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  );
  return response.json();
}

async function readLiveCode(siteUrl) {
  const html = await (await fetchWithRetry(`${siteUrl}/products/`, { headers: { "cache-control": "no-cache" } })).text();
  const scripts = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((m) => m[1]))];
  const chunks = await Promise.all(
    scripts.map(async (src) => (await fetchWithRetry(new URL(src, siteUrl).href)).text()),
  );
  const code = chunks.find((chunk) => chunk.includes("applicationThumbnailUrls:"));
  if (!code) throw new Error("product override data not found in live JS");
  return code;
}

async function checkAssets(siteUrl, live) {
  const urls = [...new Set(Object.values(live).flatMap((entry) => entry.urls))];
  const broken = [];
  let cursor = 0;
  const worker = async () => {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      try {
        const response = await fetchWithRetry(new URL(url, siteUrl).href, { method: "HEAD" }, 2);
        const type = response.headers.get("content-type") ?? "";
        if (!type.startsWith("image/")) broken.push(`${url} (content-type ${type || "missing"})`);
      } catch (error) {
        broken.push(`${url} (${error instanceof Error ? error.message : String(error)})`);
      }
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));
  return { checked: urls.length, broken };
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  const siteUrl = (process.env.SITE_URL || "https://aushenstone.com.au").replace(/\/$/, "");
  const stateFile = process.env.STATE_FILE || ".photo-monitor/state.json";
  const reportFile = process.env.REPORT_FILE || ".photo-monitor/report.md";
  if (!supabaseUrl || !key) throw new Error("SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are required");

  const previous = JSON.parse(await readFile(stateFile, "utf8").catch(() => "null"));
  const checkedAt = new Date().toISOString();
  const lines = [`# Application photo monitor`, ``, `Checked at ${checkedAt} (${siteUrl})`, ``];
  let state;
  let newAlert = false;

  try {
    const [cmsRows, code] = await Promise.all([readCmsRows(supabaseUrl, key), readLiveCode(siteUrl)]);
    const live = parseLiveOverrides(code, cmsRows.map((row) => row.slug));
    const { findings, cmsCounts } = evaluate({ cmsRows, live, previous });

    if (process.env.CHECK_ASSETS === "1") {
      const assets = await checkAssets(siteUrl, live);
      lines.push(`Asset check: ${assets.checked} photo URLs requested, ${assets.broken.length} broken.`, ``);
      for (const item of assets.broken) findings.push({ kind: "ASSET_BROKEN", slug: "-", detail: item });
    }

    const signature = findings.map((f) => `${f.kind}:${f.slug}:${f.detail}`).sort().join("\n");
    newAlert = findings.length > 0 && signature !== previous?.alertSignature;
    const totalCms = Object.values(cmsCounts).reduce((sum, n) => sum + n, 0);
    const totalLive = Object.values(live).reduce((sum, entry) => sum + entry.images, 0);
    lines.push(
      `Products: ${cmsRows.length} published; application photos CMS ${totalCms}, live ${totalLive}.`,
      ``,
    );
    if (findings.length === 0) {
      lines.push(`STATUS: OK`);
    } else {
      lines.push(newAlert ? `STATUS: ALERT (new)` : `STATUS: ALERT (unchanged since last run)`, ``);
      lines.push(`| Type | Product | Detail |`, `| --- | --- | --- |`);
      for (const f of findings) {
        const link = f.slug === "-" ? "-" : `[${f.slug}](${siteUrl}/products/${f.slug}/)`;
        lines.push(`| ${f.kind} | ${link} | ${f.detail} |`);
      }
      lines.push(
        ``,
        `CMS_DECREASED / CMS_PRODUCT_GONE can be intentional edits; LIVE_* means the published site is missing photos the CMS has.`,
      );
    }
    state = {
      checkedAt,
      cmsCounts,
      alertSignature: findings.length ? signature : "",
      consecutiveUnknown: 0,
      status: findings.length ? "alert" : "ok",
    };
  } catch (error) {
    // Network or parsing problems are "unknown", never "photos disappeared".
    const consecutiveUnknown = (previous?.consecutiveUnknown ?? 0) + 1;
    lines.push(`STATUS: UNKNOWN (${consecutiveUnknown} in a row): ${error instanceof Error ? error.message : String(error)}`);
    newAlert = consecutiveUnknown === UNKNOWN_ALERT_AFTER;
    state = { ...(previous ?? {}), checkedAt, consecutiveUnknown, status: "unknown" };
  }

  await mkdir(path.dirname(stateFile), { recursive: true });
  await writeFile(stateFile, JSON.stringify(state, null, 2));
  await mkdir(path.dirname(reportFile), { recursive: true });
  await writeFile(reportFile, lines.join("\n") + "\n");
  console.log(lines.join("\n"));
  if (newAlert) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 2;
  });
}
