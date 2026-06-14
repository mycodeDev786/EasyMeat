'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useCartStore } from '@/context/cartStore';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
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
          scrolled ? 'glass border-b border-gold/20 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
                <span className="text-black font-bold text-sm">LM</span>
              </div>
              <span className="font-display text-xl font-bold text-white">
                Luxe<span className="text-gold-gradient">Meat</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-gold transition-colors duration-200 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-300 hover:text-gold transition-colors p-2"
              >
                <FiSearch size={20} />
              </button>

              <Link href={user ? '/dashboard' : '/auth/login'} className="text-gray-300 hover:text-gold transition-colors p-2">
                <FiUser size={20} />
              </Link>

              <button
                onClick={toggleCart}
                className="relative text-gray-300 hover:text-gold transition-colors p-2"
              >
                <FiShoppingCart size={20} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              <button
                className="md:hidden text-gray-300 hover:text-gold transition-colors p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-3"
              >
                <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/products?q=${searchQuery}`; }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search for beef, lamb, wagyu..."
                    autoFocus
                    className="w-full bg-white/10 border border-gold/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-72 bg-black-deep z-50 p-6 border-l border-gold/20"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-display text-xl text-gold">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-white">
                  <FiX size={24} />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-gray-300 hover:text-gold py-2 border-b border-white/5 transition-colors text-lg"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 space-y-3">
                <Link
                  href={user ? '/dashboard' : '/auth/login'}
                  className="block btn-gold text-center py-3 px-6 rounded-full font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  {user ? 'My Account' : 'Login'}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
