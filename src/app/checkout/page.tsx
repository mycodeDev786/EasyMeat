'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiTruck } from 'react-icons/fi';
import { useCartStore } from '@/context/cartStore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const CITIES = ['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDeliveryFee, getVAT, getTotal, clearCart } = useCartStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName:user?.displayName||'', phone:'', email:user?.email||'', street:'', building:'', area:'', city:'Dubai', deliveryDate:'', deliverySlot:'morning', notes:'' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm(prev=>({...prev,[e.target.name]:e.target.value}));

  const handlePlaceOrder = async () => {
    if (!form.fullName||!form.phone||!form.street||!form.city) { toast.error('Please fill all required fields'); return; }
    if (items.length===0) { toast.error('Your cart is empty'); return; }
    setLoading(true);
    try {
      const orderId = `ORD-${Date.now()}`;
      await addDoc(collection(db,'orders'), {
        orderId, userId: user?.uid||'guest',
        items: items.map(i=>({ productId:i.product.id, productName:i.product.name, image:i.product.images[0], quantity:i.quantity, weight:i.selectedWeight.label, price:i.selectedWeight.price })),
        subtotal:getSubtotal(), deliveryFee:getDeliveryFee(), vat:getVAT(), total:getTotal(),
        paymentMethod:'COD', status:'pending',
        deliveryAddress:{ fullName:form.fullName, phone:form.phone, street:form.street, building:form.building, area:form.area, city:form.city },
        deliveryDate:form.deliveryDate, deliveryTimeSlot:form.deliverySlot, notes:form.notes, createdAt:new Date(),
      });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch { toast.error('Failed to place order. Please try again.'); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors";
  const labelCls = "text-gray-400 text-sm mb-1 block";

  return (
    <div className="min-h-screen pt-24 pb-16" style={{background:'#0A0A0A'}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-white mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="glass border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm" style={{background:'rgba(212,175,55,0.2)',border:'1px solid rgba(212,175,55,0.3)',color:'#D4AF37'}}>1</span>
                Customer Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Full Name *</label><input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Ahmed Al Mansouri" className={inputCls}/></div>
                <div><label className={labelCls}>Phone Number *</label><input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+971 50 000 0000" className={inputCls}/></div>
                <div className="sm:col-span-2"><label className={labelCls}>Email (optional)</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputCls}/></div>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="glass border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm" style={{background:'rgba(212,175,55,0.2)',border:'1px solid rgba(212,175,55,0.3)',color:'#D4AF37'}}>2</span>
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className={labelCls}>Street Address *</label><input name="street" value={form.street} onChange={handleChange} placeholder="Villa 10, Street 5" className={inputCls}/></div>
                <div><label className={labelCls}>Building / Apt</label><input name="building" value={form.building} onChange={handleChange} placeholder="Apt 304, Tower A" className={inputCls}/></div>
                <div><label className={labelCls}>Area *</label><input name="area" value={form.area} onChange={handleChange} placeholder="Jumeirah, Mirdif..." className={inputCls}/></div>
                <div><label className={labelCls}>City *</label>
                  <select name="city" value={form.city} onChange={handleChange} className={inputCls}>
                    {CITIES.map(c=><option key={c} value={c} className="bg-gray-900">{c}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Delivery Time */}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="glass border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm" style={{background:'rgba(212,175,55,0.2)',border:'1px solid rgba(212,175,55,0.3)',color:'#D4AF37'}}>3</span>
                Delivery Time
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Delivery Date</label><input name="deliveryDate" type="date" value={form.deliveryDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className={inputCls}/></div>
                <div><label className={labelCls}>Time Slot</label>
                  <select name="deliverySlot" value={form.deliverySlot} onChange={handleChange} className={inputCls}>
                    <option value="morning" className="bg-gray-900">Morning (9AM – 1PM)</option>
                    <option value="afternoon" className="bg-gray-900">Afternoon (1PM – 5PM)</option>
                    <option value="evening" className="bg-gray-900">Evening (5PM – 10PM)</option>
                  </select>
                </div>
                <div className="sm:col-span-2"><label className={labelCls}>Special Instructions (optional)</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Ring the bell twice, call before delivery..." rows={2} className={`${inputCls} resize-none`}/>
                </div>
              </div>
            </motion.div>

            {/* Payment */}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="glass border border-yellow-400/20 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm" style={{background:'rgba(212,175,55,0.2)',border:'1px solid rgba(212,175,55,0.3)',color:'#D4AF37'}}>4</span>
                Payment Method
              </h2>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-yellow-400/30" style={{background:'rgba(212,175,55,0.08)'}}>
                <div className="w-5 h-5 rounded-full border-2 border-yellow-400 flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"/>
                </div>
                <div>
                  <p className="text-white font-semibold flex items-center gap-2">💵 Cash on Delivery
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/30">Default</span>
                  </p>
                  <p className="text-gray-400 text-sm mt-0.5">Pay securely when your order arrives at your doorstep.</p>
                </div>
              </div>
              <div className="mt-3 opacity-40 space-y-2">
                {['💳 Card Payment (Coming Soon)','🍏 Apple Pay (Coming Soon)','G Pay (Coming Soon)'].map(m=>(
                  <div key={m} className="flex items-center gap-4 p-3 border border-white/5 rounded-xl">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600"/>
                    <p className="text-gray-500 text-sm">{m}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 glass border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {items.map(item=>(
                  <div key={`${item.product.id}-${item.selectedWeight.label}`} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover"/>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-xs font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-gray-500 text-xs">{item.selectedWeight.label} × {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm" style={{color:'#D4AF37'}}>AED {item.selectedWeight.price*item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="text-white">AED {getSubtotal().toFixed(0)}</span></div>
                <div className="flex justify-between text-gray-400"><span>Delivery</span><span className={getDeliveryFee()===0?'text-green-400':'text-white'}>{getDeliveryFee()===0?'FREE':`AED ${getDeliveryFee()}`}</span></div>
                <div className="flex justify-between text-gray-400"><span>VAT (5%)</span><span className="text-white">AED {getVAT().toFixed(0)}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-white/10 pt-2 mt-2">
                  <span className="text-white">Total</span>
                  <span className="text-xl" style={{color:'#D4AF37'}}>AED {getTotal().toFixed(0)}</span>
                </div>
              </div>
              <button onClick={handlePlaceOrder} disabled={loading} className="mt-6 w-full btn-gold py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"/> : <><FiTruck size={18}/> Place Order</>}
              </button>
              <p className="text-center text-gray-500 text-xs mt-3">🔒 Secure • Cash on Delivery • Halal Certified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
