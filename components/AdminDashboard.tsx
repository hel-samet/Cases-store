
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Product, Category, User } from '../types';
import ProductFormModal from './ProductFormModal';
import AdminSidebar from './AdminSidebar';
import StatCard from './StatCard';
import CategoryManager from './CategoryManager';
import UserManager from './UserManager';
import ChangePasswordModal from './ChangePasswordModal';
import UserFormModal from './UserFormModal';
import { importStoreData, publishStoreData } from '../services/databaseService';

interface AdminDashboardProps {
    storeName: string;
    currentUser: User;
    products: Product[];
    categories: Category[];
    users: User[];
    onAddProduct: (productData: Omit<Product, 'id' | 'rating' | 'reviews'>) => Promise<void>;
    onUpdateProduct: (product: Product) => Promise<void>;
    onDeleteProduct: (productId: string) => Promise<void>;
    onLogout: () => void;
    adminView: 'products' | 'categories' | 'users';
    onSetAdminView: (view: 'products' | 'categories' | 'users') => void;
    onAddCategory: (categoryData: Omit<Category, 'id'>) => Promise<void>;
    onUpdateCategory: (category: Category) => Promise<void>;
    onDeleteCategory: (categoryId: string) => Promise<void>;
    onAddUser: (userData: Omit<User, 'id'>) => Promise<void>;
    onDeleteUser: (userId: string) => Promise<void>;
    onChangePassword: (userId: string, newPassword: string) => Promise<void>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const {
        storeName, currentUser, products, categories, users, onLogout,
        adminView, onSetAdminView,
        onAddProduct, onUpdateProduct, onDeleteProduct,
        onAddCategory, onUpdateCategory, onDeleteCategory,
        onAddUser, onDeleteUser, onChangePassword
    } = props;

    // State for modals
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Permission check effect
    useEffect(() => {
        if (adminView === 'users' && currentUser.role !== 'superadmin') {
            console.warn("Permission Denied: Redirecting non-superadmin from user management.");
            onSetAdminView('products');
        }
    }, [adminView, currentUser.role, onSetAdminView]);

