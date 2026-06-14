'use client';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  return (
    <motion.a href="https://wa.me/971500000000?text=Hello%20EasyMeat!%20I'd%20like%20to%20place%20an%20order."
      target="_blank" rel="noopener noreferrer"
      initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:2,type:'spring',stiffness:200}}
      whileHover={{scale:1.1}} whileTap={{scale:0.95}}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-2xl transition-colors"
      style={{boxShadow:'0 10px 30px rgba(34,197,94,0.3)'}}>
      <FaWhatsapp size={28} className="text-white" />
      <span className="absolute w-full h-full rounded-full bg-green-500 animate-ping opacity-25" />
    </motion.a>
  );
}
