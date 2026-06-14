'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCartStore } from '@/context/cartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getDeliveryFee, getVAT, getTotal } = useCartStore();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="text-gray-400 hover:text-gold transition-colors flex items-center gap-1.5 text-sm">
            <FiArrowLeft size={14} /> Continue Shopping
          </Link>
          <span className="text-gray-600">/</span>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <FiShoppingBag className="text-gold" /> Your Cart
            <span className="text-gold text-lg">({items.length})</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="font-display text-2xl text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Browse our premium halal meat selection</p>
            <Link href="/products" className="btn-gold px-8 py-3.5 rounded-full font-bold inline-block">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedWeight.label}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass border border-white/10 rounded-2xl p-5 flex gap-4"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/product/${item.product.id}`} className="text-white font-semibold hover:text-gold transition-colors line-clamp-1">
                          {item.product.name}
                        </Link>
                        <p className="text-gray-500 text-sm mt-0.5">Weight: {item.selectedWeight.label}</p>
                        <p className="text-gold font-bold mt-1">AED {item.selectedWeight.price} each</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.selectedWeight.label)}
                        className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded-lg transition-all flex-shrink-0"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 glass border border-white/10 rounded-xl px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedWeight.label, item.quantity - 1)}
                          className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        >
                          <FiMinus size={13} />
                        </button>
                        <span className="text-white font-bold w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedWeight.label, item.quantity + 1)}
                          className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        >
                          <FiPlus size={13} />
                        </button>
                      </div>
                      <span className="text-gold font-bold text-lg">
                        AED {(item.selectedWeight.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="glass border border-white/10 rounded-2xl p-6 sticky top-28">
                <h2 className="text-white font-bold text-lg mb-5">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="text-white font-medium">AED {getSubtotal().toFixed(0)}</span></div>
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery</span>
                    <span className={getDeliveryFee() === 0 ? 'text-green-400 font-medium' : 'text-white font-medium'}>
                      {getDeliveryFee() === 0 ? 'Free 🎉' : `AED ${getDeliveryFee()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400"><span>VAT (5%)</span><span className="text-white font-medium">AED {getVAT().toFixed(0)}</span></div>
                  {getDeliveryFee() > 0 && (
                    <p className="text-xs text-gold/80 bg-gold/5 border border-gold/10 rounded-lg px-3 py-2">
                      🚀 Add AED {(200 - getSubtotal()).toFixed(0)} more for free delivery!
                    </p>
                  )}
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-white/10 mt-4 pt-4">
                  <span className="text-white">Total</span>
                  <span className="text-gold text-2xl">AED {getTotal().toFixed(0)}</span>
                </div>
                <Link href="/checkout" className="block btn-gold py-4 rounded-xl font-bold text-center text-base mt-5">
                  Proceed to Checkout →
                </Link>
                <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-500">
                  <span>🔒 Secure</span>
                  <span>•</span>
                  <span>✅ 100% Halal</span>
                  <span>•</span>
                  <span>💵 COD</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
