'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Fetch order counts
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const orders = ordersSnap.docs.map(d => d.data());
        const orderCounts: Record<string, { count: number; total: number }> = {};
        orders.forEach((o: any) => {
          if (!orderCounts[o.userId]) orderCounts[o.userId] = { count: 0, total: 0 };
          orderCounts[o.userId].count++;
          orderCounts[o.userId].total += o.total || 0;
        });

        setCustomers(users.map((u: any) => ({
          ...u,
          orderCount: orderCounts[u.uid]?.count || 0,
          totalSpent: orderCounts[u.uid]?.total || 0,
        })));
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Customers</h1>
        <p className="text-gray-400 mt-1">{customers.length} registered customers</p>
      </div>

      <input
        type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold w-72 mb-6"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Customer', 'Phone', 'Role', 'Orders', 'Total Spent', 'Joined'].map(h => (
                  <th key={h} className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">No customers found</td></tr>
              ) : filtered.map((customer, i) => (
                <tr key={customer.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 ? 'bg-white/1' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-sm font-bold flex-shrink-0">
                        {(customer.name || customer.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{customer.name || 'No name'}</p>
                        <p className="text-gray-500 text-xs">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-sm">{customer.phone || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      customer.role === 'admin'
                        ? 'text-gold bg-gold/10 border-gold/20'
                        : 'text-gray-400 bg-white/5 border-white/10'
                    }`}>
                      {customer.role || 'customer'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-300 text-sm font-semibold">{customer.orderCount}</td>
                  <td className="px-5 py-3 text-gold font-bold text-sm">AED {customer.totalSpent.toFixed(0)}</td>
                  <td className="px-5 py-3 text-gray-400 text-sm">
                    {customer.createdAt?.toDate
                      ? customer.createdAt.toDate().toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
