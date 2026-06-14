'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { FiStar } from 'react-icons/fi';
import { reviews } from '@/lib/data';

export default function ReviewsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div ref={ref}>
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} className="text-center mb-16">
          <span className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Testimonials</span>
          <h2 className="section-title text-white mb-4">What Our <span className="text-gold-gradient">Customers Say</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r, i) => (
            <motion.div key={r.id} initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:i*0.12}}
              className="glass border border-white/10 rounded-2xl p-6 hover:border-yellow-400/30 transition-all duration-300">
              <div className="flex gap-0.5 mb-3">
                {Array.from({length:5}).map((_,s)=>(
                  <FiStar key={s} size={14} className={s<r.rating?'star-filled fill-current':'star-empty'} />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{r.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-yellow-400/30 flex-shrink-0">
                  <Image src={r.userAvatar} alt={r.userName} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{r.userName}</p>
                  <p className="text-gray-500 text-xs">{r.city}, UAE</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:0.6}}
          className="mt-12 flex flex-wrap justify-center gap-6">
          {[{l:'4.9/5 Rating',i:'⭐'},{l:'15,000+ Customers',i:'👥'},{l:'50,000+ Orders',i:'📦'},{l:'100% Halal',i:'✅'}].map(b=>(
            <div key={b.l} className="flex items-center gap-2 glass rounded-full px-5 py-2.5 border border-white/10">
              <span>{b.i}</span>
              <span className="text-gray-300 text-sm font-medium">{b.l}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
