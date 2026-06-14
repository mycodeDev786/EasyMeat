import { MetadataRoute } from 'next';
import { products, categories } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://EasyMeat.ae';

  const productPages = products.map(p => ({
    url: `${baseUrl}/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map(c => ({
    url: `${baseUrl}/products?category=${c.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/checkout`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/auth/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/auth/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    ...productPages,
    ...categoryPages,
  ];
}
