export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) return siteUrl;

  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  if (!vercelUrl) return "http://localhost:3000";

  return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
}

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}
