'use client';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('orderId');
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center" style={{background:'#0A0A0A'}}>
      <div className="max-w-lg mx-auto px-4 text-center">
        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:200,delay:0.2}}
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
          style={{background:'linear-gradient(135deg,rgba(34,197,94,0.3),rgba(22,163,74,0.1))',border:'1px solid rgba(34,197,94,0.3)'}}>
          ✅
        </motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}}>
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Order <span className="text-gold-gradient">Confirmed!</span></h1>
          <p className="text-gray-400 text-lg mb-3">Thank you! Your premium halal meat is being prepared.</p>
          {orderId && (
            <p className="font-mono text-sm mb-8 glass inline-block px-4 py-2 rounded-full border border-yellow-400/30" style={{color:'#D4AF37'}}>
              Order ID: {orderId}
            </p>
          )}
          <div className="glass border border-white/10 rounded-2xl p-6 mb-8 text-left space-y-4">
            {[
              {i:'📞',t:'Confirmation Call',d:'Our team will call you within 30 minutes to confirm your order.'},
              {i:'🔪',t:'Fresh Preparation',d:'Your meat will be expertly cut and prepared fresh for you.'},
              {i:'❄️',t:'Cold Packed',d:'Vacuum-sealed and packed in temperature-controlled packaging.'},
              {i:'🚚',t:'Fast Delivery',d:'Delivered to your doorstep at your chosen time slot.'},
              {i:'💵',t:'Pay on Arrival',d:'Pay in cash when the delivery arrives. No prepayment needed.'},
            ].map(s=>(
              <div key={s.t} className="flex gap-3">
                <span className="text-2xl">{s.i}</span>
                <div><p className="text-white font-medium">{s.t}</p><p className="text-gray-400 text-sm">{s.d}</p></div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/orders" className="btn-gold px-8 py-4 rounded-full font-semibold inline-block">Track My Order</Link>
            <Link href="/products" className="glass border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:border-yellow-400/40 transition-all inline-block">Continue Shopping</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}
