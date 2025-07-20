
import type { StoreData } from '../types';

export const storeData: StoreData = {
  storeName: 'Aura Living',
  hero: {
    title: 'Express Yourself, Uniquely',
    subtitle: 'Discover high-quality, artist-designed gear that tells your story.',
    ctaText: 'Shop All Collections',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1920&auto=format&fit=crop',
  },
  categories: [
    { 
      id: 'cat-phone-cases', 
      name: 'Phone Cases',
      subcategories: [
        { id: 'sub-iphone', name: 'iPhone Cases' },
        { id: 'sub-samsung', name: 'Samsung Cases' },
        { id: 'sub-pixel', name: 'Google Pixel Cases' },
      ]
    },
    { 
      id: 'cat-posters', 
      name: 'Posters',
      subcategories: [
        { id: 'sub-movie', name: 'Movie Posters' },
        { id: 'sub-art-prints', name: 'Art Prints' },
        { id: 'sub-typography', name: 'Typography' },
      ]
    },
    { 
      id: 'cat-stickers', 
      name: 'Stickers',
      subcategories: [
        { id: 'sub-laptop', name: 'Laptop Stickers' },
        { id: 'sub-vinyl', name: 'Vinyl Decals' },
      ]
    },
    { 
      id: 'cat-bags', 
      name: 'Bags',
      subcategories: [
        { id: 'sub-tote', name: 'Tote Bags' },
        { id: 'sub-backpack', name: 'Backpacks' },
      ]
    },
    { 
      id: 'cat-mugs', 
      name: 'Mugs',
      subcategories: [
        { id: 'sub-ceramic', name: 'Ceramic Mugs' },
        { id: 'sub-travel', name: 'Travel Mugs' },
      ]
    },
    { 
      id: 'cat-t-shirts', 
      name: 'T-Shirts',
      subcategories: [
        { id: 'sub-graphic', name: 'Graphic Tees' },
        { id: 'sub-plain', name: 'Plain Tees' },
      ]
    },
  ],
  products: [
    // Phone Cases
    {
      id: 'prod-ph-001',
      name: 'Abstract Wave iPhone Case',
      description: 'Protect your iPhone with this durable case featuring a vibrant, abstract wave design.',
      price: 25,
      category: 'Phone Cases',
      subcategory: 'iPhone Cases',
      rating: 4.8,
      reviews: 152,
      imageUrl: 'https://images.unsplash.com/photo-1598335614889-a29910427e57?q=80&w=600&h=800&auto=format&fit=crop',
      subImageUrls: [],
    },
    {
      id: 'prod-ph-002',
      name: 'Matte Black Samsung Case',
      description: 'A sleek, minimalist matte black case for your Samsung Galaxy device. Provides a premium feel and solid protection.',
      price: 22,
      category: 'Phone Cases',
      subcategory: 'Samsung Cases',
      rating: 4.9,
      reviews: 210,
      imageUrl: 'https://images.unsplash.com/photo-1610792516307-ea2acd0a224a?q=80&w=600&h=800&auto=format&fit=crop',
      subImageUrls: [],
    },
    // Posters
    {
      id: 'prod-po-001',
      name: 'Retro "The Getaway" Movie Poster',
      description: 'A stylized, high-quality print of a retro-themed movie poster. Perfect for film buffs.',
      price: 18,
      category: 'Posters',
      subcategory: 'Movie Posters',
      rating: 4.7,
      reviews: 88,
      imageUrl: 'https://images.unsplash.com/photo-1533632359083-04254233e2a9?q=80&w=600&h=800&auto=format&fit=crop',
      subImageUrls: [],
    },
    {
      id: 'prod-po-002',
      name: 'Minimalist Mountain Art Print',
      description: 'A beautiful and calming art print featuring a minimalist mountain range. Printed on archival-quality paper.',
      price: 20,
      category: 'Posters',
      subcategory: 'Art Prints',
      rating: 4.9,
      reviews: 120,
      imageUrl: 'https://images.unsplash.com/photo-1506363329833-c40b78f0447f?q=80&w=600&h=800&auto=format&fit=crop',
      subImageUrls: [],
    },
    // Stickers
    {
      id: 'prod-st-001',
      name: 'Developer Laptop Sticker Pack',
      description: 'A pack of 10 high-quality vinyl stickers for developers. Show off your love for code!',
      price: 12,
      category: 'Stickers',
      subcategory: 'Laptop Stickers',
      rating: 4.9,
      reviews: 430,
      imageUrl: 'https://images.unsplash.com/photo-1522252234503-e3565324585b?q=80&w=600&h=600&auto=format&fit=crop',
      subImageUrls: [],
    },
    // Bags
    {
      id: 'prod-ba-001',
      name: 'Canvas Market Tote Bag',
      description: 'A durable and stylish canvas tote bag with reinforced handles. Perfect for groceries, books, or everyday use.',
      price: 28,
      category: 'Bags',
      subcategory: 'Tote Bags',
      rating: 4.8,
      reviews: 205,
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&h=600&auto=format&fit=crop',
      subImageUrls: [],
    },
    // Mugs
    {
      id: 'prod-mu-001',
      name: 'Classic White Ceramic Mug',
      description: 'A timeless 12oz ceramic mug, perfect for your morning coffee or tea. Microwave and dishwasher safe.',
      price: 15,
      category: 'Mugs',
      subcategory: 'Ceramic Mugs',
      rating: 4.9,
      reviews: 512,
      imageUrl: 'https://images.unsplash.com/photo-1594394629938-a155502094c0?q=80&w=600&h=600&auto=format&fit=crop',
      subImageUrls: [],
    },
    // T-Shirts
    {
      id: 'prod-ts-001',
      name: '"Explore More" Graphic Tee',
      description: 'A super-soft cotton graphic tee with a vintage-inspired "Explore More" print. Unisex fit.',
      price: 30,
      category: 'T-Shirts',
      subcategory: 'Graphic Tees',
      rating: 4.7,
      reviews: 189,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&h=600&auto=format&fit=crop',
      subImageUrls: [],
    },
  ],
  users: [],
};
