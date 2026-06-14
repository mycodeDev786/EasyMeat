'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiX, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCartStore } from '@/context/cartStore';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getDeliveryFee, getVAT, getTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-black-deep border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <FiShoppingBag className="text-gold" size={22} />
                <h2 className="text-white font-bold text-lg">Your Cart</h2>
                <span className="bg-gold text-black text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <button onClick={closeCart} className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-all">
                <FiX size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🛒</div>
                  <p className="text-gray-400 text-lg">Your cart is empty</p>
                  <p className="text-gray-500 text-sm mt-1">Add some premium meats!</p>
                  <button
                    onClick={closeCart}
                    className="mt-6 btn-gold px-6 py-3 rounded-full font-semibold text-sm"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedWeight.label}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 glass border border-white/5 rounded-xl p-3"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-gray-500 text-xs">{item.selectedWeight.label}</p>
                      <p className="text-gold font-bold text-sm mt-0.5">AED {item.selectedWeight.price * item.quantity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.product.id, item.selectedWeight.label)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                      <div className="flex items-center gap-2 glass border border-white/10 rounded-lg px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedWeight.label, item.quantity - 1)}
                          className="text-gray-400 hover:text-white p-0.5"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="text-white text-xs w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedWeight.label, item.quantity + 1)}
                          className="text-gray-400 hover:text-white p-0.5"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">AED {getSubtotal().toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery</span>
                    <span className={getDeliveryFee() === 0 ? 'text-green-400' : 'text-white'}>
                      {getDeliveryFee() === 0 ? 'Free' : `AED ${getDeliveryFee()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>VAT (5%)</span>
                    <span className="text-white">AED {getVAT().toFixed(0)}</span>
                  </div>
                  {getDeliveryFee() > 0 && (
                    <p className="text-xs text-gold/70">Add AED {(200 - getSubtotal()).toFixed(0)} more for free delivery!</p>
                  )}
                </div>
                <div className="flex justify-between font-bold text-base border-t border-white/10 pt-3">
                  <span className="text-white">Total</span>
                  <span className="text-gold">AED {getTotal().toFixed(0)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block btn-gold py-4 rounded-xl font-bold text-center text-base mt-4"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center text-gray-400 hover:text-white text-sm py-2 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
