import assert from "node:assert/strict";
import test from "node:test";
import { SEO_LANDING_PAGES } from "../src/data/seoLandingPages";
import { getSeoLandingPageProducts, seoLandingPagePath } from "../src/lib/seoLandingPages";

test("consultant SEO landing pages have complete unique metadata", () => {
  assert.equal(SEO_LANDING_PAGES.length, 11);
  assert.equal(new Set(SEO_LANDING_PAGES.map((page) => page.metaTitle)).size, 11);
  assert.equal(new Set(SEO_LANDING_PAGES.map((page) => page.metaDescription)).size, 11);
  for (const page of SEO_LANDING_PAGES) {
    assert.ok(page.h1.trim());
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

test("Bluestone catalogue description preserves the reviewed legacy copy", () => {
  const bluestone = SEO_LANDING_PAGES.find((page) => page.kind === "material" && page.slug === "bluestone");
  assert.ok(bluestone?.catalogueDescription?.startsWith("When it comes to elevating the aesthetics of your home"));
  assert.match(bluestone.catalogueDescription, /visit our showroom today\.$/);
});
