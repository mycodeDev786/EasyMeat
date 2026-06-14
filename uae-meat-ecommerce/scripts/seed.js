/**
 * Firebase Seed Script
 * Run this ONCE to populate your Firestore with sample products and categories.
 *
 * Usage:
 *   1. Make sure .env.local is configured with your Firebase credentials
 *   2. npm install firebase-admin
 *   3. node scripts/seed.js
 *
 * OR use the Firebase Console to manually add data from src/lib/data.ts
 */

// This script is for reference. To seed the database:
// 1. Go to Firebase Console > Firestore Database
// 2. Create a collection called "products"
// 3. Add documents based on the data in src/lib/data.ts
//
// Alternatively, the app automatically uses mock data from src/lib/data.ts
// as a fallback when Firestore is empty.

const sampleProducts = [
  {
    name: "Premium Ribeye Steak",
    description: "Hand-selected, grain-fed ribeye steak with exceptional marbling.",
    category: "beef",
    price: 89,
    stock: 50,
    weightOptions: [
      { label: "500g", weight: 500, price: 89 },
      { label: "1kg", weight: 1000, price: 169 },
    ],
    images: ["https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=600"],
    featured: true,
    rating: 4.9,
    reviewCount: 128,
    origin: "Australia",
  },
  // Add more products here...
];

console.log("Seed data reference - see src/lib/data.ts for full product list");
console.log("The app uses mock data as fallback when Firestore is empty.");
