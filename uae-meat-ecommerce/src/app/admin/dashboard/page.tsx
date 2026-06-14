'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Stats { totalOrders: number; totalRevenue: number; totalCustomers: number; pendingOrders: number; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalRevenue: 0, totalCustomers: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersSnap, usersSnap, pendingSnap] = await Promise.all([
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'users')),
          getDocs(query(collection(db, 'orders'), where('status', '==', 'pending'))),
        ]);

        const orders = ordersSnap.docs.map(d => d.data());
        const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

        setStats({
          totalOrders: ordersSnap.size,
          totalRevenue: revenue,
          totalCustomers: usersSnap.size,
          pendingOrders: pendingSnap.size,
        });

        // Recent orders
        const recent = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(10)));
        setRecentOrders(recent.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'from-blue-500/20 to-blue-900/10', border: 'border-blue-500/20' },
    { label: 'Total Revenue', value: `AED ${stats.totalRevenue.toFixed(0)}`, icon: '💰', color: 'from-gold/20 to-yellow-900/10', border: 'border-gold/20' },
    { label: 'Customers', value: stats.totalCustomers, icon: '👥', color: 'from-purple-500/20 to-purple-900/10', border: 'border-purple-500/20' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: 'from-orange-500/20 to-orange-900/10', border: 'border-orange-500/20' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    confirmed: 'text-blue-400 bg-blue-400/10',
    processing: 'text-purple-400 bg-purple-400/10',
    out_for_delivery: 'text-gold bg-gold/10',
    delivered: 'text-green-400 bg-green-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-5`}
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            <p className="text-2xl font-bold text-white">{loading ? '—' : card.value}</p>
            <p className="text-gray-400 text-sm mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-white font-bold text-lg mb-4">Recent Orders</h2>
        <div className="glass border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order ID', 'Customer', 'Total', 'Status', 'Date', 'Payment'].map(h => (
                    <th key={h} className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading orders...</td></tr>
                ) : recentOrders.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">No orders yet</td></tr>
                ) : (
                  recentOrders.map((order, i) => (
                    <tr key={order.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? '' : 'bg-white/1'}`}>
                      <td className="px-5 py-3 text-gold text-sm font-mono">{order.orderId}</td>
                      <td className="px-5 py-3 text-gray-300 text-sm">{order.deliveryAddress?.fullName || '—'}</td>
                      <td className="px-5 py-3 text-white text-sm font-semibold">AED {order.total?.toFixed(0)}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || 'text-gray-400 bg-gray-400/10'}`}>
                          {order.status?.replace(/_/g, ' ') || 'pending'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-sm">
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-AE') : '—'}
                      </td>
                      <td className="px-5 py-3 text-green-400 text-sm">
                        {order.paymentMethod === 'COD' ? '💵 COD' : order.paymentMethod}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
