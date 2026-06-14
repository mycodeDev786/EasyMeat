'use client';
import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiHeart, FiShare2, FiCheck } from 'react-icons/fi';
import { products } from '@/lib/data';
import { useCartStore } from '@/context/cartStore';
import toast from 'react-hot-toast';

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id);
  if (!product) return notFound();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, selectedWeight, quantity);
    setAdded(true);
    toast.success(`${product.name} added to cart!`, { icon: '🥩' });
    setTimeout(() => setAdded(false), 2000);
  };

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gold">Products</Link>
          <span>/</span>
          <span className="text-gray-300">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-square rounded-3xl overflow-hidden bg-charcoal mb-4"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.originalPrice && (
                <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full">
                  SALE
                </span>
              )}
              <span className="absolute top-4 right-4 halal-badge">Halal ✓</span>
            </motion.div>

            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-gold' : 'border-white/10'}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Category & badges */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-gold text-sm font-medium uppercase tracking-wider">{product.category}</span>
              {product.isNew && <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-500/30">NEW</span>}
              {product.origin && <span className="text-gray-500 text-sm">📍 {product.origin}</span>}
            </div>

            <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-2">{product.name}</h1>
            {product.nameAr && <p className="text-gray-400 text-xl mb-4 font-arabic">{product.nameAr}</p>}

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} size={16} className={i < Math.floor(product.rating) ? 'star-filled fill-current' : 'star-empty'} />
                ))}
              </div>
              <span className="text-gold font-semibold">{product.rating}</span>
              <span className="text-gray-400 text-sm">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-gold">AED {selectedWeight.price}</span>
              {product.originalPrice && (
                <span className="text-gray-500 text-xl line-through">AED {Math.round(product.originalPrice * selectedWeight.weight / product.weightOptions[0].weight)}</span>
              )}
            </div>

            <p className="text-gray-400 leading-relaxed mb-6">{product.description}</p>

            {/* Weight Selection */}
            <div className="mb-6">
              <p className="text-white font-semibold mb-3">Select Weight</p>
              <div className="flex flex-wrap gap-3">
                {product.weightOptions.map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedWeight(opt)}
                    className={`px-4 py-2.5 rounded-xl border font-medium text-sm transition-all ${
                      selectedWeight.label === opt.label
                        ? 'btn-gold border-transparent'
                        : 'glass border-white/20 text-gray-300 hover:border-gold/40'
                    }`}
                  >
                    {opt.label} — AED {opt.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-white font-semibold mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 glass border border-white/10 rounded-xl px-2 py-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-gray-300 hover:text-gold">
                    <FiMinus size={16} />
                  </button>
                  <span className="text-white font-bold w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-gray-300 hover:text-gold">
                    <FiPlus size={16} />
                  </button>
                </div>
                <span className="text-gray-400 text-sm">{product.stock} in stock</span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all ${added ? 'bg-green-600 text-white' : 'btn-gold'}`}
              >
                {added ? <><FiCheck size={18} /> Added!</> : <><FiShoppingCart size={18} /> Add to Cart</>}
              </button>
              <button className="w-14 h-14 glass border border-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-400 hover:border-red-400/40 transition-all">
                <FiHeart size={20} />
              </button>
              <button className="w-14 h-14 glass border border-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-gold hover:border-gold/40 transition-all">
                <FiShare2 size={18} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="glass border border-white/10 rounded-2xl p-4 space-y-3">
              {[
                { icon: '✅', text: '100% Halal Certified' },
                { icon: '🚚', text: 'Same Day Delivery (Order before 3PM)' },
                { icon: '❄️', text: 'Temperature-controlled delivery' },
                { icon: '💵', text: 'Cash on Delivery available' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-gray-300">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Nutrition */}
            {product.nutritionInfo && (
              <div className="mt-6">
                <p className="text-white font-semibold mb-3">Nutrition (per 100g)</p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Calories', value: product.nutritionInfo.calories, unit: 'kcal' },
                    { label: 'Protein', value: product.nutritionInfo.protein, unit: 'g' },
                    { label: 'Fat', value: product.nutritionInfo.fat, unit: 'g' },
                    { label: 'Carbs', value: product.nutritionInfo.carbs, unit: 'g' },
                  ].map(n => (
                    <div key={n.label} className="glass border border-white/5 rounded-xl p-3 text-center">
                      <p className="text-gold font-bold text-lg">{n.value}{n.unit}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{n.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-bold text-white mb-8">
              You May Also <span className="text-gold-gradient">Like</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(p => (
                <Link key={p.id} href={`/product/${p.id}`} className="group premium-card">
                  <div className="glass border border-white/10 group-hover:border-gold/30 rounded-2xl overflow-hidden transition-all">
                    <div className="relative aspect-square">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="250px" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-white text-sm font-medium group-hover:text-gold transition-colors line-clamp-1">{p.name}</h3>
                      <p className="text-gold font-bold mt-1">AED {p.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
