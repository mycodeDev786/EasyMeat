'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await login(email, password); toast.success('Welcome back!'); router.push('/dashboard'); }
    catch { toast.error('Invalid email or password.'); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    try { await loginWithGoogle(); toast.success('Logged in!'); router.push('/dashboard'); }
    catch { toast.error('Google login failed.'); }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20" style={{background:'#0A0A0A'}}>
      <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:'linear-gradient(135deg,#D4AF37,#E8C84B,#B8931E)'}}>
            <span className="text-black font-bold text-xl">LM</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to your EasyMeat account</p>
        </div>
        <div className="glass border border-white/10 rounded-2xl p-8">
          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:border-white/30 text-white py-3 rounded-xl font-medium transition-all mb-6">
            <FcGoogle size={20}/> Continue with Google
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10"/>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10"/>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" className={`${inputCls} pl-11 pr-4`}/>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                <input type={showPwd?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" className={`${inputCls} pl-11 pr-12`}/>
                <button type="button" onClick={()=>setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPwd?<FiEyeOff size={16}/>:<FiEye size={16}/>}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-yellow-400 text-sm hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-gold py-3.5 rounded-xl font-bold text-base disabled:opacity-50">
              {loading?'Signing In...':'Sign In'}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account? <Link href="/auth/register" className="text-yellow-400 hover:underline font-medium">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
