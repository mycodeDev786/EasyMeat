'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Address } from '@/types';
import toast from 'react-hot-toast';

const UAE_CITIES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

const emptyAddress: Address = { label: '', fullName: '', phone: '', street: '', building: '', area: '', city: 'Dubai', emirate: 'Dubai' };

export default function AddressesPage() {
  const { user, userProfile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Address>(emptyAddress);
  const [saving, setSaving] = useState(false);

  const addresses: Address[] = userProfile?.addresses || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    if (!user || !form.fullName || !form.phone || !form.street || !form.city) {
      toast.error('Please fill required fields'); return;
    }
    setSaving(true);
    try {
      const newAddress = { ...form, id: Date.now().toString() };
      await updateDoc(doc(db, 'users', user.uid), { addresses: arrayUnion(newAddress) });
      toast.success('Address saved!');
      setShowForm(false);
      setForm(emptyAddress);
    } catch {
      toast.error('Failed to save address.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (address: Address) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { addresses: arrayRemove(address) });
      toast.success('Address removed');
    } catch {
      toast.error('Failed to remove address.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-xl">Saved Addresses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 btn-gold px-4 py-2.5 rounded-xl text-sm font-semibold"
        >
          <FiPlus size={15} />
          Add New Address
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="glass border border-gold/20 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-5">New Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'label', label: 'Label (e.g. Home)', placeholder: 'Home / Work / Other' },
                  { name: 'fullName', label: 'Full Name *', placeholder: 'Ahmed Al Mansouri' },
                  { name: 'phone', label: 'Phone *', placeholder: '+971 50 000 0000' },
                  { name: 'street', label: 'Street / Villa *', placeholder: 'Villa 10, Street 5' },
                  { name: 'building', label: 'Building / Apt', placeholder: 'Tower A, Apt 304' },
                  { name: 'area', label: 'Area *', placeholder: 'Jumeirah, Mirdif...' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="text-gray-400 text-xs mb-1 block">{f.label}</label>
                    <input
                      name={f.name}
                      value={form[f.name as keyof Address] as string}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">City *</label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold"
                  >
                    {UAE_CITIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={handleAdd} disabled={saving} className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Address'}
                </button>
                <button onClick={() => setShowForm(false)} className="glass border border-white/10 px-6 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:border-white/30">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {addresses.length === 0 && !showForm ? (
        <div className="glass border border-white/10 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">📍</div>
          <p className="text-gray-300 text-lg font-medium">No saved addresses</p>
          <p className="text-gray-500 text-sm mt-1">Add your delivery addresses for faster checkout</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr, i) => (
            <motion.div
              key={addr.id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass border border-white/10 rounded-2xl p-5 hover:border-gold/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-gold" size={16} />
                  <span className="text-gold text-sm font-semibold">{addr.label || 'Address'}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleDelete(addr)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-white text-sm font-medium">{addr.fullName}</p>
              <p className="text-gray-400 text-xs mt-0.5">{addr.phone}</p>
              <p className="text-gray-400 text-xs mt-1">
                {addr.street}{addr.building ? `, ${addr.building}` : ''}<br />
                {addr.area}, {addr.city}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
