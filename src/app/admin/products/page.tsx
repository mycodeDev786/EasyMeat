'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { categories } from '@/lib/data';
import toast from 'react-hot-toast';

const empty = { name:'', description:'', category:'beef', price:0, stock:0, images:['https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=600'], featured:false, rating:4.5, reviewCount:0, origin:'' };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any|null>(null);
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try { const snap = await getDocs(collection(db,'products')); setProducts(snap.docs.map(d=>({id:d.id,...d.data()}))); }
    finally { setLoading(false); }
  };
  useEffect(()=>{ fetchProducts(); },[]);

  const openAdd = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (p:any) => { setEditing(p); setForm(p); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.name||!form.price) { toast.error('Name and price are required'); return; }
    setSaving(true);
    try {
      if (editing) { await updateDoc(doc(db,'products',editing.id),{...form,updatedAt:serverTimestamp()}); toast.success('Product updated!'); }
      else { await addDoc(collection(db,'products'),{...form,createdAt:serverTimestamp()}); toast.success('Product added!'); }
      closeModal(); fetchProducts();
    } catch { toast.error('Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id:string, name:string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await deleteDoc(doc(db,'products',id)); toast.success('Deleted'); setProducts(p=>p.filter(x=>x.id!==id)); }
    catch { toast.error('Failed to delete.'); }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">{products.length} products in catalog</p>
        </div>
        <button onClick={openAdd} className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold"><FiPlus size={16}/> Add Product</button>
      </div>

      {loading ? <div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"/></div> : (
        <div className="glass border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-white/5">
                {['Product','Category','Price','Stock','Featured','Actions'].map(h=>(
                  <th key={h} className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {products.length===0?(<tr><td colSpan={6} className="text-center py-12 text-gray-500">No products yet. Add your first!</td></tr>)
                :products.map(p=>(
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                          {p.images?.[0]&&<Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px"/>}
                        </div>
                        <span className="text-white text-sm font-medium line-clamp-1 max-w-xs">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-sm capitalize">{p.category}</td>
                    <td className="px-5 py-3 font-semibold text-sm" style={{color:'#D4AF37'}}>AED {p.price}</td>
                    <td className="px-5 py-3 text-gray-300 text-sm">{p.stock}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${p.featured?'bg-yellow-400/20 text-yellow-400 border-yellow-400/30':'bg-white/5 text-gray-500 border-white/10'}`}>
                        {p.featured?'Yes':'No'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={()=>openEdit(p)} className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all"><FiEdit2 size={14}/></button>
                        <button onClick={()=>handleDelete(p.id,p.name)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><FiTrash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50" style={{background:'rgba(0,0,0,0.8)',backdropFilter:'blur(4px)'}} onClick={closeModal}/>
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" style={{background:'#111827'}}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold text-xl">{editing?'Edit Product':'Add Product'}</h2>
                  <button onClick={closeModal} className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-lg"><FiX size={18}/></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{key:'name',label:'Product Name *',type:'text'},{key:'price',label:'Price (AED) *',type:'number'},{key:'stock',label:'Stock Qty',type:'number'},{key:'origin',label:'Origin',type:'text'}].map(({key,label,type})=>(
                    <div key={key}>
                      <label className="text-gray-400 text-xs mb-1 block">{label}</label>
                      <input type={type} value={form[key]} onChange={e=>setForm((p:any)=>({...p,[key]:type==='number'?Number(e.target.value):e.target.value}))} className={inputCls}/>
                    </div>
                  ))}
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Category</label>
                    <select value={form.category} onChange={e=>setForm((p:any)=>({...p,category:e.target.value}))} className={inputCls}>
                      {categories.map(c=><option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <input type="checkbox" id="feat" checked={form.featured} onChange={e=>setForm((p:any)=>({...p,featured:e.target.checked}))} className="w-4 h-4 accent-yellow-400"/>
                    <label htmlFor="feat" className="text-gray-300 text-sm">Featured Product</label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Description</label>
                    <textarea value={form.description} onChange={e=>setForm((p:any)=>({...p,description:e.target.value}))} rows={3} className={`${inputCls} resize-none`}/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Image URL</label>
                    <input type="url" value={form.images?.[0]||''} onChange={e=>setForm((p:any)=>({...p,images:[e.target.value]}))} className={inputCls}/>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={handleSave} disabled={saving} className="btn-gold flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold disabled:opacity-50">
                    <FiSave size={15}/>{saving?'Saving...':'Save Product'}
                  </button>
                  <button onClick={closeModal} className="glass border border-white/10 px-6 py-2.5 rounded-xl text-sm text-gray-300 hover:border-white/30">Cancel</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
