'use client';
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { products as mockProducts } from '@/lib/data';

export function useProducts(options?: {
  category?: string;
  featured?: boolean;
  limitTo?: number;
  search?: string;
}) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let filtered = [...mockProducts];

    if (options?.category) {
      filtered = filtered.filter(p => p.category === options.category);
    }
    if (options?.featured !== undefined) {
      filtered = filtered.filter(p => p.featured === options.featured);
    }
    if (options?.search) {
      const s = options.search.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(s) ||
          p.description?.toLowerCase().includes(s)
      );
    }
    if (options?.limitTo) {
      filtered = filtered.slice(0, options.limitTo);
    }

    setData(filtered);
    setLoading(false);
  }, [options?.category, options?.featured, options?.limitTo, options?.search]);

  return { data, loading };
}