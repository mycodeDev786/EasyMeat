'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const features = [
  { icon:'✅', title:'100% Halal Certified', desc:'All our meat is certified halal by UAE authorities. Guaranteed purity from farm to your table.', c:'from-green-500/20 to-green-900/10', b:'border-green-500/20' },
  { icon:'🌿', title:'Fresh Daily', desc:'Sourced and delivered fresh every single day. We never compromise on freshness.', c:'from-emerald-500/20 to-emerald-900/10', b:'border-emerald-500/20' },
  { icon:'⚡', title:'Same Day Delivery', desc:'Order before 3PM and receive your meat the same evening. Fast, reliable, and on time.', c:'from-yellow-500/20 to-yellow-900/10', b:'border-yellow-500/20' },
  { icon:'💵', title:'Cash on Delivery', desc:'No need to pay online. Pay in cash when your order arrives at your doorstep.', c:'from-blue-500/20 to-blue-900/10', b:'border-blue-500/20' },
  { icon:'👑', title:'Premium Quality', desc:"We source from the world's finest farms – Australia, New Zealand, Japan and local UAE farms.", c:'from-purple-500/20 to-purple-900/10', b:'border-purple-500/20' },
  { icon:'❄️', title:'Cold Chain Delivery', desc:'Temperature-controlled vehicles ensure your meat stays at the perfect temperature throughout.', c:'from-cyan-500/20 to-cyan-900/10', b:'border-cyan-500/20' },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section className="py-24" style={{background:'rgba(17,24,39,0.5)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} className="text-center mb-16">
            <span className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Our Promise</span>
            <h2 className="section-title text-white mb-4">Why Choose <span className="text-gold-gradient">LuxeMeat</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We're not just a meat delivery service. We're your trusted partner in bringing the finest halal meats to your table.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:i*0.1,duration:0.6}}
                whileHover={{scale:1.03,translateY:-4}}
                className={`p-6 rounded-2xl bg-gradient-to-br ${f.c} border ${f.b} backdrop-blur-sm transition-all duration-300 cursor-default`}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
