'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

const STATUS: Record<string,{label:string;color:string;bg:string;icon:string}> = {
  pending:          {label:'Pending',         color:'text-yellow-400', bg:'bg-yellow-400/10 border-yellow-400/20', icon:'⏳'},
  confirmed:        {label:'Confirmed',        color:'text-blue-400',   bg:'bg-blue-400/10 border-blue-400/20',   icon:'✅'},
  processing:       {label:'Processing',       color:'text-purple-400', bg:'bg-purple-400/10 border-purple-400/20',icon:'🔪'},
  out_for_delivery: {label:'Out for Delivery', color:'text-yellow-400', bg:'bg-yellow-400/10 border-yellow-400/20',icon:'🚚'},
  delivered:        {label:'Delivered',        color:'text-green-400',  bg:'bg-green-400/10 border-green-400/20', icon:'🎉'},
  cancelled:        {label:'Cancelled',        color:'text-red-400',    bg:'bg-red-400/10 border-red-400/20',     icon:'❌'},
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string|null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const q = query(collection(db,'orders'), where('userId','==',user.uid), orderBy('createdAt','desc'));
        const snap = await getDocs(q);
        setOrders(snap.docs.map(d=>({...d.data(),id:d.id})));
      } catch(e){ console.error(e); }
      finally { setLoading(false); }
    })();
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"/></div>;

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
      <h2 className="text-white font-bold text-xl mb-6">My Orders</h2>
      {orders.length===0 ? (
        <div className="glass border border-white/10 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-300 text-lg font-medium">No orders yet</p>
          <p className="text-gray-500 text-sm mt-1">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order:any) => {
            const st = STATUS[order.status]||STATUS.pending;
            const isOpen = expanded===order.orderId;
            const statuses = ['pending','confirmed','processing','out_for_delivery','delivered'];
            const curIdx = statuses.indexOf(order.status);
            return (
              <div key={order.orderId||order.id} className="glass border border-white/10 rounded-2xl overflow-hidden">
                <button onClick={()=>setExpanded(isOpen?null:order.orderId)}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/3 transition-colors text-left">
                  <div>
                    <p className="text-white font-semibold text-sm font-mono">{order.orderId||order.id}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {order.createdAt?.toDate?order.createdAt.toDate().toLocaleDateString('en-AE',{day:'numeric',month:'short',year:'numeric'}):'—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${st.bg} ${st.color}`}>{st.icon} {st.label}</span>
                    <span className="font-bold" style={{color:'#D4AF37'}}>AED {order.total?.toFixed(0)}</span>
                    <span className={`text-gray-400 transition-transform duration-200 ${isOpen?'rotate-180':''}`}>▼</span>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-white/5 p-5">
                    {/* Progress */}
                    <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
                      {statuses.map((key,i)=>{
                        const s = STATUS[key]; const done = i<=curIdx;
                        return (
                          <div key={key} className="flex items-center gap-1 flex-shrink-0">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border ${done?'border-yellow-400 text-yellow-400':'border-white/20 text-gray-600'}`} style={done?{background:'rgba(212,175,55,0.2)'}:{}}>{s.icon}</div>
                            <span className={`text-xs whitespace-nowrap ${done?'text-yellow-400':'text-gray-600'}`}>{s.label}</span>
                            {i<statuses.length-1 && <div className={`w-5 h-px ${done?'bg-yellow-400':'bg-white/10'}`}/>}
                          </div>
                        );
                      })}
                    </div>
                    {/* Items */}
                    <div className="space-y-3 mb-4">
                      {order.items?.map((item:any,i:number)=>(
                        <div key={i} className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            <Image src={item.image} alt={item.productName} fill className="object-cover"/>
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{item.productName}</p>
                            <p className="text-gray-500 text-xs">{item.weight} × {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-sm" style={{color:'#D4AF37'}}>AED {(item.price*item.quantity).toFixed(0)}</p>
                        </div>
                      ))}
                    </div>
                    {/* Totals */}
                    <div className="border-t border-white/5 pt-3 space-y-1 text-sm">
                      <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>AED {order.subtotal?.toFixed(0)}</span></div>
                      <div className="flex justify-between text-gray-400"><span>Delivery</span><span>{order.deliveryFee===0?'Free':`AED ${order.deliveryFee}`}</span></div>
                      <div className="flex justify-between text-gray-400"><span>VAT</span><span>AED {order.vat?.toFixed(0)}</span></div>
                      <div className="flex justify-between font-bold text-base border-t border-white/5 pt-2">
                        <span className="text-white">Total</span><span style={{color:'#D4AF37'}}>AED {order.total?.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-gray-400 pt-1">
                        <span>Payment</span><span className="text-green-400">💵 {order.paymentMethod==='COD'?'Cash on Delivery':order.paymentMethod}</span>
                      </div>
                    </div>
                    {order.deliveryAddress && (
                      <div className="mt-3 p-3 rounded-xl text-xs text-gray-400" style={{background:'rgba(255,255,255,0.03)'}}>
                        <p className="font-medium text-gray-300 mb-0.5">Delivery Address</p>
                        <p>{order.deliveryAddress.fullName} · {order.deliveryAddress.phone}</p>
                        <p>{order.deliveryAddress.street}{order.deliveryAddress.building?`, ${order.deliveryAddress.building}`:''}, {order.deliveryAddress.area}, {order.deliveryAddress.city}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
