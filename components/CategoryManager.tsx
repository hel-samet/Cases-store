import React, { useState } from 'react';
import type { Category, Product } from '../types';
import CategoryFormModal from './CategoryFormModal';

interface CategoryManagerProps {
    categories: Category[];
    products: Product[];
    onAddCategory: (categoryData: Omit<Category, 'id'>) => Promise<void>;
    onUpdateCategory: (category: Category) => Promise<void>;
    onDeleteCategory: (categoryId: string) => Promise<void>;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, products, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleAddNewClick = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (categoryId: string) => {
        if (window.confirm('Are you sure you want to delete this category? This cannot be undone.')) {
            try {
                await onDeleteCategory(categoryId);
            } catch (error) {
                const message = error instanceof Error ? error.message : "An unknown error occurred.";
                console.error("Failed to delete category:", error);
                alert(`Error: Could not delete category.\n${message}`);
            }
        }
    };
    
    const handleSaveCategory = async (categoryData: Category | Omit<Category, 'id'>) => {
        setIsSaving(true);
        try {
            if ('id' in categoryData) {
                await onUpdateCategory(categoryData);
            } else {
                await onAddCategory(categoryData);
            }
            setIsModalOpen(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            console.error("Failed to save category:", error);
            alert(`Error: Could not save category.\n${message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
                    <button
                        onClick={handleAddNewClick}
                        className="px-5 py-2 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover transition flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        Add New Category
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subcategories</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map(category => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                        <div className="text-sm text-gray-500">{category.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2 max-w-md">
                                            {(category.subcategories || []).map(sub => (
                                                <span key={sub.id} className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {sub.name}
                                                </span>
                                            ))}
                                            {(category.subcategories || []).length === 0 && <span className="text-xs text-gray-400">None</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEditClick(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDeleteClick(category.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {categories.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No categories created yet.
                        </div>
                    )}
                </div>
            </div>
             {isModalOpen && (
                <CategoryFormModal
                    category={editingCategory}
                    products={products}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveCategory}
                    isSaving={isSaving}
                />
            )}
        </>
    );
};

export default CategoryManager;