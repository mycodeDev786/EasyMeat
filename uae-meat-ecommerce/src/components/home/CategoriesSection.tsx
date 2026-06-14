'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { categories } from '@/lib/data';

const categoryGradients: Record<string, string> = {
  beef: 'from-red-900/80 to-red-700/40',
  lamb: 'from-amber-900/80 to-amber-700/40',
  chicken: 'from-yellow-900/80 to-yellow-700/40',
  goat: 'from-stone-800/80 to-stone-600/40',
  wagyu: 'from-yellow-800/80 to-yellow-600/40',
  seafood: 'from-blue-900/80 to-blue-700/40',
  bbq: 'from-orange-900/80 to-orange-700/40',
  family: 'from-purple-900/80 to-purple-700/40',
};

const categoryEmojis: Record<string, string> = {
  beef: '🥩', lamb: '🍖', chicken: '🍗', goat: '🐐',
  wagyu: '⭐', seafood: '🦐', bbq: '🔥', family: '👨‍👩‍👧‍👦',
};

export default function CategoriesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="categories" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 block">What We Offer</span>
          <h2 className="section-title text-white mb-4">
            Explore Our <span className="text-gold-gradient">Categories</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From everyday essentials to luxury cuts, explore our premium selection of halal meats sourced from the finest farms worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30, rotateX: 15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ delay: index * 0.08, duration: 0.6 }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                z: 50,
                transition: { duration: 0.2 },
              }}
              className="premium-card group"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              <Link href={`/products?category=${cat.id}`}>
                <div className={`relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br ${categoryGradients[cat.id]} glass border border-white/10 group-hover:border-gold/40 transition-all duration-300`}>
                  {/* Emoji background */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 text-8xl select-none">
                    {categoryEmojis[cat.id]}
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-gold/10 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-3xl mb-1">{categoryEmojis[cat.id]}</div>
                    <h3 className="text-white font-bold text-sm group-hover:text-gold transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{cat.description}</p>
                  </div>

                  {/* Arrow */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-300">
                    <span className="text-gold text-xs">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
