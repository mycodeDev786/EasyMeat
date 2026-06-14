'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import { products as mockProducts } from '@/lib/data';

/**
 * Hook that fetches products from Firestore, falling back to mock data.
 * This ensures the site works even before Firestore is populated.
 */
export function useProducts(options?: {
  category?: string;
  featured?: boolean;
  limitTo?: number;
  search?: string;
}) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q: any = collection(db, 'products');
        const constraints: any[] = [];

        if (options?.category) constraints.push(where('category', '==', options.category));
        if (options?.featured !== undefined) constraints.push(where('featured', '==', options.featured));
        constraints.push(orderBy('createdAt', 'desc'));
        if (options?.limitTo) constraints.push(limit(options.limitTo));

        const snap = await getDocs(query(q, ...constraints));

        if (snap.empty) {
          // Fall back to mock data
          let filtered = [...mockProducts];
          if (options?.category) filtered = filtered.filter(p => p.category === options.category);
          if (options?.featured !== undefined) filtered = filtered.filter(p => p.featured === options.featured);
          if (options?.search) {
            const s = options.search.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
          }
          if (options?.limitTo) filtered = filtered.slice(0, options.limitTo);
          setData(filtered);
        } else {
          let prods = snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as Product));
          if (options?.search) {
            const s = options.search.toLowerCase();
            prods = prods.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
          }
          setData(prods);
        }
      } catch (err) {
        // Fall back to mock data on error
        setData(mockProducts);
        setError('Using demo data');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options?.category, options?.featured, options?.limitTo, options?.search]);

  return { data, loading, error };
}
