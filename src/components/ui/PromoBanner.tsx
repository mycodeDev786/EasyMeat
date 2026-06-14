'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative"
          style={{ background: 'linear-gradient(135deg,#D4AF37,#E8C84B,#B8931E)', zIndex: 9999 }}
        >
          {/* Text */}
          <p className="text-black text-center text-sm font-semibold py-2 px-10">
            🥩 FREE DELIVERY on orders over AED 200 &nbsp;·&nbsp; Same-day delivery &nbsp;·&nbsp; 100% Halal Certified
          </p>

          {/* Close button — fixed position inside banner */}
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Close banner"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10000,
              background: 'rgba(0,0,0,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.15)')}
          >
            <FiX size={14} color="#000" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}