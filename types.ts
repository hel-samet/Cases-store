
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  subImageUrls: string[];
}

export interface Category {
  id: string;
  name: string;
  subcategories?: {
    id: string;
    name: string;
  }[];
}

export interface User {
  id: string;
  email: string;
  password: string; // In a real app, this would be a hash
  role?: 'superadmin' | 'admin';
}

export interface HeroData {
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
}

export interface StoreData {
  storeName: string;
  hero: HeroData;
  categories: Category[];
  products: Product[];
  users: User[];
}

export interface CartItem extends Product {
  quantity: number;
}