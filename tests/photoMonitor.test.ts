import assert from "node:assert/strict";
import test from "node:test";
import {
  countArrayField,
  evaluate,
  parseLiveOverrides,
  sliceObjectLiteral,
} from "../scripts/monitor-application-photos.mjs";

const LIVE_CODE =
  'let i={antline:{imageUrl:"/a.webp",applicationImageUrls:["/x-large.webp","/y-large.webp"],' +
  'applicationThumbnailUrls:["/x-thumb.webp","/y-thumb.webp"],description:"has } brace"},' +
  '"cove-limestone-baton":{imageUrl:"/c.webp",applicationImageUrls:[],applicationThumbnailUrls:[]}};';

test("sliceObjectLiteral ignores braces inside strings", () => {
  const start = LIVE_CODE.indexOf("{imageUrl");
  const literal = sliceObjectLiteral(LIVE_CODE, start);
  assert.ok(literal?.endsWith('description:"has } brace"}'));
});

test("countArrayField counts string entries and reports a missing field as null", () => {
  assert.equal(countArrayField('{applicationImageUrls:["/a","/b"]}', "applicationImageUrls"), 2);
  assert.equal(countArrayField("{applicationImageUrls:[]}", "applicationImageUrls"), 0);
  assert.equal(countArrayField("{imageUrl:\"/a\"}", "applicationImageUrls"), null);
});

test("parseLiveOverrides reads quoted and unquoted slug keys", () => {
  const live = parseLiveOverrides(LIVE_CODE, ["antline", "cove-limestone-baton", "missing"]);
  assert.equal(live.antline.images, 2);
  assert.equal(live.antline.thumbnails, 2);
  assert.deepEqual(live.antline.urls, ["/x-large.webp", "/y-large.webp", "/x-thumb.webp", "/y-thumb.webp"]);
  assert.equal(live["cove-limestone-baton"].images, 0);
  assert.equal(live.missing, undefined);
});

const now = Date.parse("2026-10-22T00:00:00Z");
const old = "2026-10-21T00:00:00Z";

test("evaluate flags live photos missing compared with the CMS", () => {
  const { findings } = evaluate({
    cmsRows: [
      { slug: "antline", updated_at: old, app: ["a", "b", "c"] },
      { slug: "gone-live", updated_at: old, app: ["a"] },
    ],
    live: { antline: { images: 2, thumbnails: 2, urls: [] } },
    previous: null,
    now,
  });
  assert.deepEqual(findings.map((f) => `${f.kind}:${f.slug}`), ["LIVE_FEWER:antline", "LIVE_MISSING:gone-live"]);
});

test("evaluate waits for a deploy after a recent CMS change", () => {
  const { findings } = evaluate({
    cmsRows: [{ slug: "antline", updated_at: "2026-10-21T23:50:00Z", app: ["a", "b", "c"] }],
    live: { antline: { images: 2, thumbnails: 2, urls: [] } },
    previous: null,
    now,
  });
  assert.equal(findings.length, 0);
});

test("evaluate flags CMS decreases and unpublished products against the previous run", () => {
  const { findings, cmsCounts } = evaluate({
    cmsRows: [{ slug: "antline", updated_at: old, app: ["a"] }],
    live: { antline: { images: 1, thumbnails: 1, urls: [] } },
    previous: { cmsCounts: { antline: 3, "cove-limestone-baton": 8 } },
    now,
  });
  assert.deepEqual(findings.map((f) => `${f.kind}:${f.slug}`), [
    "CMS_DECREASED:antline",
    "CMS_PRODUCT_GONE:cove-limestone-baton",
  ]);
  assert.deepEqual(cmsCounts, { antline: 1 });
});
