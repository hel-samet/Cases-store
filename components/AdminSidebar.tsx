
import React from 'react';
import type { User } from '../types';

interface AdminSidebarProps {
    storeName: string;
    currentUser: User;
    onLogout: () => void;
    activeView: 'products' | 'categories' | 'users';
    onSetView: (view: 'products' | 'categories' | 'users') => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ storeName, currentUser, onLogout, activeView, onSetView }) => {
    const navItems = [
        { 
            name: 'Products', 
            view: 'products', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        },
        { 
            name: 'Categories', 
            view: 'categories', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        },
        {
            name: 'Manage Users',
            view: 'users',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        }
    ];

    const availableNavItems = navItems.filter(item => {
        if (item.view === 'users') {
            return currentUser.role === 'superadmin';
        }
        return true;
    });

    return (
        <div className="flex flex-col w-64 bg-primary text-secondary">
            <div className="flex items-center justify-center h-20 border-b border-gray-700">
                <h1 className="text-xl font-bold tracking-tight">{storeName}</h1>
            </div>

            <div className="px-4 py-6 border-b border-gray-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Logged in as</p>
                <p className="font-semibold text-white truncate mt-1" title={currentUser.email}>{currentUser.email}</p>
                 <p className="text-xs text-indigo-400 mt-1">{currentUser.role === 'superadmin' ? 'Super Administrator' : 'Administrator'}</p>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
                {availableNavItems.map(item => (
                    <a
                        key={item.name}
                        href="#"
                        onClick={(e) => { e.preventDefault(); onSetView(item.view as 'products' | 'categories' | 'users'); }}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                            activeView === item.view
                                ? 'bg-accent text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        {item.icon}
                        {item.name}
                    </a>
                ))}
            </nav>
            <div className="px-4 py-6">
                 <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-500 hover:text-white transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
