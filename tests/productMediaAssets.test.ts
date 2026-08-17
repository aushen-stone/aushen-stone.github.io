import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";

test("Siena Earth large image is a non-empty build asset", async () => {
  const image = await stat("public/product-large-v2/siena-earth-01.webp");
  assert.ok(image.size > 0, "Siena Earth large image must not be empty");
});
