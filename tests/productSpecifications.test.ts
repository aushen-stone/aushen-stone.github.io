import assert from "node:assert/strict";
import test from "node:test";
import {
  buildProductTechnicalSpecifications,
  formatSurfaceFinishLabel,
  joinApplicationLabels,
  resolveFinishSpecification,
} from "../src/lib/productSpecifications";

test("surface finish and slip rating support current and legacy CMS values", () => {
  assert.deepEqual(
    resolveFinishSpecification({ name: "Sandblasted (P5)" }),
    { name: "Sandblasted", slipRating: "P5" },
  );
  assert.equal(
    formatSurfaceFinishLabel({ name: "Sandblasted", slipRating: "P5" }),
    "Sandblasted (P5)",
  );
  assert.equal(
    formatSurfaceFinishLabel({ name: "Sandblasted (P5)", slipRating: "P5" }),
    "Sandblasted (P5)",
  );
});

test("technical specifications use the selected About the Stone values", () => {
  const specifications = buildProductTechnicalSpecifications({
    product: { materialName: "Marble" },
    application: { label: "Pool Coping" },
    finish: { name: "Sandblasted (P5)" },
    size: "600x400x20/60mm",
  });

  assert.deepEqual(specifications, [
    { label: "Material", value: "Marble" },
    { label: "Application", value: "Pool Coping" },
    { label: "Finish", value: "Sandblasted" },
    { label: "Size", value: "600x400x20/60mm" },
    { label: "Slip Rating", value: "P5" },
  ]);
});

test("suitability joins every unique application with comma and space", () => {
  assert.equal(
    joinApplicationLabels([
      { label: "Paver" },
      { label: "Pool Coping" },
      { label: "Paver" },
    ]),
    "Paver, Pool Coping",
  );
});
