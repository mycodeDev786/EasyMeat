'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiFilter, FiGrid, FiList, FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { products, categories } from '@/lib/data';
import { useCartStore } from '@/context/cartStore';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCartStore();

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'all') list = list.filter(p => p.category === selectedCategory);
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'new': list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [selectedCategory, sortBy, priceRange]);

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product, product.weightOptions[0]);
    toast.success(`${product.name} added!`, { icon: '🥩' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title text-white mb-2">
            Our <span className="text-gold-gradient">Premium Selection</span>
          </h1>
          <p className="text-gray-400">Farm fresh halal meats delivered to your door</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'all' ? 'btn-gold' : 'glass border border-white/10 text-gray-300 hover:border-gold/40'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id ? 'btn-gold' : 'glass border border-white/10 text-gray-300 hover:border-gold/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${showFilters ? 'bg-gold/20 text-gold border border-gold/40' : 'glass border border-white/10 text-gray-300'}`}
            >
              <FiFilter size={14} />
              Filters
            </button>
            <span className="text-gray-500 text-sm">{filtered.length} products</span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
              <option value="new">New Arrivals</option>
            </select>
            <div className="flex gap-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'text-gold' : 'text-gray-500'}`}>
                <FiGrid size={18} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'text-gold' : 'text-gray-500'}`}>
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Price Range (AED)</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="0" max="1000" step="10"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="flex-1 accent-gold"
                  />
                  <span className="text-gold font-medium whitespace-nowrap">Up to AED {priceRange[1]}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          <AnimatePresence>
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="premium-card group"
              >
                <div className={`glass border border-white/10 group-hover:border-gold/30 rounded-2xl overflow-hidden transition-all duration-300 ${viewMode === 'list' ? 'flex gap-4 p-4' : ''}`}>
                  {/* Image */}
                  <div className={`relative overflow-hidden bg-charcoal flex-shrink-0 ${viewMode === 'list' ? 'w-32 h-32 rounded-xl' : 'aspect-square'}`}>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="300px"
                    />
                    {product.originalPrice && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    )}
                    {viewMode === 'grid' && (
                      <button className="absolute top-2 right-2 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400">
                        <FiHeart size={14} />
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <div className={`${viewMode === 'grid' ? 'p-4' : 'flex-1 flex flex-col justify-between'}`}>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <FiStar className="star-filled fill-current" size={11} />
                        <span className="text-xs text-gray-400">{product.rating}</span>
                        <span className="text-gray-600 text-xs ml-1">({product.reviewCount})</span>
                      </div>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="text-white font-semibold text-sm hover:text-gold transition-colors">{product.name}</h3>
                      </Link>
                      {viewMode === 'list' && (
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{product.description}</p>
                      )}
                    </div>
                    <div className={`${viewMode === 'grid' ? 'mt-3' : ''}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-gold font-bold">AED {product.price}</span>
                        {product.originalPrice && (
                          <span className="text-gray-500 text-xs line-through">AED {product.originalPrice}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full btn-gold py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                      >
                        <FiShoppingCart size={13} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg">No products found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
