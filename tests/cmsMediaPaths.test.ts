import assert from "node:assert/strict";
import test from "node:test";
import { cmsMediaStaticPath } from "../src/lib/cmsMediaPaths";

const projectUrl = "https://example.supabase.co";

test("maps public CMS Storage URLs to static site paths", () => {
  assert.equal(
    cmsMediaStaticPath(
      `${projectUrl}/storage/v1/object/public/cms-media/products/optimized/photo-large.webp`,
      projectUrl,
    ),
    "/cms-media/products/optimized/photo-large.webp",
  );
});

test("does not rewrite external or non-CMS URLs", () => {
  assert.equal(cmsMediaStaticPath("/product-photos/local.webp", projectUrl), null);
  assert.equal(
    cmsMediaStaticPath(
      "https://images.example.com/storage/v1/object/public/cms-media/photo.webp",
      projectUrl,
    ),
    null,
  );
});
