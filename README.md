# 🥩 EasyMeat UAE – Premium Halal Meat E-Commerce

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
```bash
cp .env.example .env.local
```
Fill in your Firebase credentials from [Firebase Console](https://console.firebase.google.com)

### 3. Firebase Setup
- Enable **Authentication** → Email/Password + Google
- Create **Firestore Database** (test mode)
- Copy rules from `firestore.rules` to Firestore Rules tab

### 4. Run
```bash
npm run dev
```
Open http://localhost:3000

### 5. Create Admin User
1. Register a normal account
2. In Firestore → `users` → find your doc → add field `role: "admin"`
3. Access admin at `/admin/dashboard`

---

## Pages
| Route | Description |
|---|---|
| `/` | Homepage with 3D hero |
| `/products` | Product listing with filters |
| `/product/[id]` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout (Cash on Delivery) |
| `/auth/login` | Login |
| `/auth/register` | Register |
| `/dashboard` | User profile |
| `/dashboard/orders` | Order history |
| `/dashboard/addresses` | Saved addresses |
| `/admin/dashboard` | Admin stats |
| `/admin/products` | Manage products |
| `/admin/orders` | Manage orders |
| `/admin/customers` | View customers |

## Tech Stack
- **Next.js 15** · **React 19** · **TypeScript**
- **Tailwind CSS** · **Framer Motion** · **Three.js / R3F**
- **Firebase** (Auth + Firestore + Storage)
- **Zustand** (cart state)
