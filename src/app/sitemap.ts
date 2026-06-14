import { MetadataRoute } from 'next';
import { products, categories } from '@/lib/data';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://luxemeat.ae';
  return [
    {url:base,lastModified:new Date(),changeFrequency:'daily',priority:1},
    {url:`${base}/products`,lastModified:new Date(),changeFrequency:'daily',priority:0.9},
    ...products.map(p=>({url:`${base}/product/${p.id}`,lastModified:new Date(),changeFrequency:'weekly' as const,priority:0.8})),
    ...categories.map(c=>({url:`${base}/products?category=${c.id}`,lastModified:new Date(),changeFrequency:'weekly' as const,priority:0.7})),
  ];
}
