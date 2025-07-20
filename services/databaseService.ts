
import type { Product, StoreData, Category, User } from '../types';
import { storeData as initialData } from '../data/storeData';

// --- LocalStorage Persistence ---
const LOCAL_STORAGE_KEY_PRODUCTS = 'aura-products';
const LOCAL_STORAGE_KEY_CATEGORIES = 'aura-categories';
const LOCAL_STORAGE_KEY_USERS = 'aura-users';
const LOCAL_STORAGE_KEY_PUBLISHED = 'aura-published-data';
const SESSION_STORAGE_SYNC_KEY = 'aura-sync-timestamp';


// ===== Helper Functions =====
function loadFromLocalStorage<T>(key: string, defaultData: T[]): T[] {
    try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            // console.log(`DB: Loaded ${key} from localStorage`);
            return JSON.parse(storedData);
        }
    } catch (e) {
        console.error(`Failed to load ${key} from localStorage`, e);
    }
    // console.log(`DB: No data for ${key} in localStorage, initializing with default data.`);
    saveToLocalStorage(key, defaultData);
    return defaultData;
}

function saveToLocalStorage<T>(key: string, data: T[]): void {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        // console.log(`DB: Saved ${key} to localStorage`);
    } catch (e) {
        console.error(`Failed to save ${key} to localStorage`, e);
    }
}

function migrateUsers(users: User[]): User[] {
    let hasChanges = false;
    const migrated = users.map(user => {
        if (!user.role) {
            hasChanges = true;
            if (user.email === 'admin@example.com') {
                return { ...user, role: 'superadmin' as const };
            }
            return { ...user, role: 'admin' as const };
        }
        return user;
    });
    if(hasChanges) {
         console.log("DB: Migrated users to include roles.");
    }
    return migrated;
}


function initializeUsers(): User[] {
    const defaultUsers: User[] = [
        { id: 'user-root-001', email: 'admin@example.com', password: 'password', role: 'superadmin' }
    ];
    const loadedUsers = loadFromLocalStorage(LOCAL_STORAGE_KEY_USERS, defaultUsers);
    const migratedUsers = migrateUsers(loadedUsers);
    // Save back if migration happened to persist roles for old users
    if(JSON.stringify(loadedUsers) !== JSON.stringify(migratedUsers)) {
        saveToLocalStorage(LOCAL_STORAGE_KEY_USERS, migratedUsers);
    }
    return migratedUsers;
}


// --- Database Simulation ---
let productsDB: Product[];
let categoriesDB: Category[];
let usersDB: User[];

const storeInfo = {
    storeName: initialData.storeName,
    hero: initialData.hero,
};
const NETWORK_DELAY = 200; // ms

function simulateDelay(): Promise<void> {
    return new Promise(res => setTimeout(res, NETWORK_DELAY));
}

// ===== API-like Functions =====

// --- Core Data ---
export const getStoreData = async (): Promise<StoreData> => {
    await simulateDelay();
    
    // --- Visitor Data Sync Logic ---
    // This block ensures that any visitor (who isn't a logged-in admin)
    // gets the latest "published" version of the store data.
    let sourceOfTruth = {
        products: initialData.products,
        categories: initialData.categories,
        publishedAt: 'initial', // A default timestamp for the original data
    };
    try {
        const publishedString = localStorage.getItem(LOCAL_STORAGE_KEY_PUBLISHED);
        if (publishedString) {
            const publishedData = JSON.parse(publishedString);
            if (publishedData.products && publishedData.categories && publishedData.publishedAt) {
                sourceOfTruth = publishedData;
            }
        }
    } catch (e) {
        console.error("DB: Could not parse published data.", e);
    }

    const lastSyncTimestamp = sessionStorage.getItem(SESSION_STORAGE_SYNC_KEY);
    const requiresSync = lastSyncTimestamp !== sourceOfTruth.publishedAt;
    const isAdminLoggedIn = !!sessionStorage.getItem('auraAdminUserId');

    // Sync if the data is stale AND the user is not an admin.
    // This protects an admin's draft work from being overwritten.
    if (requiresSync && !isAdminLoggedIn) {
        console.log("DB: Stale data detected for visitor. Syncing with source of truth.");
        saveToLocalStorage(LOCAL_STORAGE_KEY_PRODUCTS, sourceOfTruth.products);
        saveToLocalStorage(LOCAL_STORAGE_KEY_CATEGORIES, sourceOfTruth.categories);
        sessionStorage.setItem(SESSION_STORAGE_SYNC_KEY, sourceOfTruth.publishedAt);
    }
    // --- End Sync Logic ---

    // Always reload from storage to ensure consistency between tabs
    productsDB = loadFromLocalStorage(LOCAL_STORAGE_KEY_PRODUCTS, sourceOfTruth.products);
    categoriesDB = loadFromLocalStorage(LOCAL_STORAGE_KEY_CATEGORIES, sourceOfTruth.categories);
    usersDB = initializeUsers();
    console.log("DB: Fetched all store data");
    return JSON.parse(JSON.stringify({
        ...storeInfo,
        products: productsDB,
        categories: categoriesDB,
        users: usersDB,
    }));
};

