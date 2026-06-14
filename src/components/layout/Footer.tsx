import Link from 'next/link';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={{background:'#111827'}} className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg,#D4AF37,#E8C84B,#B8931E)'}}>
                <span className="text-black font-bold text-sm">LM</span>
              </div>
              <span className="font-serif text-xl font-bold text-white">Easy<span className="text-gold-gradient">Meat</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">Premium halal meat delivered fresh across the UAE. Farm fresh, expertly cut, delivered to your doorstep.</p>
            <div className="mb-4"><span className="halal-badge">100% Halal Certified</span></div>
            <div className="flex gap-3">
              {[FiInstagram, FiFacebook, FiTwitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full glass flex items-center justify-center text-gray-400 hover:text-yellow-400 transition-colors"><Icon size={16} /></a>
              ))}
              <a href="https://wa.me/971500000000" className="w-9 h-9 rounded-full glass flex items-center justify-center text-gray-400 hover:text-green-400 transition-colors"><FaWhatsapp size={16} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[{href:'/products',l:'Shop All'},{href:'/products?category=wagyu',l:'Wagyu'},{href:'/products?category=beef',l:'Premium Beef'},{href:'/products?category=bbq',l:'BBQ Specials'},{href:'/products?category=family',l:'Family Packs'}].map(x => (
                <li key={x.href}><Link href={x.href} className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">{x.l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              {[{href:'/auth/login',l:'Login'},{href:'/auth/register',l:'Register'},{href:'/dashboard/orders',l:'Track Order'},{href:'/dashboard',l:'My Profile'},{href:'/dashboard/addresses',l:'My Addresses'}].map(x => (
                <li key={x.l}><Link href={x.href} className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">{x.l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-2.5 text-sm text-gray-400">
              <p>📞 <a href="tel:+971800000000" className="hover:text-yellow-400">+971 800 000 000</a></p>
              <p>💬 <a href="https://wa.me/971500000000" className="hover:text-green-400">WhatsApp Order</a></p>
              <p>✉️ <a href="mailto:hello@EasyMeat.ae" className="hover:text-yellow-400">hello@EasyMeat.ae</a></p>
              <p>🕐 Daily: 8:00 AM – 11:00 PM</p>
              <p>📍 Dubai, UAE</p>
            </div>
            <div className="mt-4 p-3 glass rounded-lg">
              <p className="text-xs text-gray-400 font-medium">🚚 Free Delivery</p>
              <p className="text-xs text-yellow-400">On orders above AED 200</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5">
          <p className="text-center text-gray-500 text-sm mb-3">Delivering across all UAE Emirates</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain'].map(c => (
              <span key={c} className="text-xs text-yellow-400/70 bg-yellow-400/5 border border-yellow-400/10 rounded-full px-3 py-1">{c}</span>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} EasyMeat UAE. All rights reserved.</p>
          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <span>🔒 Secure Checkout</span>
            <span>✅ 100% Halal</span>
            <span>❄️ Cold Chain Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
