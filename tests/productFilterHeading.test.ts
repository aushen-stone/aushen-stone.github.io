import assert from "node:assert/strict";
import test from "node:test";
import { buildProductFilterHeading } from "../src/lib/productFilterHeading";

test("product filter heading describes individual and combined filters", () => {
  assert.equal(buildProductFilterHeading({}), "Stone Products");
  assert.equal(
    buildProductFilterHeading({ material: "Bluestone" }),
    "Bluestone",
  );
  assert.equal(
    buildProductFilterHeading({ application: "Paver" }),
    "Paver",
  );
  assert.equal(
    buildProductFilterHeading({ material: "Bluestone", application: "Paver" }),
    "Bluestone & Paver",
  );
  assert.equal(
    buildProductFilterHeading({
      material: "Bluestone",
      application: "Paver",
      tone: "Grey",
    }),
    "Bluestone & Paver & Grey",
  );
});
