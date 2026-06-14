'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('orderId');

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/30 to-green-600/10 border border-green-500/30 flex items-center justify-center text-4xl mx-auto mb-6"
        >
          ✅
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="font-display text-4xl font-bold text-white mb-4">
            Order <span className="text-gold-gradient">Confirmed!</span>
          </h1>
          <p className="text-gray-400 text-lg mb-3">
            Thank you for your order. Your premium halal meat is being prepared!
          </p>
          {orderId && (
            <p className="text-gold font-mono text-sm mb-8 glass inline-block px-4 py-2 rounded-full border border-gold/30">
              Order ID: {orderId}
            </p>
          )}

          <div className="glass border border-white/10 rounded-2xl p-6 mb-8 text-left space-y-4">
            {[
              { icon: '📞', title: 'Confirmation Call', text: 'Our team will call you within 30 minutes to confirm your order.' },
              { icon: '🔪', title: 'Fresh Preparation', text: 'Your meat will be expertly cut and prepared fresh for you.' },
              { icon: '❄️', title: 'Cold Packed', text: 'Vacuum-sealed and packed in temperature-controlled packaging.' },
              { icon: '🚚', title: 'Fast Delivery', text: 'Delivered to your doorstep at your chosen time slot.' },
              { icon: '💵', title: 'Pay on Arrival', text: 'Pay in cash when the delivery arrives. No prepayment needed.' },
            ].map(step => (
              <div key={step.title} className="flex gap-3">
                <span className="text-2xl">{step.icon}</span>
                <div>
                  <p className="text-white font-medium">{step.title}</p>
                  <p className="text-gray-400 text-sm">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/orders" className="btn-gold px-8 py-4 rounded-full font-semibold">
              Track My Order
            </Link>
            <Link href="/products" className="glass border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:border-gold/40 transition-all">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
