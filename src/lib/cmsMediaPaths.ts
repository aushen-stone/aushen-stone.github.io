const CMS_MEDIA_PUBLIC_PREFIX = "/storage/v1/object/public/cms-media/";

export const cmsMediaStaticPath = (
  value: string,
  supabaseUrl: string,
): string | null => {
  let mediaUrl: URL;
  let projectUrl: URL;
  try {
    mediaUrl = new URL(value);
    projectUrl = new URL(supabaseUrl);
  } catch {
    return null;
  }

  if (
    mediaUrl.origin !== projectUrl.origin ||
    !mediaUrl.pathname.startsWith(CMS_MEDIA_PUBLIC_PREFIX)
  ) {
    return null;
  }

  const objectPath = mediaUrl.pathname.slice(CMS_MEDIA_PUBLIC_PREFIX.length);
  const segments = objectPath.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
    return null;
  }
  const safePath = segments
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join("/");
  return `/cms-media/${safePath}`;
};
