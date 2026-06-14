'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { products } from '@/lib/data';
import { useCartStore } from '@/context/cartStore';
import toast from 'react-hot-toast';

export default function BestSellers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { addItem } = useCartStore();
  const featured = products.filter(p => p.featured).slice(0, 4);

  const handleAdd = (product: typeof products[0]) => {
    addItem(product, product.weightOptions[0]);
    toast.success(`${product.name} added to cart!`, { icon: '🥩' });
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div ref={ref}>
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div>
            <span className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-2 block">Top Picks</span>
            <h2 className="section-title text-white">Best <span className="text-gold-gradient">Sellers</span></h2>
          </div>
          <Link href="/products" className="mt-4 sm:mt-0 text-yellow-400 border border-yellow-400/30 px-6 py-2.5 rounded-full hover:bg-yellow-400 hover:text-black transition-all duration-300 text-sm font-medium">
            View All →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p, i) => (
            <motion.div key={p.id} initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:i*0.1}}
              className="premium-card group">
              <div className="glass border border-white/10 group-hover:border-yellow-400/30 rounded-2xl overflow-hidden transition-all duration-300">
                <div className="relative aspect-square overflow-hidden bg-gray-900">
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" />
                  <div className="absolute inset-0" style={{background:'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'}} />
                  {p.originalPrice && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                    </span>
                  )}
                  {p.isNew && <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>}
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400">
                    <FiHeart size={14} />
                  </button>
                  <button onClick={() => handleAdd(p)} className="absolute bottom-3 right-3 btn-gold p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiShoppingCart size={15} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-1">
                    <FiStar className="star-filled fill-current" size={12} />
                    <span className="text-xs text-gray-400">{p.rating} ({p.reviewCount})</span>
                    <span className="ml-auto text-xs text-gray-500">{p.origin}</span>
                  </div>
                  <Link href={`/product/${p.id}`}>
                    <h3 className="text-white font-semibold text-sm group-hover:text-yellow-400 transition-colors line-clamp-1">{p.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-400 font-bold">AED {p.price}</span>
                    {p.originalPrice && <span className="text-gray-500 text-xs line-through">AED {p.originalPrice}</span>}
                    <span className="text-xs text-gray-500 ml-auto">{p.weightOptions[0].label}</span>
                  </div>
                  <button onClick={() => handleAdd(p)} className="mt-3 w-full btn-gold py-2 rounded-lg text-sm font-semibold">Add to Cart</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
