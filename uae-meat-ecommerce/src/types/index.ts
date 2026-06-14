export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  weightOptions: WeightOption[];
  images: string[];
  featured: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  nutritionInfo?: NutritionInfo;
  origin?: string;
  tags?: string[];
  createdAt: Date;
}

export interface WeightOption {
  label: string;
  weight: number; // in grams
  price: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  per100g: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  image: string;
  description?: string;
  productCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: WeightOption;
}

export interface Order {
  orderId: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  vat: number;
  total: number;
  paymentMethod: 'COD' | 'CARD';
  status: OrderStatus;
  deliveryAddress: Address;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  quantity: number;
  weight: string;
  price: number;
}

export interface Address {
  id?: string;
  label?: string;
  fullName: string;
  phone: string;
  street: string;
  building?: string;
  area: string;
  city: string;
  emirate: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  addresses?: Address[];
  role?: 'admin' | 'customer';
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
