import assert from "node:assert/strict";
import test from "node:test";
import { HOME_SEO_CONTENT, SERVICES_SEO_CONTENT } from "../src/data/pageSeoContent";

test("homepage uses the approved heading and architectural tagline", () => {
  assert.equal(HOME_SEO_CONTENT.title, "Natural Stone Suppliers");
  assert.equal(HOME_SEO_CONTENT.tagline, "Where Natural Stone Meets Architecture.");
  assert.ok(HOME_SEO_CONTENT.introduction.length >= 2);
  assert.ok(HOME_SEO_CONTENT.reasons.length >= 5);
});

test("homepage brand banner introduction retains both approved paragraphs", () => {
  assert.equal(HOME_SEO_CONTENT.introduction.length, 2);
  assert.match(HOME_SEO_CONTENT.introduction[0], /^Transform your residential or commercial project/);
  assert.match(HOME_SEO_CONTENT.introduction[1], /^With more than 20 years of industry experience/);
});

test("homepage natural stone supplier section retains the approved copy", () => {
  assert.equal(
    HOME_SEO_CONTENT.naturalStoneSuppliers.title,
    "Natural Stone Suppliers for Every Project",
  );
  assert.equal(HOME_SEO_CONTENT.naturalStoneSuppliers.paragraphs.length, 4);
  assert.match(
    HOME_SEO_CONTENT.naturalStoneSuppliers.paragraphs[0],
    /^As experienced natural stone suppliers/,
  );
  assert.match(
    HOME_SEO_CONTENT.naturalStoneSuppliers.paragraphs[3],
    /looks exceptional for years to come\.$/,
  );
});

test("homepage natural stone range section retains the approved links", () => {
  const section = HOME_SEO_CONTENT.exploreNaturalStoneRange;
  assert.equal(section.title, "Explore Our Natural Stone Range");
  assert.equal(
    section.introduction,
    "We offer premium natural stone products for every application.",
  );
  assert.deepEqual(
    section.items.map((item) => item.href),
    [
      "https://aushenstone.com.au/products/?application=paver",
      "https://aushenstone.com.au/products/?application=pool-coping",
      "https://aushenstone.com.au/products/?application=cladding",
      "https://aushenstone.com.au/products/?application=cobble-stone&application=organic-stepper&application=giant-stepper",
    ],
  );
  assert.ok(section.items.every((item) => item.description.length > 100));
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
