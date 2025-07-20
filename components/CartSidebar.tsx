import React from 'react';
import type { CartItem } from '../types';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onRemoveItem: (productId: string) => void;
    subtotal: number;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, subtotal }) => {
    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-modal="true" role="dialog">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose}></div>

            {/* Panel */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-semibold text-primary">Your Cart</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
                             <span className="sr-only">Close cart</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-grow overflow-y-auto p-6">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                <p className="mt-4 text-lg font-medium text-primary">Your cart is empty</p>
                                <p className="text-sm mt-1">Add items to get started.</p>
                            </div>
                        ) : (
                            <ul className="-my-6 divide-y divide-gray-200">
                                {items.map(item => (
                                    <li key={item.id} className="flex py-6">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center" />
                                        </div>
                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>{item.name}</h3>
                                                    <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <div className="flex items-center border border-gray-300 rounded-md">
                                                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md" aria-label={`Decrease quantity of ${item.name}`}>-</button>
                                                    <span className="px-3 py-1 font-semibold tabular-nums">{item.quantity}</span>
                                                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md" aria-label={`Increase quantity of ${item.name}`}>+</button>
                                                </div>
                                                <div className="flex">
                                                    <button onClick={() => onRemoveItem(item.id)} type="button" className="font-medium text-accent hover:text-accent-hover">Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t border-gray-200 py-6 px-6 bg-gray-50">
                            <div className="flex justify-between text-lg font-bold text-primary">
                                <p>Subtotal</p>
                                <p>${subtotal.toFixed(2)}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                            <div className="mt-6">
                                <a href="https://t.me/helsamet" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-md border border-transparent bg-accent px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-accent-hover">
                                    Continue to Checkout
                                </a>
                            </div>
                            <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                                <p>
                                    or <button type="button" className="font-medium text-accent hover:text-accent-hover" onClick={onClose}>Continue Shopping<span aria-hidden="true"> &rarr;</span></button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;