import type { MetadataRoute } from 'next';
import { SITE, tools } from '@/lib/tools';
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [{ url: SITE.url, lastModified: now, priority: 1 }, ...tools.map((t) => ({ url: `${SITE.url}/tools/${t.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 }))];
}
