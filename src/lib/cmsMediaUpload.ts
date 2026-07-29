export const CMS_MEDIA_MAX_BYTES = 10 * 1024 * 1024;
export const CMS_MEDIA_TARGET_BYTES = 600 * 1024;
export const CMS_MEDIA_OPTIMIZE_THRESHOLD_BYTES = 600 * 1024;
export const CMS_MEDIA_THUMB_TARGET_BYTES = 180 * 1024;
export const CMS_MEDIA_UPLOAD_TIMEOUT_MS = 90_000;
export const CMS_MEDIA_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export type PreparedCmsImage = {
  file: File;
  compressed: boolean;
};

export type CmsMediaVariant = {
  url: string;
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: string;
  contentHash: string;
};

export type CmsMediaVariantSet = {
  thumbnail: CmsMediaVariant;
  large: CmsMediaVariant;
};

type PreparedCmsImageVariant = Omit<CmsMediaVariant, "url"> & {
  file: File;
};

export type CmsMediaUploadResult =
  | {
      fileName: string;
      status: "fulfilled";
      url: string;
      compressed: boolean;
    }
  | {
      fileName: string;
      status: "rejected";
      error: string;
    };

type CmsImageCompressor = (file: File) => Promise<File>;

const formatMegabytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function formatCmsUploadError(error: unknown, fileName?: string): string {
  const message = error instanceof Error ? error.message : String(error || "Upload failed.");
  const prefix = fileName ? `${fileName} ` : "";
  if (/failed to fetch|networkerror|network request failed/i.test(message)) {
    return `${prefix}could not be uploaded because the network request failed. Check your connection and try again.`;
  }
  if (/row-level security|permission denied|not authorized|unauthorized/i.test(message)) {
    return "Your account does not have permission to upload this image. Sign in again or ask a super admin to check your CMS permissions.";
  }
  return message;
}

export function validateCmsImageFile(file: File): string | null {
  if (!CMS_MEDIA_ALLOWED_TYPES.includes(file.type as (typeof CMS_MEDIA_ALLOWED_TYPES)[number])) {
    return `${file.name} is not supported. Use JPEG, PNG, WebP or AVIF.`;
  }
  if (file.size > CMS_MEDIA_MAX_BYTES) {
    return `${file.name} is ${formatMegabytes(file.size)}. The maximum original upload size is 10 MB.`;
  }
  return null;
}

export async function prepareCmsImageFile(
  file: File,
  compressor: CmsImageCompressor = compressCmsImageInBrowser,
): Promise<PreparedCmsImage> {
  const validationError = validateCmsImageFile(file);
  if (validationError) throw new Error(validationError);
  if (file.size <= CMS_MEDIA_OPTIMIZE_THRESHOLD_BYTES) {
    return { file, compressed: false };
  }

  let compressed: File;
  try {
    compressed = await compressor(file);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "compression failed";
    throw new Error(
      `${file.name} is ${formatMegabytes(file.size)} and could not be compressed: ${reason}`,
    );
  }

  if (compressed.size > CMS_MEDIA_MAX_BYTES) {
    throw new Error(
      `${file.name} is ${formatMegabytes(file.size)} and could not be compressed below 10 MB.`,
    );
  }
  return { file: compressed, compressed: true };
}

