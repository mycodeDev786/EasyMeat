'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

export default function CTABanner() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold/20 via-black-deep to-black border border-gold/30 p-12 text-center"
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <span className="text-4xl mb-4 block">🥩</span>
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Ready to Order Premium Meat?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Order online or via WhatsApp. Cash on delivery available across all UAE emirates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-gold px-8 py-4 rounded-full text-lg font-semibold inline-block">
                Shop Now
              </Link>
              <a
                href="https://wa.me/971500000000"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
              >
                <FaWhatsapp size={22} />
                Order via WhatsApp
              </a>
            </div>

            {/* Delivery info */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span>🚚 Free delivery on orders over AED 200</span>
              <span>⏰ Same-day delivery available</span>
              <span>❄️ Cold chain maintained</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
