# 🥩 EasyMeat UAE – Premium Halal Meat E-Commerce

A luxury, modern, 3D meat e-commerce platform built for the UAE market. Combines the elegance of Apple, Tesla, and Dubai premium brands into a fully-featured online meat delivery shop.

## ✨ Features

### 🏠 Frontend
- **Cinematic 3D Hero** — React Three Fiber / Three.js rotating meat scene with particles
- **Framer Motion** — Smooth page transitions, scroll animations, hover effects
- **Dark Luxury Theme** — Premium Black, Charcoal, Gold color palette
- **Glassmorphism Cards** — Modern glass-effect UI components
- **Fully Responsive** — Mobile-first design for all screen sizes

### 🛒 Shopping
- Product listing with filters (category, price, sort)
- Detailed product pages with gallery, nutrition info, weight selection
- Animated cart drawer with real-time totals
- Cart persistence via Zustand + localStorage
- Free delivery threshold (AED 200)
- VAT calculation (5% UAE VAT)

### 💳 Checkout
- Multi-step checkout form
- UAE city/emirate selection
- Delivery date and time slot selection
- **Cash on Delivery** (primary, default)
- Card / Apple Pay / Google Pay (coming soon stubs)
- Firebase Firestore order storage

### 👤 User Authentication
- Email/Password login & registration
- Google OAuth sign-in
- Forgot password / email reset
- User dashboard with profile, orders, addresses
- Protected routes

### ⚙️ Admin Panel
- Dashboard with stats (orders, revenue, customers)
- Product management (add / edit / delete)
- Order management with status updates
- Customer management with spending overview
- Role-based access (admin role in Firestore)

### 🔍 SEO
- Dynamic metadata per page
- Sitemap.xml generation
- Robots.txt
- UAE market keywords optimized

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
```bash
cp .env.example .env.local
```
Edit `.env.local` with your Firebase project credentials from the [Firebase Console](https://console.firebase.google.com/).

### 3. Set Up Firebase
In the Firebase Console:
- Enable **Authentication** → Email/Password + Google
- Create **Firestore Database** (start in test mode)
- Copy the security rules from `firestore.rules`

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 5. Create Admin User
1. Register a normal account
2. In Firestore Console → `users` → find your UID → set `role: "admin"`
3. Access admin panel at `/admin/dashboard`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   ├── products/             # Product listing
│   ├── product/[id]/         # Product detail
│   ├── cart/                 # Cart page
│   ├── checkout/             # Checkout + success
│   ├── auth/                 # Login, Register, Forgot Password
│   ├── dashboard/            # User dashboard (Profile, Orders, Addresses)
│   └── admin/                # Admin panel (Dashboard, Products, Orders, Customers)
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── home/                 # Hero, Categories, BestSellers, etc.
│   ├── cart/                 # CartDrawer
│   ├── 3d/                   # HeroScene (Three.js)
│   └── ui/                   # WhatsApp button, Promo banner
├── context/
│   ├── AuthContext.tsx        # Firebase Auth context
│   └── cartStore.ts           # Zustand cart state
├── hooks/
│   └── useProducts.ts         # Firestore + mock data fallback
├── lib/
│   ├── firebase.ts            # Firebase init
│   └── data.ts                # Mock product/category data
└── types/
    └── index.ts               # TypeScript interfaces
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--color-gold` | `#D4AF37` | Primary accent, CTAs |
| `--color-black` | `#0A0A0A` | Page background |
| `--color-dark` | `#111827` | Card backgrounds |
| Font Display | Playfair Display | Headings |
| Font Body | Inter | Body text |

CSS classes:
- `.text-gold-gradient` — Gold shimmer text
- `.glass` — Glassmorphism card
- `.btn-gold` — Gold CTA button with shimmer
- `.premium-card` — Hover lift card
- `.halal-badge` — Green halal certification badge

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| 3D Graphics | Three.js / React Three Fiber |
| Backend | Firebase (Auth + Firestore + Storage) |
| State | Zustand |
| Notifications | React Hot Toast |

---

## 🌍 UAE Coverage

Delivery available in all 7 emirates:
Dubai · Abu Dhabi · Sharjah · Ajman · Ras Al Khaimah · Fujairah · Umm Al Quwain

---

## 📱 WhatsApp Integration

WhatsApp order button links to: `https://wa.me/971500000000`
Update the phone number in:
- `src/components/ui/WhatsAppButton.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/home/CTABanner.tsx`

---

## 🚢 Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Vercel (Recommended)
```bash
vercel deploy
```

---

## 📄 License
Built for EasyMeat UAE. All rights reserved.
