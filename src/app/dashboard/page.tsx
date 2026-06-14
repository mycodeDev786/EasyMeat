'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave } from 'react-icons/fi';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, userProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', email:'' });

  useEffect(() => {
    setForm({ name:userProfile?.name||user?.displayName||'', phone:userProfile?.phone||'', email:user?.email||'' });
  }, [user, userProfile]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try { await updateDoc(doc(db,'users',user.uid),{ name:form.name, phone:form.phone }); toast.success('Profile updated!'); setEditing(false); }
    catch { toast.error('Failed to update profile.'); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
      <div className="glass border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">My Profile</h2>
          <button onClick={()=>editing?handleSave():setEditing(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${editing?'btn-gold':'glass border border-white/10 text-gray-300 hover:border-yellow-400/40'}`}>
            {editing ? <><FiSave size={14}/>{loading?'Saving...':'Save Changes'}</> : <><FiEdit2 size={14}/>Edit Profile</>}
          </button>
        </div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold" style={{background:'rgba(212,175,55,0.2)',border:'2px solid rgba(212,175,55,0.3)',color:'#D4AF37'}}>
            {(form.name||'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-bold text-lg">{form.name||'My Account'}</p>
            <p className="text-gray-400 text-sm">{form.email}</p>
            <span className="halal-badge mt-1 inline-block">Verified Customer</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[{label:'Full Name',key:'name',type:'text',ph:'Your full name'},{label:'Phone Number',key:'phone',type:'tel',ph:'+971 50 000 0000'}].map(f=>(
            <div key={f.key}>
              <label className="text-gray-400 text-sm mb-1 block">{f.label}</label>
              <input type={f.type} value={form[f.key as keyof typeof form]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} disabled={!editing} placeholder={f.ph} className={inputCls}/>
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="text-gray-400 text-sm mb-1 block">Email Address</label>
            <input type="email" value={form.email} disabled className={inputCls}/>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{label:'Total Orders',value:'—',icon:'📦'},{label:'Saved Addresses',value:userProfile?.addresses?.length||0,icon:'📍'},{label:'Member Since',value:new Date().getFullYear(),icon:'🗓️'}].map(s=>(
          <div key={s.label} className="glass border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-white font-bold text-xl">{s.value}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