export async function prepareCmsImageVariants(
  file: File,
): Promise<{
  thumbnail: PreparedCmsImageVariant;
  large: PreparedCmsImageVariant;
}> {
  const validationError = validateCmsImageFile(file);
  if (validationError) throw new Error(validationError);
  if (typeof document === "undefined") {
    throw new Error("browser image optimization is unavailable");
  }

  const contentHash = await hashCmsMediaFile(file);
  const imageUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(imageUrl);
    const baseName = sanitizeCmsMediaBaseName(file.name);
    const [thumbnail, large] = await Promise.all([
      encodeCmsImageVariant(image, {
        fileName: `${baseName}.${contentHash.slice(0, 12)}-thumb-v2.webp`,
        maxDimension: 800,
        targetBytes: CMS_MEDIA_THUMB_TARGET_BYTES,
        qualities: [0.8, 0.72, 0.64, 0.56],
      }),
      encodeCmsImageVariant(image, {
        fileName: `${baseName}.${contentHash.slice(0, 12)}-large-v2.webp`,
        maxDimension: 2000,
        targetBytes: CMS_MEDIA_TARGET_BYTES,
        qualities: [0.82, 0.76, 0.7, 0.64, 0.58],
      }),
    ]);

    return {
      thumbnail: { ...thumbnail, contentHash },
      large: { ...large, contentHash },
    };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export async function uploadCmsMediaVariants(
  file: File,
  upload: (preparedFile: File) => Promise<string>,
  timeoutMs = CMS_MEDIA_UPLOAD_TIMEOUT_MS,
): Promise<CmsMediaVariantSet> {
  const prepared = await prepareCmsImageVariants(file);
  const [thumbnailUrl, largeUrl] = await Promise.all([
    withCmsUploadTimeout(
      upload(prepared.thumbnail.file),
      prepared.thumbnail.file.name,
      timeoutMs,
    ),
    withCmsUploadTimeout(
      upload(prepared.large.file),
      prepared.large.file.name,
      timeoutMs,
    ),
  ]);

  return {
    thumbnail: { ...prepared.thumbnail, url: thumbnailUrl },
    large: { ...prepared.large, url: largeUrl },
  };
}

export async function withCmsUploadTimeout<T>(
  upload: Promise<T>,
  fileName: string,
  timeoutMs = CMS_MEDIA_UPLOAD_TIMEOUT_MS,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`${fileName} upload timed out. Please try again.`)),
      timeoutMs,
    );
  });

  try {
    return await Promise.race([upload, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function uploadCmsMediaFile(
  file: File,
  upload: (preparedFile: File) => Promise<string>,
  options?: {
    compressor?: CmsImageCompressor;
    timeoutMs?: number;
  },
): Promise<{ url: string; compressed: boolean }> {
  const prepared = await prepareCmsImageFile(
    file,
    options?.compressor ?? compressCmsImageInBrowser,
  );
  const url = await withCmsUploadTimeout(
    upload(prepared.file),
    file.name,
    options?.timeoutMs,
  );
  return { url, compressed: prepared.compressed };
}

export async function uploadCmsMediaBatch(
  files: File[],
  upload: (preparedFile: File) => Promise<string>,
  options?: {
    compressor?: CmsImageCompressor;
    timeoutMs?: number;
  },
): Promise<CmsMediaUploadResult[]> {
  const results: CmsMediaUploadResult[] = [];

  // Sequential uploads keep memory and bandwidth bounded for high-resolution
  // product photography while still preserving an outcome for every file.
  for (const file of files) {
    try {
      const result = await uploadCmsMediaFile(file, upload, options);
      results.push({
        fileName: file.name,
        status: "fulfilled",
        url: result.url,
        compressed: result.compressed,
      });
    } catch (error) {
      results.push({
        fileName: file.name,
        status: "rejected",
        error: formatCmsUploadError(error, file.name),
      });
    }
  }

  return results;
}

async function compressCmsImageInBrowser(file: File): Promise<File> {
  if (typeof document === "undefined") {
    throw new Error("browser image compression is unavailable");
  }

  const imageUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(imageUrl);
    const dimensions = [2000, 1800, 1600, 1400];
    const qualities = [0.82, 0.76, 0.7, 0.64, 0.58];
    let smallest: Blob | null = null;

    for (const maxDimension of dimensions) {
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("image canvas is unavailable");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      for (const quality of qualities) {
        const blob = await canvasToBlob(canvas, "image/webp", quality);
        if (!smallest || blob.size < smallest.size) smallest = blob;
        if (blob.size <= CMS_MEDIA_TARGET_BYTES) {
          return blobToWebpFile(blob, file.name);
        }
      }
    }

    if (!smallest) throw new Error("the browser did not produce a compressed image");
    return blobToWebpFile(smallest, file.name);
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("the image could not be decoded"));
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("image encoding failed"))),
      type,
      quality,
    );
  });
}

function blobToWebpFile(blob: Blob, originalName: string): File {
  const webpName = originalName.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], webpName, { type: "image/webp", lastModified: Date.now() });
}

function sanitizeCmsMediaBaseName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "image";
}

async function hashCmsMediaFile(file: File): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error("secure duplicate detection is unavailable in this browser");
  }
  const digest = await globalThis.crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function encodeCmsImageVariant(
  image: HTMLImageElement,
  options: {
    fileName: string;
    maxDimension: number;
    targetBytes: number;
    qualities: number[];
  },
): Promise<PreparedCmsImageVariant> {
  const dimensionSteps = [
    options.maxDimension,
    Math.round(options.maxDimension * 0.88),
    Math.round(options.maxDimension * 0.76),
  ];
  let smallest:
    | { blob: Blob; width: number; height: number }
    | undefined;

  for (const maxDimension of dimensionSteps) {
    const scale = Math.min(
      1,
      maxDimension / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("image canvas is unavailable");
    context.drawImage(image, 0, 0, width, height);

    for (const quality of options.qualities) {
      const blob = await canvasToBlob(canvas, "image/webp", quality);
      if (!smallest || blob.size < smallest.blob.size) {
        smallest = { blob, width, height };
      }
      if (blob.size <= options.targetBytes) {
        return {
          file: new File([blob], options.fileName, {
            type: "image/webp",
            lastModified: Date.now(),
          }),
          width,
          height,
          sizeBytes: blob.size,
          mimeType: "image/webp",
          contentHash: "",
        };
      }
    }
  }

  if (!smallest) throw new Error("the browser did not produce an optimized image");
  return {
    file: new File([smallest.blob], options.fileName, {
      type: "image/webp",
      lastModified: Date.now(),
    }),
    width: smallest.width,
    height: smallest.height,
    sizeBytes: smallest.blob.size,
    mimeType: "image/webp",
    contentHash: "",
  };
}
