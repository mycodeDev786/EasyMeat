'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({totalOrders:0,totalRevenue:0,totalCustomers:0,pendingOrders:0});
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      try {
        const [ordersSnap,usersSnap,pendingSnap] = await Promise.all([
          getDocs(collection(db,'orders')),
          getDocs(collection(db,'users')),
          getDocs(query(collection(db,'orders'),where('status','==','pending'))),
        ]);
        const orders = ordersSnap.docs.map(d=>d.data());
        setStats({ totalOrders:ordersSnap.size, totalRevenue:orders.reduce((s:number,o:any)=>s+(o.total||0),0), totalCustomers:usersSnap.size, pendingOrders:pendingSnap.size });
        const recent = await getDocs(query(collection(db,'orders'),orderBy('createdAt','desc'),limit(10)));
        setRecentOrders(recent.docs.map(d=>({id:d.id,...d.data()})));
      } catch(e){console.error(e);}
      finally{setLoading(false);}
    })();
  },[]);

  const statCards = [
    {label:'Total Orders',value:stats.totalOrders,icon:'📦',from:'from-blue-500/20',border:'border-blue-500/20'},
    {label:'Total Revenue',value:`AED ${stats.totalRevenue.toFixed(0)}`,icon:'💰',from:'from-yellow-500/20',border:'border-yellow-500/20'},
    {label:'Customers',value:stats.totalCustomers,icon:'👥',from:'from-purple-500/20',border:'border-purple-500/20'},
    {label:'Pending Orders',value:stats.pendingOrders,icon:'⏳',from:'from-orange-500/20',border:'border-orange-500/20'},
  ];

  const statusColors: Record<string,string> = {
    pending:'text-yellow-400 bg-yellow-400/10', confirmed:'text-blue-400 bg-blue-400/10',
    processing:'text-purple-400 bg-purple-400/10', out_for_delivery:'text-yellow-400 bg-yellow-400/10',
    delivered:'text-green-400 bg-green-400/10', cancelled:'text-red-400 bg-red-400/10',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400">Welcome back, Admin. Here's what's happening.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((c,i)=>(
          <motion.div key={c.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
            className={`bg-gradient-to-br ${c.from} to-transparent border ${c.border} rounded-2xl p-5`}>
            <div className="text-3xl mb-3">{c.icon}</div>
            <p className="text-2xl font-bold text-white">{loading?'—':c.value}</p>
            <p className="text-gray-400 text-sm mt-0.5">{c.label}</p>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}>
        <h2 className="text-white font-bold text-lg mb-4">Recent Orders</h2>
        <div className="glass border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order ID','Customer','Total','Status','Date','Payment'].map(h=>(
                    <th key={h} className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading?(<tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td></tr>)
                :recentOrders.length===0?(<tr><td colSpan={6} className="text-center py-8 text-gray-500">No orders yet</td></tr>)
                :recentOrders.map((o,i)=>(
                  <tr key={o.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i%2?'bg-white/1':''}`}>
                    <td className="px-5 py-3 font-mono text-sm" style={{color:'#D4AF37'}}>{o.orderId||o.id?.slice(0,8)}</td>
                    <td className="px-5 py-3 text-gray-300 text-sm">{o.deliveryAddress?.fullName||'Guest'}</td>
                    <td className="px-5 py-3 text-white text-sm font-semibold">AED {o.total?.toFixed(0)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[o.status]||'text-gray-400 bg-gray-400/10'}`}>
                        {(o.status||'pending').replace(/_/g,' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-sm">{o.createdAt?.toDate?o.createdAt.toDate().toLocaleDateString('en-AE'):'—'}</td>
                    <td className="px-5 py-3 text-green-400 text-sm">💵 {o.paymentMethod||'COD'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
