import React, { useRef } from 'react';
import type { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
    title: string;
    products: Product[];
    onProductClick: (product: Product) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products, onProductClick }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8; // Scroll by 80% of visible width
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold tracking-tight text-primary mb-6">{title}</h2>
            <div className="relative group">
                {/* Previous Button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow-md hover:bg-white focus:outline-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 hidden md:flex"
                    aria-label="Scroll left"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div
                    ref={scrollContainerRef}
                    className="flex space-x-6 overflow-x-auto pb-4 -mb-4 snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div key={product.id} className="snap-start flex-shrink-0 w-[80%] sm:w-[45%] md:w-[30%] lg:w-[23%]">
                            <ProductCard product={product} onProductClick={onProductClick} />
                        </div>
                    ))}
                </div>
                
                {/* Scrollbar-hide utility class for Tailwind */}
                <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

                {/* Next Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute top-1/2 -right-4 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow-md hover:bg-white focus:outline-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 hidden md:flex"
                    aria-label="Scroll right"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ProductCarousel;