'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

const STATUSES = ['pending','confirmed','processing','out_for_delivery','delivered','cancelled'];
const STATUS_STYLES: Record<string,string> = {
  pending:'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', confirmed:'text-blue-400 bg-blue-400/10 border-blue-400/20',
  processing:'text-purple-400 bg-purple-400/10 border-purple-400/20', out_for_delivery:'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  delivered:'text-green-400 bg-green-400/10 border-green-400/20', cancelled:'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try { const q = query(collection(db,'orders'),orderBy('createdAt','desc')); const snap = await getDocs(q); setOrders(snap.docs.map(d=>({id:d.id,...d.data()}))); }
    finally { setLoading(false); }
  };
  useEffect(()=>{ fetchOrders(); },[]);

  const handleStatusChange = async (orderId:string, docId:string, newStatus:string) => {
    try {
      await updateDoc(doc(db,'orders',docId),{status:newStatus,updatedAt:new Date()});
      setOrders(p=>p.map(o=>o.id===docId?{...o,status:newStatus}:o));
      toast.success(`Order updated → ${newStatus.replace(/_/g,' ')}`);
    } catch { toast.error('Failed to update.'); }
  };

  const filtered = orders
    .filter(o=>filterStatus==='all'||o.status===filterStatus)
    .filter(o=>!search||o.orderId?.toLowerCase().includes(search.toLowerCase())||o.deliveryAddress?.fullName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-serif text-3xl font-bold text-white">Orders</h1><p className="text-gray-400 mt-1">{orders.length} total orders</p></div>
        <button onClick={fetchOrders} className="glass border border-white/10 text-gray-300 px-4 py-2.5 rounded-xl text-sm hover:border-yellow-400/40 transition-all">↻ Refresh</button>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search order ID or name..."
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-400 w-64"/>
        <div className="flex flex-wrap gap-2">
          {['all',...STATUSES].map(s=>(
            <button key={s} onClick={()=>setFilterStatus(s)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${filterStatus===s?'bg-yellow-400/15 text-yellow-400 border-yellow-400/30':'border-white/10 text-gray-400 hover:border-yellow-400/30'}`}>
              {s==='all'?'All':s.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>
      {loading?<div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"/></div>:(
        <div className="glass border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-white/5">
                {['Order ID','Customer','Items','Total','Payment','Date','Status','Update'].map(h=>(
                  <th key={h} className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.length===0?(<tr><td colSpan={8} className="text-center py-12 text-gray-500">No orders found</td></tr>)
                :filtered.map((o,i)=>(
                  <tr key={o.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i%2?'bg-white/1':''}`}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold" style={{color:'#D4AF37'}}>{o.orderId||o.id?.slice(0,8)}</td>
                    <td className="px-4 py-3"><p className="text-white text-sm">{o.deliveryAddress?.fullName||'Guest'}</p><p className="text-gray-500 text-xs">{o.deliveryAddress?.city}</p></td>
                    <td className="px-4 py-3 text-gray-300 text-sm">{o.items?.length||0} items</td>
                    <td className="px-4 py-3 text-white font-bold text-sm">AED {o.total?.toFixed(0)}</td>
                    <td className="px-4 py-3 text-green-400 text-xs">💵 {o.paymentMethod||'COD'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{o.createdAt?.toDate?o.createdAt.toDate().toLocaleDateString('en-AE'):'—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[o.status]||STATUS_STYLES.pending}`}>
                        {(o.status||'pending').replace(/_/g,' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={o.status||'pending'} onChange={e=>handleStatusChange(o.orderId,o.id,e.target.value)}
                        className="bg-white/5 border border-white/10 text-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-yellow-400">
                        {STATUSES.map(s=><option key={s} value={s} className="bg-gray-900">{s.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
