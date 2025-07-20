import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Product, CartItem, Category, HeroData, User } from './types';
import { 
    getStoreData, addProduct, updateProduct, deleteProduct,
    addCategory, updateCategory, deleteCategory as deleteCategoryFromDB,
    login, addUser, deleteUser as deleteUserFromDB, updatePassword
} from './services/databaseService';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import ProductDetailModal from './components/ProductDetailModal';
import CartSidebar from './components/CartSidebar';
import AdminDashboard from './components/AdminDashboard';
import Spinner from './components/Spinner';
import LoginPage from './components/LoginPage';
import MobileMenu from './components/MobileMenu';
import Storefront from './components/Storefront';

const App: React.FC = () => {
    // === State Management ===
    const [view, setView] = useState<'storefront' | 'admin'>('storefront');
    const [adminView, setAdminView] = useState<'products' | 'categories' | 'users'>('products');
    const [storeInfo, setStoreInfo] = useState<{ storeName: string; hero: HeroData; } | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [selectedFilter, setSelectedFilter] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Routing and Auth Effect
    useEffect(() => {
        const currentUserId = sessionStorage.getItem('auraAdminUserId');
        if (currentUserId) {
            const user = users.find(u => u.id === currentUserId);
            if(user) setCurrentUser(user);
        }

        const handleLocationChange = () => {
            if (window.location.hash === '#/admin') {
                setView('admin');
            } else {
                setView('storefront');
            }
        };

        handleLocationChange(); // Set initial view
        window.addEventListener('hashchange', handleLocationChange);
        window.addEventListener('popstate', handleLocationChange); // Also listen to popstate for robustness

        return () => {
            window.removeEventListener('hashchange', handleLocationChange);
            window.removeEventListener('popstate', handleLocationChange);
        };
    }, [users]);

    // Initial Data Fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getStoreData();
                setProducts(data.products);
                setCategories(data.categories);
                setUsers(data.users);
                setStoreInfo({
                    storeName: data.storeName,
                    hero: data.hero,
                });

                // Re-authenticate user after fetching user list
                const currentUserId = sessionStorage.getItem('auraAdminUserId');
                if (currentUserId) {
                    const user = data.users.find(u => u.id === currentUserId);
                    if(user) setCurrentUser(user);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load store data. Please try again later.';
                setError(message);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // === Filter Handler ===
    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);
        setIsMobileMenuOpen(false); // Close menu on selection
    };

    // === Auth Handlers ===
    const handleLogin = useCallback(async (email: string, password: string): Promise<User | null> => {
        const user = await login(email, password);
        if (user) {
            setCurrentUser(user);
            sessionStorage.setItem('auraAdminUserId', user.id);
            window.location.hash = '#/admin';
            return user;
        }
        return null;
    }, []);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        sessionStorage.removeItem('auraAdminUserId');
        window.location.hash = '';
    }, []);

    // === User Management Handlers (for Admin) ===
     const handleAddUser = useCallback(async (userData: Omit<User, 'id'>) => {
        const newUser = await addUser(userData);
        setUsers(prev => [...prev, newUser]);
    }, []);

    const handleDeleteUser = useCallback(async (userId: string) => {
        await deleteUserFromDB(userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
    }, []);

    const handleChangePassword = useCallback(async (userId: string, newPassword: string) => {
        const updatedUser = await updatePassword(userId, newPassword);
        setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    }, []);


    // === Product Management Handlers (for Admin) ===
    const handleAddProduct = useCallback(async (productData: Omit<Product, 'id' | 'rating' | 'reviews'>) => {
        const newProduct = await addProduct(productData);
        setProducts(prevProducts => [...prevProducts, newProduct]);
    }, []);

    const handleUpdateProduct = useCallback(async (updatedProductData: Product) => {
        const updatedProduct = await updateProduct(updatedProductData);
        setProducts(prevProducts =>
            prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
    }, []);

    const handleDeleteProduct = useCallback(async (productId: string) => {
        await deleteProduct(productId);
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    }, []);

    // === Category Management Handlers (for Admin) ===
    const handleAddCategory = useCallback(async (categoryData: Omit<Category, 'id'>) => {
        const newCategory = await addCategory(categoryData);
        setCategories(prev => [...prev, newCategory]);
    }, []);

    const handleUpdateCategory = useCallback(async (updatedCategoryData: Category) => {
        await updateCategory(updatedCategoryData);
        // We also need to refetch products in case a category name changed
        const data = await getStoreData();
        setProducts(data.products);
        setCategories(data.categories);
    }, []);
    
    const handleDeleteCategory = useCallback(async (categoryId: string) => {
        await deleteCategoryFromDB(categoryId);
        setCategories(prev => prev.filter(c => c.id !== categoryId));
    }, []);

    // === Cart Handlers ===
    const handleAddToCart = useCallback((product: Product, quantity: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevCart, { ...product, quantity }];
        });
        setSelectedProduct(null); // Close modal on add
        setIsCartOpen(true); // Open cart sidebar
    }, []);

    const handleUpdateCartQuantity = useCallback((productId: string, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity < 1) {
                return prevCart.filter(item => item.id !== productId);
            }
            return prevCart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
        });
    }, []);
    
    const handleRemoveFromCart = useCallback((productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    }, []);

    // === Memos for Derived State ===
    const cartSubtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cart]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (selectedFilter === 'All') {
                return matchesSearch;
            }
            
            const matchesFilter = product.category === selectedFilter || product.subcategory === selectedFilter;

            return matchesFilter && matchesSearch;
        });
    }, [products, selectedFilter, searchTerm]);

    // === Render Logic ===
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-secondary">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-secondary text-red-600 p-4 text-center">
                 <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!storeInfo) {
        return null; // Should be covered by loading/error states
    }

    if (view === 'admin') {
        if (currentUser) {
            return (
                <AdminDashboard
                    storeName={storeInfo.storeName}
                    currentUser={currentUser}
                    products={products}
                    categories={categories}
                    users={users}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onLogout={handleLogout}
                    adminView={adminView}
                    onSetAdminView={setAdminView}
                    onAddCategory={handleAddCategory}
                    onUpdateCategory={handleUpdateCategory}
                    onDeleteCategory={handleDeleteCategory}
                    onAddUser={handleAddUser}
                    onDeleteUser={handleDeleteUser}
                    onChangePassword={handleChangePassword}
                />
            );
        }
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="flex flex-col min-h-screen font-sans bg-secondary text-primary">
            <Header
                storeName={storeInfo.storeName}
                categories={categories}
                selectedFilter={selectedFilter}
                onFilterSelect={handleFilterSelect}
                cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                onSearchChange={setSearchTerm}
                onCartClick={() => setIsCartOpen(true)}
                onMobileMenuClick={() => setIsMobileMenuOpen(true)}
            />
            <MobileMenu 
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                storeName={storeInfo.storeName}
                categories={categories}
                onFilterSelect={handleFilterSelect}
                onSearchChange={setSearchTerm}
            />
            <main className="flex-grow">
                <Hero heroData={storeInfo.hero} />
                {selectedFilter === 'All' && searchTerm === '' ? (
                    <Storefront
                        categories={categories}
                        products={products}
                        onProductClick={setSelectedProduct}
                    />
                ) : (
                    <ProductGrid
                        products={filteredProducts}
                        onProductClick={setSelectedProduct}
                    />
                )}
            </main>
            <Footer 
                storeName={storeInfo.storeName} 
            />
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={handleAddToCart}
                />
            )}
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveFromCart}
                subtotal={cartSubtotal}
            />
        </div>
    );
};

export default App;