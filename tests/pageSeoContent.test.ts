import assert from "node:assert/strict";
import test from "node:test";
import { HOME_SEO_CONTENT, SERVICES_SEO_CONTENT } from "../src/data/pageSeoContent";

test("homepage uses the approved heading and architectural tagline", () => {
  assert.equal(HOME_SEO_CONTENT.title, "Natural Stone Suppliers");
  assert.equal(HOME_SEO_CONTENT.tagline, "Where natural stone meets architecture.");
  assert.ok(HOME_SEO_CONTENT.introduction.length >= 2);
  assert.ok(HOME_SEO_CONTENT.reasons.length >= 5);
});

test("homepage range cards link to dedicated SEO landing pages", () => {
  for (const item of HOME_SEO_CONTENT.range) {
    assert.match(item.href, /^\/products\/application\/[a-z0-9-]+\/$/);
  }
});

test("homepage and services FAQ questions are complete and unique", () => {
  for (const faqs of [HOME_SEO_CONTENT.faqs, SERVICES_SEO_CONTENT.faqs]) {
    assert.ok(faqs.length >= 6);
    assert.equal(new Set(faqs.map((faq) => faq.question)).size, faqs.length);
    assert.ok(faqs.every((faq) => faq.answer.trim().length > 40));
  }
});

test("services content includes the approved fabrication information", () => {
  assert.equal(SERVICES_SEO_CONTENT.title, "Stone Fabrication & Cutting Service");
  assert.equal(SERVICES_SEO_CONTENT.serviceRows.length, 6);
  assert.ok(SERVICES_SEO_CONTENT.benefits.length >= 3);
  assert.ok(SERVICES_SEO_CONTENT.exploreLinks.length >= 4);
});
