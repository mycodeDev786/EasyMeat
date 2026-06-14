import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import PromoBanner from '@/components/ui/PromoBanner';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: { default: 'LuxeMeat UAE – Premium Halal Meat Delivery', template: '%s | LuxeMeat UAE' },
  description: 'Premium halal meat delivered fresh across UAE. Same-day delivery in Dubai, Abu Dhabi, Sharjah and all emirates.',
  keywords: ['fresh meat UAE','halal meat Dubai','online meat delivery Dubai','premium beef UAE','Wagyu UAE'],
  openGraph: {
    title: 'LuxeMeat UAE – Premium Halal Meat Delivery',
    description: 'Farm Fresh • Expertly Cut • Delivered To Your Doorstep',
    url: 'https://luxemeat.ae',
    siteName: 'LuxeMeat UAE',
    locale: 'en_AE',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <PromoBanner />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1F2937',
                color: '#FFFFFF',
                border: '1px solid rgba(212,175,55,0.3)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
