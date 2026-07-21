export const CMS_MEDIA_MAX_BYTES = 10 * 1024 * 1024;
export const CMS_MEDIA_TARGET_BYTES = 8 * 1024 * 1024;
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
  return null;
}

export async function prepareCmsImageFile(
  file: File,
  compressor: CmsImageCompressor = compressCmsImageInBrowser,
): Promise<PreparedCmsImage> {
  const validationError = validateCmsImageFile(file);
  if (validationError) throw new Error(validationError);
  if (file.size <= CMS_MEDIA_MAX_BYTES) return { file, compressed: false };

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
    const dimensions = [3000, 2400, 1800];
    const qualities = [0.86, 0.74, 0.62];
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