// --- User Management ---
export const login = async (email: string, password: string): Promise<User | null> => {
    await simulateDelay();
    const user = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
        console.log("DB: Login successful for", email);
        return JSON.parse(JSON.stringify(user));
    }
    console.warn("DB: Login failed for", email);
    return null;
}

export const addUser = async (userData: Omit<User, 'id' | 'role'>): Promise<User> => {
    await simulateDelay();
    if (usersDB.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error("User with this email already exists.");
    }
    const newUser: User = {
        ...userData,
        id: `user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        role: 'admin',
    };
    usersDB.push(newUser);
    saveToLocalStorage(LOCAL_STORAGE_KEY_USERS, usersDB);
    console.log("DB: Added user", newUser);
    return JSON.parse(JSON.stringify(newUser));
};

export const deleteUser = async (userId: string): Promise<{ id: string }> => {
    await simulateDelay();
    const initialLength = usersDB.length;
    usersDB = usersDB.filter(u => u.id !== userId);
    if (usersDB.length === initialLength) {
        throw new Error("User not found for deletion");
    }
    saveToLocalStorage(LOCAL_STORAGE_KEY_USERS, usersDB);
    console.log("DB: Deleted user", userId);
    return { id: userId };
};

export const updatePassword = async (userId: string, newPassword: string): Promise<User> => {
    await simulateDelay();
    const userIndex = usersDB.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error("User not found to update password.");
    }
    usersDB[userIndex].password = newPassword;
    saveToLocalStorage(LOCAL_STORAGE_KEY_USERS, usersDB);
    console.log("DB: Updated password for user", userId);
    return JSON.parse(JSON.stringify(usersDB[userIndex]));
}

// --- Product Management ---
export const addProduct = async (productData: Omit<Product, 'id' | 'rating' | 'reviews'>): Promise<Product> => {
    await simulateDelay();
    const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        rating: Math.floor(Math.random() * 2) + 3.5, // 3.5-4.5
        reviews: Math.floor(Math.random() * 100),
    };
    productsDB.push(newProduct);
    saveToLocalStorage(LOCAL_STORAGE_KEY_PRODUCTS, productsDB);
    console.log("DB: Added product", newProduct);
    return JSON.parse(JSON.stringify(newProduct));
};

export const updateProduct = async (updatedProduct: Product): Promise<Product> => {
    await simulateDelay();
    const index = productsDB.findIndex(p => p.id === updatedProduct.id);
    if (index === -1) {
        throw new Error("Product not found");
    }
    productsDB[index] = updatedProduct;
    saveToLocalStorage(LOCAL_STORAGE_KEY_PRODUCTS, productsDB);
    console.log("DB: Updated product", updatedProduct);
    return JSON.parse(JSON.stringify(updatedProduct));
};

export const deleteProduct = async (productId: string): Promise<{ id: string }> => {
    await simulateDelay();
    const initialLength = productsDB.length;
    productsDB = productsDB.filter(p => p.id !== productId);
    if (productsDB.length === initialLength) {
        throw new Error("Product not found for deletion");
    }
    saveToLocalStorage(LOCAL_STORAGE_KEY_PRODUCTS, productsDB);
    console.log("DB: Deleted product", productId);
    return { id: productId };
};

// --- Category Management ---
export const addCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
    await simulateDelay();
    const newCategory: Category = {
        ...categoryData,
        id: `cat-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };
    categoriesDB.push(newCategory);
    saveToLocalStorage(LOCAL_STORAGE_KEY_CATEGORIES, categoriesDB);
    console.log("DB: Added category", newCategory);
    return JSON.parse(JSON.stringify(newCategory));
};

