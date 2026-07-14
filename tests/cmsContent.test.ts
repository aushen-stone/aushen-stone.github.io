import assert from "node:assert/strict";
import test from "node:test";
import { applyLegacyPageHeroImage, buildCmsContent, slugifyCmsValue } from "../src/lib/cmsContent";

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

test("applyLegacyPageHeroImage updates visible legacy page heroes only", () => {
  const home = applyLegacyPageHeroImage("home", { hero: { title: "Home", image: "/old.jpg" } }, "/new.jpg");
  assert.deepEqual(home, { hero: { title: "Home", image: "/new.jpg" } });
  const services = { hero: { title: "Services" }, fabrication: { items: [{ title: "Profiling", image: "/old.jpg" }] } };
  assert.deepEqual(applyLegacyPageHeroImage("services", services, "/new.jpg"), {
    hero: { title: "Services" },
    fabrication: { items: [{ title: "Profiling", image: "/new.jpg" }] },
  });
});
