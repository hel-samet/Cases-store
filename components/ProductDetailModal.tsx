import React, { useState } from 'react';
import type { Product } from '../types';
import RatingStars from './RatingStars';

interface ProductDetailModalProps {
    product: Product;
    onClose: () => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [activeImageUrl, setActiveImageUrl] = useState(product.imageUrl);

    const allImages = [product.imageUrl, ...(product.subImageUrls || [])].filter(Boolean);

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    const handleAddToCartClick = () => {
        onAddToCart(product, quantity);
    };

    const pageUrl = window.location.origin + window.location.pathname;
    const shareText = `Check out this amazing product: ${product.name}`;

    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Image Gallery */}
                <div className="w-full md:w-1/2 flex flex-col bg-gray-50">
                    <div className="flex-grow w-full h-full p-4">
                        <img src={activeImageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg shadow-inner" />
                    </div>
                    {allImages.length > 1 && (
                        <div className="flex-shrink-0 p-4">
                            <div className="flex justify-center space-x-3">
                                {allImages.map((imgUrl, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageUrl(imgUrl)}
                                        className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${imgUrl === activeImageUrl ? 'border-accent shadow-md' : 'border-transparent hover:border-gray-400'}`}
                                    >
                                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-start">
                         <h2 className="text-2xl md:text-3xl font-bold text-primary">{product.name}</h2>
                         <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                         </button>
                    </div>
                   
                    <p className="mt-2 text-sm text-gray-500">{product.category}</p>
                    <div className="mt-4 flex items-center">
                        <RatingStars rating={product.rating} />
                        <span className="ml-3 text-sm text-gray-500">{product.rating.toFixed(1)} ({product.reviews} reviews)</span>
                    </div>

                    <p className="mt-4 text-3xl font-extrabold text-primary">${product.price.toFixed(2)}</p>

                    <p className="mt-6 text-base text-gray-700 leading-relaxed flex-grow">
                        {product.description}
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100 rounded-l-md">-</button>
                            <span className="px-4 py-2 font-semibold">{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)} className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100 rounded-r-md">+</button>
                        </div>
                        <button 
                            onClick={handleAddToCartClick}
                            className="flex-1 bg-accent text-white font-bold py-3 px-6 rounded-md hover:bg-accent-hover transition-colors duration-300"
                        >
                            Add to Cart
                        </button>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-medium text-gray-700 text-center mb-3">Share this product</h3>
                        <div className="flex items-center justify-center space-x-4">
                             <a
                                href={facebookShareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1877F2] hover:bg-[#166fe5] transition-colors"
                                aria-label="Share on Facebook"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                                Facebook
                            </a>
                             <a
                                href={telegramShareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#26A5E4] hover:bg-[#2295cf] transition-colors"
                                aria-label="Share on Telegram"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9.5,7.5l8.5,4L15.5,14l-4.5,1.5L9.5,7.5M9.5,16.5l1-4.5l5,-3l-6.5,5.5Z" /></svg>
                                Telegram
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;