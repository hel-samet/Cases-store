
import React from 'react';
import type { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: Product[];
    onProductClick: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
    return (
        <div className="bg-secondary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <h2 className="text-2xl font-semibold text-gray-700">No products found.</h2>
                            <p className="mt-2 text-gray-500">Try adjusting your search or category filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductGrid;
