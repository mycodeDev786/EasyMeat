'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  { icon:'🌾', title:'Farm', desc:'Selected from certified halal farms in Australia, NZ, Japan & UAE' },
  { icon:'🔪', title:'Processing', desc:'Expertly butchered by our master butchers with precision and care' },
  { icon:'🔍', title:'Quality Check', desc:'Rigorous quality inspection and halal certification verification' },
  { icon:'📦', title:'Packaging', desc:'Vacuum sealed in food-grade packaging to preserve freshness' },
  { icon:'🚚', title:'Delivery', desc:'Temperature-controlled delivery straight to your doorstep' },
];

export default function ProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section className="py-24" style={{background:'linear-gradient(to bottom,#0A0A0A,#111827)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} className="text-center mb-16">
            <span className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Our Process</span>
            <h2 className="section-title text-white mb-4">From <span className="text-gold-gradient">Farm to Table</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Every step is carefully managed to ensure the highest quality, freshness, and halal integrity.</p>
          </motion.div>
          <div className="relative">
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-px" style={{background:'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)'}} />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              {steps.map((s, i) => (
                <motion.div key={s.title} initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:i*0.15}} className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <motion.div initial={{scale:0}} animate={inView?{scale:1}:{}} transition={{delay:i*0.15+0.3,type:'spring',stiffness:200}}
                      className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                      style={{background:'linear-gradient(135deg,rgba(212,175,55,0.2),rgba(212,175,55,0.05))',border:'1px solid rgba(212,175,55,0.3)'}}>
                      {s.icon}
                    </motion.div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-black text-xs font-bold" style={{background:'#D4AF37'}}>
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
