'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useCartStore } from '@/context/cartStore';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop All' },
  { href: '/products?category=wagyu', label: 'Wagyu' },
  { href: '/products?category=bbq', label: 'BBQ Specials' },
  { href: '/products?category=family', label: 'Family Packs' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getTotalItems, toggleCart } = useCartStore();
  const { user } = useAuth();
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-yellow-600/20 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg,#D4AF37,#E8C84B,#B8931E)'}}>
                <span className="text-black font-bold text-sm">LM</span>
              </div>
              <span className="font-serif text-xl font-bold text-white">
                Luxe<span className="text-gold-gradient">Meat</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="text-sm text-gray-300 hover:text-yellow-400 transition-colors font-medium">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button onClick={() => setSearchOpen(!searchOpen)} className="text-gray-300 hover:text-yellow-400 transition-colors p-2">
                <FiSearch size={19} />
              </button>
              <Link href={user ? '/dashboard' : '/auth/login'} className="text-gray-300 hover:text-yellow-400 transition-colors p-2">
                <FiUser size={19} />
              </Link>
              <button onClick={toggleCart} className="relative text-gray-300 hover:text-yellow-400 transition-colors p-2">
                <FiShoppingCart size={19} />
                {totalItems > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    style={{background:'#D4AF37'}}>
                    {totalItems}
                  </motion.span>
                )}
              </button>
              <button className="md:hidden text-gray-300 hover:text-yellow-400 transition-colors p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3">
                <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/products?q=${searchQuery}`; }}>
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search for beef, lamb, wagyu..." autoFocus
                    className="w-full bg-white/10 border border-yellow-600/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400" />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-72 z-50 p-6 border-l border-yellow-600/20"
              style={{background:'#111827'}}>
              <div className="flex justify-between items-center mb-8">
                <span className="font-serif text-xl text-yellow-400">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-white"><FiX size={24} /></button>
              </div>
              <nav className="flex flex-col gap-2">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className="text-gray-300 hover:text-yellow-400 py-3 border-b border-white/5 transition-colors text-base">
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8">
                <Link href={user ? '/dashboard' : '/auth/login'}
                  className="block btn-gold text-center py-3 px-6 rounded-full font-semibold"
                  onClick={() => setMobileOpen(false)}>
                  {user ? 'My Account' : 'Login / Register'}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
