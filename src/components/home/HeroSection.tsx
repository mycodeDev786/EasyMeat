'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), { ssr: false });

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{background:'linear-gradient(to bottom, #0A0A0A, #111827, #0A0A0A)'}}>
      <div className="absolute inset-0 opacity-55">
        <HeroScene />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{background:'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent, rgba(0,0,0,0.8))'}} />
      <div className="absolute inset-0 pointer-events-none" style={{background:'linear-gradient(to right, rgba(0,0,0,0.5), transparent, rgba(0,0,0,0.5))'}} />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <span className="halal-badge">100% Halal</span>
            <span className="text-gray-300 text-sm">Certified & Fresh Daily</span>
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
          className="section-title text-white mb-6">
          Premium Halal Meat{' '}
          <span className="text-gold-gradient">Delivered Fresh</span>{' '}
          Across UAE
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl text-gray-300 mb-10 font-light tracking-wider">
          Farm Fresh • Expertly Cut • Delivered To Your Doorstep
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-gold px-8 py-4 rounded-full text-lg font-semibold inline-block">Shop Now</Link>
          <Link href="/products#categories"
            className="glass border border-yellow-600/40 text-yellow-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-400/10 transition-all duration-300 inline-block">
            Explore Categories
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[{l:'Happy Customers',v:'15K+'},{l:'Orders Delivered',v:'50K+'},{l:'Emirates Covered',v:'7'}].map(s => (
            <div key={s.l} className="text-center">
              <p className="text-2xl font-bold text-gold-gradient">{s.v}</p>
              <p className="text-xs text-gray-400 mt-1">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-gray-400 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-10" style={{background:'linear-gradient(to bottom, #D4AF37, transparent)'}} />
      </motion.div>
    </section>
  );
}
