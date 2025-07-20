import React from 'react';
import type { Product, Category } from '../types';
import ProductCarousel from './ProductCarousel';

interface StorefrontProps {
    categories: Category[];
    products: Product[];
    onProductClick: (product: Product) => void;
}

const Storefront: React.FC<StorefrontProps> = ({ categories, products, onProductClick }) => {
    return (
        <div className="bg-secondary">
            {categories.map(category => {
                const categoryProducts = products.filter(p => p.category === category.name);
                if (categoryProducts.length === 0) {
                    return null;
                }
                return (
                    <ProductCarousel
                        key={category.id}
                        title={category.name}
                        products={categoryProducts}
                        onProductClick={onProductClick}
                    />
                );
            })}
        </div>
    );
};

export default Storefront;
