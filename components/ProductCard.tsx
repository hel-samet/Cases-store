import React from 'react';
import type { Product } from '../types';
import RatingStars from './RatingStars';

interface ProductCardProps {
    product: Product;
    onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
    return (
        <div 
            onClick={() => onProductClick(product)}
            className="group relative flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
        >
            <div className="aspect-[3/2] w-full overflow-hidden bg-gray-200">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-center object-cover group-hover:opacity-80 transition-opacity duration-300"
                />
            </div>
            <div className="flex-1 p-4 flex flex-col">
                <h3 className="text-sm font-medium text-gray-500">{product.category}</h3>
                <h4 className="mt-1 text-lg font-semibold text-primary group-hover:text-accent transition-colors">
                    {product.name}
                </h4>
                <div className="mt-2 flex items-center">
                    <RatingStars rating={product.rating} />
                    <span className="ml-2 text-xs text-gray-400">({product.reviews} reviews)</span>
                </div>
                <div className="flex-1 flex items-end">
                    <p className="mt-4 text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="absolute top-0 right-0 m-2 p-2 bg-black/40 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
};

export default ProductCard;