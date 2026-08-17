import assert from "node:assert/strict";
import test from "node:test";
import { SEO_LANDING_PAGES } from "../src/data/seoLandingPages";
import { getSeoLandingPageMatchingProducts, getSeoLandingPageProducts, seoLandingPagePath } from "../src/lib/seoLandingPages";

test("consultant SEO landing pages have complete unique metadata", () => {
  assert.equal(SEO_LANDING_PAGES.length, 11);
  assert.equal(new Set(SEO_LANDING_PAGES.map((page) => page.metaTitle)).size, 11);
  assert.equal(new Set(SEO_LANDING_PAGES.map((page) => page.metaDescription)).size, 11);
  for (const page of SEO_LANDING_PAGES) {
    assert.ok(page.h1.trim());
    assert.ok(page.metaTitle.trim(), `${page.slug} should have a meta title`);
    assert.ok(page.metaDescription.trim(), `${page.slug} should have a meta description`);
    assert.ok(page.intro.trim());
    assert.ok(page.sections.length >= 2);
    assert.ok(page.faqs.length >= 3);
    assert.match(seoLandingPagePath(page), /^\/products\/(material|application)\/[a-z0-9-]+\/$/);
  }
});

test("SEO landing page product lists resolve and remain alphabetic", () => {
  for (const page of SEO_LANDING_PAGES) {
    const products = getSeoLandingPageProducts(page);
    assert.ok(products.length > 0, `${page.slug} should display products`);
    const slugs = products.map((product) => product.slug);
    assert.equal(new Set(slugs).size, slugs.length);
  }
});

test("admin product candidates only include products matching the page slug", () => {
  const limestone = getSeoLandingPageMatchingProducts({ kind: "material", slug: "limestone" });
  assert.ok(limestone.length > 0);
  assert.ok(limestone.every((product) => product.materialId === "limestone"));

  const pavers = getSeoLandingPageMatchingProducts({ kind: "application", slug: "pavers" });
  assert.ok(pavers.length > 0);
  assert.ok(pavers.every((product) => product.applicationIndex.some((application) =>
    [application.categorySlug, application.id].includes("paver") ||
    [application.categorySlug, application.id].includes("pavers") ||
    application.label.toLowerCase() === "paver" ||
    application.label.toLowerCase() === "pavers",
  )));
});

test("manual SEO product selections remain restricted to matching candidates", () => {
  const page = SEO_LANDING_PAGES.find((entry) => entry.kind === "material" && entry.slug === "limestone");
  assert.ok(page);
  const matching = getSeoLandingPageMatchingProducts(page);
  assert.ok(matching.length > 1);
  const selected = getSeoLandingPageProducts({ ...page, productSlugs: [matching[0].slug, "antline"] });
  assert.deepEqual(selected.map((product) => product.slug), [matching[0].slug]);
});

test("Bluestone catalogue description preserves the reviewed legacy copy", () => {
  const bluestone = SEO_LANDING_PAGES.find((page) => page.kind === "material" && page.slug === "bluestone");
  assert.ok(bluestone, "Bluestone material landing page should exist");
  assert.ok(bluestone.catalogueDescription?.startsWith("When it comes to elevating the aesthetics of your home"));
  assert.ok(bluestone.catalogueDescription, "Bluestone catalogue description should exist");
  assert.match(bluestone.catalogueDescription, /visit our showroom today\.$/);
});
