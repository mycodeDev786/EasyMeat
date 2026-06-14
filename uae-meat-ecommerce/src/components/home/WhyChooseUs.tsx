'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const features = [
  {
    icon: '✅',
    title: '100% Halal Certified',
    description: 'All our meat is certified halal by UAE authorities. Guaranteed purity from farm to your table.',
    color: 'from-green-500/20 to-green-900/10',
    border: 'border-green-500/20',
  },
  {
    icon: '🌿',
    title: 'Fresh Daily',
    description: 'Sourced and delivered fresh every single day. We never compromise on freshness.',
    color: 'from-emerald-500/20 to-emerald-900/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: '⚡',
    title: 'Same Day Delivery',
    description: 'Order before 3PM and receive your meat the same evening. Fast, reliable, and on time.',
    color: 'from-gold/20 to-yellow-900/10',
    border: 'border-gold/20',
  },
  {
    icon: '💵',
    title: 'Cash on Delivery',
    description: 'No need to pay online. Pay in cash when your order arrives at your doorstep.',
    color: 'from-blue-500/20 to-blue-900/10',
    border: 'border-blue-500/20',
  },
  {
    icon: '👑',
    title: 'Premium Quality',
    description: 'We source from the world\'s finest farms – Australia, New Zealand, Japan and local UAE farms.',
    color: 'from-purple-500/20 to-purple-900/10',
    border: 'border-purple-500/20',
  },
  {
    icon: '❄️',
    title: 'Cold Chain Delivery',
    description: 'Temperature-controlled vehicles ensure your meat stays at the perfect temperature throughout delivery.',
    color: 'from-cyan-500/20 to-cyan-900/10',
    border: 'border-cyan-500/20',
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 bg-black-deep/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 block">Our Promise</span>
            <h2 className="section-title text-white mb-4">
              Why Choose <span className="text-gold-gradient">EasyMeat</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're not just a meat delivery service. We're your trusted partner in bringing the finest halal meats to your table.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.03, translateY: -4 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${feature.color} border ${feature.border} backdrop-blur-sm transition-all duration-300 cursor-default`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
