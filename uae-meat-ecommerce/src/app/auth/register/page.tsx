'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to LuxeMeat!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success('Account created with Google!');
      router.push('/dashboard');
    } catch {
      toast.error('Google sign-up failed.');
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Ahmed Al Mansouri', Icon: FiUser },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', Icon: FiMail },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+971 50 000 0000', Icon: FiPhone },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-xl">LM</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Join LuxeMeat and enjoy premium halal meat delivery</p>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-8">
          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:border-white/30 text-white py-3 rounded-xl font-medium transition-all mb-6">
            <FcGoogle size={20} />
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, placeholder, Icon }) => (
              <div key={name}>
                <label className="text-gray-400 text-sm mb-1 block">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    name={name} type={type} value={form[name as keyof typeof form]}
                    onChange={handleChange} required placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>
            ))}

            {/* Password fields */}
            {[
              { name: 'password', label: 'Password', placeholder: 'Min. 6 characters' },
              { name: 'confirm', label: 'Confirm Password', placeholder: 'Repeat your password' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="text-gray-400 text-sm mb-1 block">{label}</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    name={name} type={showPwd ? 'text' : 'password'}
                    value={form[name as keyof typeof form]} onChange={handleChange} required
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-colors"
                  />
                  {name === 'password' && (
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading} className="w-full btn-gold py-3.5 rounded-xl font-bold text-base disabled:opacity-50 mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-gold hover:underline font-medium">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
