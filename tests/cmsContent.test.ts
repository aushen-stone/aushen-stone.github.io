import assert from "node:assert/strict";
import test from "node:test";
import { applyLegacyPageHeroImage, buildCmsContent, slugifyCmsValue } from "../src/lib/cmsContent";
import { prepareBlogHtml, sanitizeBlogHtml } from "../src/lib/blogHtml";
import { buildApplicationFilterOptions } from "../src/data/productFilterOptions";

test("slugifyCmsValue creates route-safe slugs", () => {
  assert.equal(slugifyCmsValue("Grey Apricot & Marble"), "grey-apricot-and-marble");
});

test("buildCmsContent preserves advanced product variants", () => {
  const content = buildCmsContent("products", {
    title: "Test Stone",
    slug: "test-stone",
    secondaryLabel: "Marble",
    imageUrl: "",
    summary: "Summary",
    bodyHtml: "",
    categories: "",
    advancedJson: JSON.stringify({ finishes: [{ id: "honed" }], custom: true }),
  });
  assert.equal(content.name, "Test Stone");
  assert.deepEqual(content.finishes, [{ id: "honed" }]);
  assert.equal((content as unknown as Record<string, unknown>).custom, true);
});

test("buildCmsContent creates blog category references", () => {
  const content = buildCmsContent("blog", {
    title: "Stone Guide",
    slug: "stone-guide",
    secondaryLabel: "",
    imageUrl: "https://example.com/hero.webp",
    summary: "A guide",
    bodyHtml: "<p>Guide</p>",
    categories: "Stone, Pool Coping",
    advancedJson: "{}",
  });
  assert.deepEqual(content.categories, [
    { name: "Stone", slug: "stone" },
    { name: "Pool Coping", slug: "pool-coping" },
  ]);
  assert.equal(content.heroImageUrl, "https://example.com/hero.webp");
});

test("buildCmsContent creates project records with gallery fallbacks", () => {
  const content = buildCmsContent("projects", {
    title: "Garden House",
    slug: "garden-house",
    secondaryLabel: "Residential",
    imageUrl: "https://example.com/project.webp",
    summary: "A garden project.",
    bodyHtml: "",
    categories: "",
    advancedJson: "{}",
  });
  assert.equal(content.category, "Residential");
  assert.equal(content.gallery[0]?.src, "https://example.com/project.webp");
});

test("buildCmsContent preserves legacy page-specific data", () => {
  const content = buildCmsContent("home", {
    title: "Home",
    slug: "home",
    secondaryLabel: "",
    imageUrl: "",
    summary: "",
    bodyHtml: "",
    categories: "",
    advancedJson: JSON.stringify({
      hero: {
        titleLines: ["Find your crafted", "architectural surfaces."],
        text: "Original introduction",
        image: "/AushenShop.webp",
      },
    }),
  });
  assert.deepEqual(content.hero?.titleLines, ["Find your crafted", "architectural surfaces."]);
  assert.equal(content.hero?.image, "/AushenShop.webp");
});

test("product application filters keep preferred order and include CMS categories", () => {
  const options = buildApplicationFilterOptions([
    {
      id: "custom-stone",
      name: "Custom Stone",
      slug: "custom-stone",
      materialId: "granite",
      materialName: "Granite",
      finishes: [],
      applicationIndex: [
        {
          id: "fireplace",
          label: "Fireplace Hearth",
          category: "Fireplace",
          categorySlug: "fireplace",
          finishes: [],
        },
      ],
    },
  ]);

  assert.equal(options[0].slug, "paver");
  assert.deepEqual(options.at(-1), { name: "Fireplace", slug: "fireplace" });
});

test("buildCmsContent stores editor JSON and sanitizes generated blog HTML", () => {
  const document = { type: "doc", content: [{ type: "paragraph" }] };
  const content = buildCmsContent("blog", {
    title: "Safe guide",
    slug: "safe-guide",
    secondaryLabel: "",
    imageUrl: "",
    summary: "A safe guide",
    bodyHtml: '<h2 id="legacy-heading">Heading</h2><script>alert(1)</script><p onclick="bad()">Copy</p>',
    bodyJson: JSON.stringify(document),
    categories: "Guides",
    advancedJson: "{}",
  });
  assert.deepEqual(content.editorJson, document);
  assert.equal(
    content.bodyHtml,
    '<h2 id="legacy-heading">Heading</h2><p>Copy</p>',
  );
  assert.deepEqual(content.headings, [
    { id: "legacy-heading", text: "Heading", level: 2 },
  ]);
});

test("prepareBlogHtml creates unique anchors without changing heading markup", () => {
  assert.deepEqual(
    prepareBlogHtml("<h2>Pool &amp; Pavers</h2><h3>Pool &amp; Pavers</h3>"),
    {
      html: '<h2 id="pool-and-pavers">Pool &amp; Pavers</h2><h3 id="pool-and-pavers-2">Pool &amp; Pavers</h3>',
      headings: [
        { id: "pool-and-pavers", text: "Pool & Pavers", level: 2 },
        { id: "pool-and-pavers-2", text: "Pool & Pavers", level: 3 },
      ],
    },
  );
});

test("sanitizeBlogHtml preserves legacy formatting tags", () => {
  assert.equal(
    sanitizeBlogHtml('<h4 id="detail"><b>Bold</b> and <i>italic</i></h4>'),
    '<h4 id="detail"><b>Bold</b> and <i>italic</i></h4>',
  );
});

test("buildCmsContent stores ordered application photos separately", () => {
  const content = buildCmsContent("products", {
    title: "Gallery Stone",
    slug: "gallery-stone",
    secondaryLabel: "Granite",
    imageUrl: "https://example.com/product.webp",
    applicationImageUrls: [
      "https://example.com/application-1.webp",
      "https://example.com/application-2.webp",
    ],
    summary: "Summary",
    bodyHtml: "",
    categories: "",
    advancedJson: "{}",
  });
  assert.deepEqual(content.applicationImageUrls, [
    "https://example.com/application-1.webp",
    "https://example.com/application-2.webp",
  ]);
});

test("applyLegacyPageHeroImage updates visible legacy page heroes only", () => {
  const home = applyLegacyPageHeroImage("home", { hero: { title: "Home", image: "/old.jpg" } }, "/new.jpg");
  assert.deepEqual(home, { hero: { title: "Home", image: "/new.jpg" } });
  const services = { hero: { title: "Services" }, fabrication: { items: [{ title: "Profiling", image: "/old.jpg" }] } };
  assert.deepEqual(applyLegacyPageHeroImage("services", services, "/new.jpg"), {
    hero: { title: "Services" },
    fabrication: { items: [{ title: "Profiling", image: "/new.jpg" }] },
  });
});