    const handleBackupData = () => {
        // We only backup products and categories, not users for security.
        const backupData = {
            products: props.products,
            categories: props.categories,
        };

        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().slice(0, 10);
        a.download = `aura-living-backup-${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!window.confirm("Are you sure you want to import this data? This will overwrite all existing products and categories. This action cannot be undone.")) {
            if(event.target) event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File could not be read.");
                }
                const data = JSON.parse(text);

                if (!data.products || !data.categories || !Array.isArray(data.products) || !Array.isArray(data.categories)) {
                    throw new Error("Invalid backup file structure. It must contain 'products' and 'categories' arrays.");
                }
                
                await importStoreData(data);
                
                alert("Data imported successfully! The application will now reload.");
                window.location.reload();

            } catch (error) {
                const message = error instanceof Error ? error.message : "An unknown error occurred.";
                console.error("Failed to import data:", error);
                alert(`Error importing data: ${message}`);
            } finally {
                if(event.target) event.target.value = '';
            }
        };
        reader.onerror = () => {
            alert("Failed to read file.");
            if(event.target) event.target.value = '';
        };
        reader.readAsText(file);
    };

    const handlePublishChanges = async () => {
        if (!window.confirm("Are you sure you want to publish these changes? This will make the current product and category list the new public version for all visitors.")) {
            return;
        }

        setIsPublishing(true);
        try {
            await publishStoreData();
            alert("Changes published successfully! All visitors will now see the updated store.");
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            console.error("Failed to publish changes:", error);
            alert(`Error publishing changes: ${message}`);
        } finally {
            setIsPublishing(false);
        }
    };


    const handleAddNewProductClick = () => {
        setEditingProduct(null);
        setIsProductModalOpen(true);
    };

    const handleEditProductClick = (product: Product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    const handleEditUserClick = (user: User) => {
        setEditingUser(user);
        setIsChangePasswordModalOpen(true);
    };

    const handleDeleteProductClick = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await onDeleteProduct(productId);
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert("Error: Could not delete product.");
            }
        }
    };
    
    const handleSaveProduct = async (productData: Product | Omit<Product, 'id' | 'rating' | 'reviews'>) => {
        setIsSaving(true);
        try {
            if ('id' in productData) {
                await onUpdateProduct(productData as Product);
            } else {
                await onAddProduct(productData);
            }
            setIsProductModalOpen(false);
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Error: Could not save product. Please check the console for details.");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredProducts = useMemo(() =>
        products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [products, searchTerm]
    );

    const stats = useMemo(() => {
        const totalProducts = products.length;
        const totalCategories = categories.length;
        const totalValue = products.reduce((sum, p) => sum + p.price, 0);
        const totalUsers = users.length;
        return { totalProducts, totalCategories, totalValue, totalUsers };
    }, [products, categories, users]);

    const renderAdminContent = () => {
        switch (adminView) {
            case 'products':
                return (
                     <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b flex justify-between items-center">
                             <h2 className="text-xl font-semibold text-gray-800">Products</h2>
                             <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                                <button
                                    onClick={handleAddNewProductClick}
                                    className="px-5 py-2 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover transition flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                    Add New
                                </button>
                             </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md"/>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-sm text-gray-500">{product.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{product.category}</div>
                                                <div className="text-sm text-gray-500">{product.subcategory}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">${product.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleEditProductClick(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                                <button onClick={() => handleDeleteProductClick(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {filteredProducts.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    No products found for "{searchTerm}".
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'categories':
                return <CategoryManager {...props} />;
            case 'users':
                if (currentUser.role !== 'superadmin') return null; // Safety check
                return <UserManager 
                    currentUser={currentUser} 
                    users={users} 
                    onAddUser={() => setIsUserModalOpen(true)} 
                    onDeleteUser={onDeleteUser} 
                    onEditUser={handleEditUserClick}
                />;
            default:
                return null;
        }
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <AdminSidebar 
                storeName={storeName} 
                currentUser={currentUser}
                onLogout={onLogout} 
                activeView={adminView}
                onSetView={onSetAdminView}
            />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileImport}
                    accept=".json"
                    className="hidden"
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                            <p className="text-gray-500 mt-1">Welcome back, {currentUser.email.split('@')[0]}.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                             <button
                                onClick={handleImportClick}
                                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 font-semibold rounded-md hover:bg-gray-50 transition flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                Import Data
                            </button>
                            <button
                                onClick={handleBackupData}
                                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 font-semibold rounded-md hover:bg-gray-50 transition flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Backup Data
                            </button>
                             <button
                                onClick={handlePublishChanges}
                                disabled={isPublishing}
                                className="px-4 py-2 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover transition flex items-center disabled:bg-indigo-400 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                {isPublishing ? 'Publishing...' : 'Publish Changes'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard 
                            title="Total Products" 
                            value={stats.totalProducts.toString()}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                        />
                        <StatCard 
                            title="Product Categories" 
                            value={stats.totalCategories.toString()}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                        />
                        {currentUser.role === 'superadmin' && (
                            <StatCard 
                                title="Total Users" 
                                value={stats.totalUsers.toString()}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                            />
                        )}
                        <StatCard 
                            title="Total Inventory Value" 
                            value={`$${stats.totalValue.toFixed(2)}`}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0 1H9.5M12 6h2.5M12 18v-1m0 1H9.5M12 18h2.5" /></svg>}
                        />
                    </div>
                    
                    {renderAdminContent()}

                </main>
            </div>
            
            {isProductModalOpen && (
                <ProductFormModal
                    product={editingProduct}
                    categories={categories}
                    onClose={() => setIsProductModalOpen(false)}
                    onSave={handleSaveProduct}
                    isSaving={isSaving}
                />
            )}

            {isChangePasswordModalOpen && editingUser && (
                 <ChangePasswordModal
                    userToEdit={editingUser}
                    onClose={() => setIsChangePasswordModalOpen(false)}
                    onChangePassword={onChangePassword}
                />
            )}

            {isUserModalOpen && currentUser.role === 'superadmin' && (
                <UserFormModal
                    onClose={() => setIsUserModalOpen(false)}
                    onAddUser={onAddUser}
                    existingUsers={users}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
