import assert from "node:assert/strict";
import test from "node:test";
import { canonicalUrl } from "../src/lib/seo";
import { buildLocalBusinessStructuredData } from "../src/lib/structuredData";

test("canonicalUrl normalizes route slashes", () => {
  assert.equal(canonicalUrl(""), "https://aushenstone.com.au/");
  assert.equal(canonicalUrl("products"), "https://aushenstone.com.au/products/");
  assert.equal(
    canonicalUrl("/products/blueocean/"),
    "https://aushenstone.com.au/products/blueocean/"
  );
});

test("local business structured data exposes canonical business identity", () => {
  const schema = buildLocalBusinessStructuredData();

  assert.equal(schema["@context"], "https://schema.org");
  assert.equal(schema["@type"], "HomeAndConstructionBusiness");
  assert.equal(schema.address.addressCountry, "AU");
  assert.match(schema.email, /@aushenstone\.com\.au$/);
});
