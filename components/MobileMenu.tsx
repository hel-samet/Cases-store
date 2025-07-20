
import React, { useState } from 'react';
import type { Category } from '../types';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    storeName: string;
    categories: Category[];
    onFilterSelect: (filter: string) => void;
    onSearchChange: (term: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, storeName, categories, onFilterSelect, onSearchChange }) => {
    const [openCategory, setOpenCategory] = useState<string | null>(null);

    const handleCategoryClick = (category: Category) => {
        if (category.subcategories && category.subcategories.length > 0) {
            setOpenCategory(prev => prev === category.id ? null : category.id);
        } else {
            onFilterSelect(category.name);
        }
    };

    return (
        <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-modal="true" role="dialog">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose}></div>
            
            {/* Panel */}
            <div className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold text-primary">{storeName}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
                             <span className="sr-only">Close menu</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="p-4 border-b">
                        <div className="relative">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search products..."
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-accent-hover"
                            />
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-grow overflow-y-auto p-4 space-y-1">
                        <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); onFilterSelect('All'); }}
                            className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary"
                        >
                            All Products
                        </a>
                        {categories.map((category) => (
                            <div key={category.id}>
                                <button
                                    onClick={() => handleCategoryClick(category)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary"
                                >
                                    <span>{category.name}</span>
                                    {category.subcategories && category.subcategories.length > 0 && (
                                        <svg className={`w-5 h-5 text-gray-400 transform transition-transform ${openCategory === category.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    )}
                                </button>
                                {openCategory === category.id && category.subcategories && (
                                    <div className="pl-6 mt-1 space-y-1">
                                        {category.subcategories.map(sub => (
                                            <a 
                                                href="#" 
                                                key={sub.id}
                                                onClick={(e) => { e.preventDefault(); onFilterSelect(sub.name); }}
                                                className="block px-3 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-primary"
                                            >
                                                {sub.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
