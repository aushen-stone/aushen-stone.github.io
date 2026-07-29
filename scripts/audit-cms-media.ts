export {};

type ProductRow = {
  slug: string;
  image_url: string | null;
  content: {
    applicationImageUrls?: string[];
    mediaAssets?: {
      product?: {
        thumbnail?: { url?: string };
        large?: { url?: string };
      };
      applications?: Array<{
        thumbnail?: { url?: string };
        large?: { url?: string };
      }>;
    };
  };
};

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const apiKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !apiKey) {
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
  );
}

const headers = {
  apikey: apiKey,
  Authorization: `Bearer ${apiKey}`,
};

const rowsResponse = await fetch(
  `${supabaseUrl}/rest/v1/cms_products?status=eq.published&select=slug,image_url,content`,
  { headers },
);
if (!rowsResponse.ok) {
  throw new Error(`Unable to read published products: ${rowsResponse.status}`);
}
const rows = (await rowsResponse.json()) as ProductRow[];

const references = new Map<string, Set<string>>();
const addReference = (url: string | null | undefined, reference: string) => {
  if (!url) return;
  const owners = references.get(url) ?? new Set<string>();
  owners.add(reference);
  references.set(url, owners);
};

for (const row of rows) {
  addReference(row.image_url, `${row.slug}:product`);
  row.content.applicationImageUrls?.forEach((url, index) =>
    addReference(url, `${row.slug}:application:${index + 1}`),
  );
  addReference(
    row.content.mediaAssets?.product?.thumbnail?.url,
    `${row.slug}:product:thumbnail`,
  );
  addReference(
    row.content.mediaAssets?.product?.large?.url,
    `${row.slug}:product:large`,
  );
  row.content.mediaAssets?.applications?.forEach((asset, index) => {
    addReference(asset.thumbnail?.url, `${row.slug}:application:${index + 1}:thumbnail`);
    addReference(asset.large?.url, `${row.slug}:application:${index + 1}:large`);
  });
}

type AuditResult = {
  url: string;
  sizeBytes: number | null;
  cacheControl: string | null;
  references: string[];
  status: number;
};

const entries = [...references.entries()];
const results: AuditResult[] = [];
let cursor = 0;

const inspectNext = async () => {
  while (cursor < entries.length) {
    const [url, owners] = entries[cursor++];
    if (!/^https?:\/\//i.test(url)) {
      results.push({
        url,
        sizeBytes: null,
        cacheControl: "local-static-asset",
        references: [...owners],
        status: 200,
      });
      continue;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    let result: AuditResult;
  try {
      // Supabase serves `no-cache` for HEAD even when the real GET is cached.
      // Read only the response headers and immediately cancel the body.
      const response = await fetch(url, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        signal: controller.signal,
      });
      await response.body?.cancel();
      const contentRange = response.headers.get("content-range");
      const rangedSize = contentRange?.match(/\/(\d+)$/)?.[1];
      result = {
      url,
      sizeBytes:
        Number(rangedSize ?? response.headers.get("content-length")) || null,
      cacheControl: response.headers.get("cache-control"),
      references: [...owners],
      status: response.status,
      };
  } catch {
      result = {
      url,
      sizeBytes: null,
      cacheControl: null,
      references: [...owners],
      status: 0,
      };
    } finally {
      clearTimeout(timeout);
    }
    results.push(result);
  }
};

await Promise.all(Array.from({ length: 16 }, () => inspectNext()));

const oversized = results
  .filter((item) => (item.sizeBytes ?? 0) > 1024 * 1024)
  .sort((left, right) => (right.sizeBytes ?? 0) - (left.sizeBytes ?? 0));
const missing = results.filter((item) => item.status >= 400 || item.status === 0);
const shortCached = results.filter(
  (item) =>
    /^https?:\/\//i.test(item.url) &&
    item.status < 400 &&
    !/(?:^|\s)(?:[3-9]\d{6,}|\d{8,})(?:\s|$)|max-age=(?:[3-9]\d{6,}|\d{8,})|immutable/i.test(
      item.cacheControl ?? "",
    ),
);

console.log(
  JSON.stringify(
    {
      products: rows.length,
      referencedMedia: results.length,
      oversizedCount: oversized.length,
      missingCount: missing.length,
      shortCacheCount: shortCached.length,
      oversized,
      missing,
      shortCached: shortCached.slice(0, 30),
    },
    null,
    2,
  ),
);