export const updateCategory = async (updatedCategory: Category): Promise<Category> => {
    await simulateDelay();
    const index = categoriesDB.findIndex(c => c.id === updatedCategory.id);
    if (index === -1) {
        throw new Error("Category not found");
    }
    const oldCategory = categoriesDB[index];
    const oldCategoryName = oldCategory.name;

    // Safety check for removing subcategories
    const oldSubcategories = oldCategory.subcategories || [];
    const newSubcategories = updatedCategory.subcategories || [];
    const removedSubcategories = oldSubcategories.filter(oldSub => 
        !newSubcategories.some(newSub => newSub.id === oldSub.id)
    );

    if (removedSubcategories.length > 0) {
        for (const removedSub of removedSubcategories) {
            const isSubCategoryInUse = productsDB.some(p => 
                p.category === oldCategoryName &&
                p.subcategory === removedSub.name
            );
            if (isSubCategoryInUse) {
                throw new Error(`Cannot remove subcategory "${removedSub.name}": it is currently in use by one or more products.`);
            }
        }
    }
    
    // Update the category in the DB
    categoriesDB[index] = updatedCategory;
    
    // If the main category name changed, update it across all products
    if (oldCategoryName !== updatedCategory.name) {
      productsDB = productsDB.map(p => p.category === oldCategoryName ? { ...p, category: updatedCategory.name } : p);
      saveToLocalStorage(LOCAL_STORAGE_KEY_PRODUCTS, productsDB);
    }
    
    saveToLocalStorage(LOCAL_STORAGE_KEY_CATEGORIES, categoriesDB);
    console.log("DB: Updated category", updatedCategory);
    return JSON.parse(JSON.stringify(updatedCategory));
};

export const deleteCategory = async (categoryId: string): Promise<{ id: string }> => {
    await simulateDelay();
    // Safety check: ensure no products are using this category
    const categoryToDelete = categoriesDB.find(c => c.id === categoryId);
    if (categoryToDelete) {
        const isCategoryInUse = productsDB.some(p => p.category === categoryToDelete.name);
        if (isCategoryInUse) {
            throw new Error("Cannot delete category: it is currently in use by one or more products.");
        }
    }

    const initialLength = categoriesDB.length;
    categoriesDB = categoriesDB.filter(c => c.id !== categoryId);
    if (categoriesDB.length === initialLength) {
        throw new Error("Category not found for deletion");
    }
    saveToLocalStorage(LOCAL_STORAGE_KEY_CATEGORIES, categoriesDB);
    console.log("DB: Deleted category", categoryId);
    return { id: categoryId };
};

// --- Data Management ---
export const importStoreData = async (data: { products: Product[], categories: Category[] }): Promise<void> => {
    await simulateDelay();
    if (!data || !Array.isArray(data.products) || !Array.isArray(data.categories)) {
        throw new Error("Invalid data structure. Must include 'products' and 'categories' arrays.");
    }
    
    // In a real app, you would do much more thorough validation here
    saveToLocalStorage(LOCAL_STORAGE_KEY_PRODUCTS, data.products);
    saveToLocalStorage(LOCAL_STORAGE_KEY_CATEGORIES, data.categories);
    
    console.log("DB: Imported data successfully. Products:", data.products.length, "Categories:", data.categories.length);
};

export const publishStoreData = async (): Promise<void> => {
    await simulateDelay();
    const timestamp = new Date().toISOString();
    
    // The in-memory DB variables for the admin hold the latest changes.
    const dataToPublish = {
        products: productsDB,
        categories: categoriesDB,
        publishedAt: timestamp,
    };
    
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY_PUBLISHED, JSON.stringify(dataToPublish));
        // Also update the current session's sync timestamp to prevent an immediate re-sync for the admin.
        sessionStorage.setItem(SESSION_STORAGE_SYNC_KEY, timestamp);
        console.log("DB: Published current store data.", dataToPublish);
    } catch(e) {
        console.error("Failed to publish data", e);
        throw new Error("Could not publish data. The browser storage might be full.");
    }
};
