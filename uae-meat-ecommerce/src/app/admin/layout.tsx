'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiGrid, FiPackage, FiUsers, FiShoppingBag, FiLogOut, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { href: '/admin/products', label: 'Products', icon: FiShoppingBag },
  { href: '/admin/orders', label: 'Orders', icon: FiPackage },
  { href: '/admin/customers', label: 'Customers', icon: FiUsers },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) { router.push('/auth/login'); return; }
      if (userProfile && userProfile.role !== 'admin') { router.push('/'); toast.error('Access denied.'); }
    }
  }, [user, userProfile, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-black-deep border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-black font-bold text-sm">LM</span>
            </div>
            <span className="font-display text-lg font-bold text-white">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-gold/15 text-gold border border-gold/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3"><Icon size={16} />{label}</span>
                {active && <FiChevronRight size={13} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-sm font-bold">
              A
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.displayName || 'Admin'}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <FiLogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
