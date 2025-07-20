
import React from 'react';
import type { Category } from '../types';

interface HeaderProps {
    storeName: string;
    categories: Category[];
    selectedFilter: string;
    onFilterSelect: (filter: string) => void;
    cartCount: number;
    onSearchChange: (term: string) => void;
    onCartClick: () => void;
    onMobileMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ storeName, categories, selectedFilter, onFilterSelect, cartCount, onSearchChange, onCartClick, onMobileMenuClick }) => {
    return (
        <header className="bg-secondary/80 backdrop-blur-lg sticky top-0 z-40 w-full border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={onMobileMenuClick} className="p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100">
                            <span className="sr-only">Open menu</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Store Name */}
                    <div className="flex-shrink-0">
                         <a href="#" onClick={(e) => { e.preventDefault(); onFilterSelect('All')}} className="text-2xl font-bold tracking-tight text-primary">{storeName}</a>
                    </div>

                    {/* Desktop Navigation with Dropdowns */}
                    <nav className="hidden md:flex md:space-x-1">
                        <button
                            onClick={() => onFilterSelect('All')}
                            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${selectedFilter === 'All' ? 'text-accent' : 'text-gray-500 hover:text-primary'}`}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <div key={category.id} className="relative group">
                                <button
                                    onClick={() => onFilterSelect(category.name)}
                                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md flex items-center ${selectedFilter === category.name ? 'text-accent' : 'text-gray-500 hover:text-primary'}`}
                                >
                                    {category.name}
                                    {category.subcategories && category.subcategories.length > 0 && (
                                        <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    )}
                                </button>
                                {category.subcategories && category.subcategories.length > 0 && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2 z-50">
                                        <div className="py-1">
                                            {category.subcategories.map((sub) => (
                                                <a
                                                    href="#"
                                                    key={sub.id}
                                                    onClick={(e) => { e.preventDefault(); onFilterSelect(sub.name); }}
                                                    className={`block px-4 py-2 text-sm ${selectedFilter === sub.name ? 'text-accent bg-gray-100' : 'text-gray-700 hover:bg-gray-100 hover:text-primary'}`}
                                                >
                                                    {sub.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Search and Cart */}
                    <div className="flex items-center justify-end space-x-2 sm:space-x-4">
                        <div className="relative hidden sm:block">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full sm:w-56 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-accent-hover"
                            />
                        </div>
                        <button onClick={onCartClick} className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-accent rounded-full">
                                    {cartCount}
                                </span>
                            )}
                            <span className="sr-only">View shopping cart</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
