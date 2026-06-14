'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { FiStar } from 'react-icons/fi';
import { reviews } from '@/lib/data';

export default function ReviewsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 block">Testimonials</span>
          <h2 className="section-title text-white mb-4">
            What Our <span className="text-gold-gradient">Customers Say</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="glass border border-white/10 rounded-2xl p-6 hover:border-gold/30 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, s) => (
                  <FiStar key={s} size={14} className={s < review.rating ? 'star-filled fill-current' : 'star-empty'} />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{review.comment}"</p>

              {/* User */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold/30 flex-shrink-0">
                  <Image src={review.userAvatar} alt={review.userName} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{review.userName}</p>
                  <p className="text-gray-500 text-xs">{review.city}, UAE</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-6"
        >
          {[
            { label: '4.9/5 Rating', icon: '⭐' },
            { label: '15,000+ Customers', icon: '👥' },
            { label: '50,000+ Orders', icon: '📦' },
            { label: '100% Halal', icon: '✅' },
          ].map(badge => (
            <div key={badge.label} className="flex items-center gap-2 glass rounded-full px-5 py-2.5 border border-white/10">
              <span>{badge.icon}</span>
              <span className="text-gray-300 text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
