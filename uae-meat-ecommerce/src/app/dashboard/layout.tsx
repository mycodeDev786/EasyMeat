'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiMapPin, FiLogOut, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard', label: 'Profile', icon: FiUser, exact: true },
  { href: '/dashboard/orders', label: 'My Orders', icon: FiPackage },
  { href: '/dashboard/addresses', label: 'Saved Addresses', icon: FiMapPin },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass border border-white/10 rounded-2xl p-6">
              {/* User info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-lg font-bold flex-shrink-0">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold truncate">{user.displayName || 'My Account'}</p>
                  <p className="text-gray-400 text-xs truncate">{user.email}</p>
                </div>
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {navItems.map(({ href, label, icon: Icon, exact }) => {
                  const active = exact ? pathname === href : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active ? 'bg-gold/15 text-gold border border-gold/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon size={16} />
                        {label}
                      </span>
                      {active && <FiChevronRight size={14} />}
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 mt-4 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
              >
                <FiLogOut size={16} />
                Sign Out
              </button>
            </div>
          </motion.aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
