'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  { icon: '🌾', title: 'Farm', description: 'Selected from certified halal farms in Australia, NZ, Japan & UAE' },
  { icon: '🔪', title: 'Processing', description: 'Expertly butchered by our master butchers with precision and care' },
  { icon: '🔍', title: 'Quality Check', description: 'Rigorous quality inspection and halal certification verification' },
  { icon: '📦', title: 'Packaging', description: 'Vacuum sealed in food-grade packaging to preserve freshness' },
  { icon: '🚚', title: 'Delivery', description: 'Temperature-controlled delivery straight to your doorstep' },
];

export default function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 bg-gradient-to-b from-black to-black-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 block">Our Process</span>
            <h2 className="section-title text-white mb-4">
              From <span className="text-gold-gradient">Farm to Table</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We take every step seriously to ensure the meat you receive is of the highest quality, freshness, and halal integrity.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon circle */}
                  <div className="relative mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: i * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center text-3xl"
                    >
                      {step.icon}
                    </motion.div>

                    {/* Step number */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold text-black text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </div>
                  </div>

                  {/* Arrow between steps (mobile hidden) */}
                  {i < steps.length - 1 && (
                    <div className="hidden sm:block lg:hidden absolute text-gold opacity-30 text-2xl" style={{ right: '-16px', top: '24px' }}>→</div>
                  )}

                  <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
