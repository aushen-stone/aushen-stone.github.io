import assert from "node:assert/strict";
import test from "node:test";
import {
  CMS_MEDIA_MAX_BYTES,
  formatCmsUploadError,
  prepareCmsImageFile,
  uploadCmsMediaBatch,
  withCmsUploadTimeout,
  validateCmsImageFile,
} from "../src/lib/cmsMediaUpload";

test("CMS image upload rejects unsupported formats before contacting storage", () => {
  const file = new File([new Uint8Array([1, 2, 3])], "lime-greige.heic", {
    type: "image/heic",
  });

  assert.equal(
    validateCmsImageFile(file),
    "lime-greige.heic is not supported. Use JPEG, PNG, WebP or AVIF.",
  );
});

test("CMS upload errors explain network and permission failures", () => {
  assert.equal(
    formatCmsUploadError(new Error("Failed to fetch"), "lime-greige.png"),
    "lime-greige.png could not be uploaded because the network request failed. Check your connection and try again.",
  );
  assert.equal(
    formatCmsUploadError(new Error("new row violates row-level security policy")),
    "Your account does not have permission to upload this image. Sign in again or ask a super admin to check your CMS permissions.",
  );
});

test("oversized CMS images are compressed before storage upload", async () => {
  const original = new File(
    [new Uint8Array(CMS_MEDIA_MAX_BYTES + 1)],
    "lime-greige.png",
    { type: "image/png" },
  );
  let compressorCalls = 0;

  const prepared = await prepareCmsImageFile(original, async () => {
    compressorCalls += 1;
    return new File([new Uint8Array([1, 2, 3])], "lime-greige.webp", {
      type: "image/webp",
    });
  });

  assert.equal(compressorCalls, 1);
  assert.equal(prepared.compressed, true);
  assert.equal(prepared.file.name, "lime-greige.webp");
  assert.ok(prepared.file.size < CMS_MEDIA_MAX_BYTES);
});

test("a stalled CMS storage request times out with the filename", async () => {
  const stalled = new Promise<string>(() => undefined);

  await assert.rejects(
    withCmsUploadTimeout(stalled, "lime-greige.png", 5),
    /lime-greige\.png upload timed out/,
  );
});

test("application photo batches preserve per-file success and failure", async () => {
  const files = [
    new File([new Uint8Array([1])], "one.png", { type: "image/png" }),
    new File([new Uint8Array([2])], "two.png", { type: "image/png" }),
  ];

  const results = await uploadCmsMediaBatch(files, async (file) => {
    if (file.name === "two.png") throw new Error("storage rejected the file");
    return `https://example.test/${file.name}`;
  });

  assert.deepEqual(results, [
    {
      fileName: "one.png",
      status: "fulfilled",
      url: "https://example.test/one.png",
      compressed: false,
    },
    {
      fileName: "two.png",
      status: "rejected",
      error: "storage rejected the file",
    },
  ]);
});
