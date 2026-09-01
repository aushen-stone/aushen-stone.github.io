import assert from "node:assert/strict";
import test from "node:test";
import { PRODUCTS } from "../src/data/products";

test("published catalogue excludes the removed test product", () => {
  assert.equal(PRODUCTS.some((product) => product.slug === "test"), false);
});
