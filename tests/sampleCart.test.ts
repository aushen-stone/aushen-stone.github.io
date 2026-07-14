import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSampleContactPrefill,
  hydrateSampleCart,
  isSampleCartLine,
} from "../src/lib/sampleCart";
import { MAX_SAMPLE_LINES, SAMPLE_SIZE, type SampleCartLine } from "../src/types/cart";

function line(index: number): SampleCartLine {
  return {
    productSlug: `stone-${index}`,
    productName: `Stone ${index}`,
    finishId: `finish-${index}`,
    finishName: `Finish ${index}`,
    sampleSize: SAMPLE_SIZE,
    addedAt: new Date(index * 1000).toISOString(),
  };
}

test("isSampleCartLine rejects malformed persisted data", () => {
  assert.equal(isSampleCartLine(line(1)), true);
  assert.equal(isSampleCartLine({ ...line(1), sampleSize: "wrong" }), false);
  assert.equal(isSampleCartLine(null), false);
});

test("hydrateSampleCart filters invalid lines and enforces the line limit", () => {
  const persisted = [
    { invalid: true },
    ...Array.from({ length: MAX_SAMPLE_LINES + 3 }, (_, index) => line(index)),
  ];

  const result = hydrateSampleCart(persisted);

  assert.equal(result.length, MAX_SAMPLE_LINES);
  assert.equal(result[0]?.productSlug, "stone-0");
});

test("buildSampleContactPrefill creates singular and plural enquiry copy", () => {
  const singular = buildSampleContactPrefill([line(1)]);
  const plural = buildSampleContactPrefill([line(1), line(2)]);

  assert.match(singular, /get a sample/);
  assert.match(singular, /1\. Stone 1 - Finish 1 \(200x100mm\)/);
  assert.match(plural, /get samples/);
  assert.match(plural, /2\. Stone 2 - Finish 2 \(200x100mm\)/);
  assert.equal(buildSampleContactPrefill([]), "");
});
