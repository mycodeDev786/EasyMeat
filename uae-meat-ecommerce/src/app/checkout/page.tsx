'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiCheck, FiTruck } from 'react-icons/fi';
import { useCartStore } from '@/context/cartStore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const UAE_CITIES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDeliveryFee, getVAT, getTotal, clearCart } = useCartStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.displayName || '',
    phone: '',
    email: user?.email || '',
    street: '',
    building: '',
    area: '',
    city: 'Dubai',
    emirate: 'Dubai',
    deliveryDate: '',
    deliverySlot: 'morning',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    if (!form.fullName || !form.phone || !form.street || !form.city) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderId = `ORD-${Date.now()}`;
      await addDoc(collection(db, 'orders'), {
        orderId,
        userId: user?.uid || 'guest',
        items: items.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          image: i.product.images[0],
          quantity: i.quantity,
          weight: i.selectedWeight.label,
          price: i.selectedWeight.price,
        })),
        subtotal: getSubtotal(),
        deliveryFee: getDeliveryFee(),
        vat: getVAT(),
        total: getTotal(),
        paymentMethod: 'COD',
        status: 'pending',
        deliveryAddress: {
          fullName: form.fullName,
          phone: form.phone,
          street: form.street,
          building: form.building,
          area: form.area,
          city: form.city,
          emirate: form.emirate,
        },
        deliveryDate: form.deliveryDate,
        deliveryTimeSlot: form.deliverySlot,
        notes: form.notes,
        createdAt: new Date(),
      });

      clearCart();
      toast.success('Order placed successfully! 🎉');
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-white mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-gold/20 border border-gold/30 rounded-full flex items-center justify-center text-gold text-sm">1</span>
                Customer Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'fullName', label: 'Full Name *', type: 'text', placeholder: 'Ahmed Al Mansouri' },
                  { name: 'phone', label: 'Phone Number *', type: 'tel', placeholder: '+971 50 000 0000' },
                  { name: 'email', label: 'Email (optional)', type: 'email', placeholder: 'email@example.com' },
                ].map(field => (
                  <div key={field.name} className={field.name === 'email' ? 'sm:col-span-2' : ''}>
                    <label className="text-gray-400 text-sm mb-1 block">{field.label}</label>
                    <input
                      name={field.name}
                      type={field.type}
                      value={form[field.name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-gold/20 border border-gold/30 rounded-full flex items-center justify-center text-gold text-sm">2</span>
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-gray-400 text-sm mb-1 block">Street Address *</label>
                  <input name="street" value={form.street} onChange={handleChange} placeholder="Villa 10, Street 5" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Building / Apt</label>
                  <input name="building" value={form.building} onChange={handleChange} placeholder="Apt 304, Tower A" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Area *</label>
                  <input name="area" value={form.area} onChange={handleChange} placeholder="Jumeirah, Mirdif..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">City *</label>
                  <select name="city" value={form.city} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold">
                    {UAE_CITIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Delivery Time */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-gold/20 border border-gold/30 rounded-full flex items-center justify-center text-gold text-sm">3</span>
                Delivery Time
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Delivery Date</label>
                  <input name="deliveryDate" type="date" value={form.deliveryDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Time Slot</label>
                  <select name="deliverySlot" value={form.deliverySlot} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold">
                    <option value="morning" className="bg-gray-900">Morning (9AM - 1PM)</option>
                    <option value="afternoon" className="bg-gray-900">Afternoon (1PM - 5PM)</option>
                    <option value="evening" className="bg-gray-900">Evening (5PM - 10PM)</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-gray-400 text-sm mb-1 block">Special Instructions (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Ring the bell twice, call before delivery..." rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold resize-none" />
              </div>
            </motion.div>

            {/* Payment */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass border border-gold/20 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-gold/20 border border-gold/30 rounded-full flex items-center justify-center text-gold text-sm">4</span>
                Payment Method
              </h2>
              <div className="flex items-center gap-4 p-4 bg-gold/10 border border-gold/30 rounded-xl">
                <div className="w-5 h-5 rounded-full border-2 border-gold flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                </div>
                <div>
                  <p className="text-white font-semibold flex items-center gap-2">
                    💵 Cash on Delivery
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/30">Default</span>
                  </p>
                  <p className="text-gray-400 text-sm mt-0.5">Pay securely when your order arrives at your doorstep.</p>
                </div>
              </div>
              <div className="mt-3 opacity-40">
                {['💳 Card Payment', '🍏 Apple Pay', 'G Pay'].map(method => (
                  <div key={method} className="flex items-center gap-4 p-3 border border-white/5 rounded-xl mt-2">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                    <p className="text-gray-500 text-sm">{method} <span className="text-xs">(Coming Soon)</span></p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="glass border border-white/10 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={`${item.product.id}-${item.selectedWeight.label}`} className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-gray-500 text-xs">{item.selectedWeight.label} × {item.quantity}</p>
                      </div>
                      <p className="text-gold text-sm font-bold">AED {item.selectedWeight.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="text-white">AED {getSubtotal().toFixed(0)}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Delivery</span><span className={getDeliveryFee() === 0 ? 'text-green-400' : 'text-white'}>{getDeliveryFee() === 0 ? 'FREE' : `AED ${getDeliveryFee()}`}</span></div>
                  <div className="flex justify-between text-gray-400"><span>VAT (5%)</span><span className="text-white">AED {getVAT().toFixed(0)}</span></div>
                  <div className="flex justify-between font-bold text-base border-t border-white/10 pt-2 mt-2">
                    <span className="text-white">Total</span>
                    <span className="text-gold text-xl">AED {getTotal().toFixed(0)}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="mt-6 w-full btn-gold py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <><FiTruck size={18} /> Place Order</>
                  )}
                </button>
                <p className="text-center text-gray-500 text-xs mt-3">🔒 Secure • Cash on Delivery • Halal Certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
