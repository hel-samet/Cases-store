import React, { useState, useEffect } from 'react';
import type { Category, Product } from '../types';

interface CategoryFormModalProps {
    category: Category | null;
    products: Product[];
    onSave: (categoryData: Omit<Category, 'id'> | Category) => void;
    onClose: () => void;
    isSaving: boolean;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ category, products, onSave, onClose, isSaving }) => {
    const [name, setName] = useState('');
    const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (category) {
            setName(category.name);
            setSubcategories(category.subcategories || []);
        } else {
            setName('');
            setSubcategories([]);
        }
        setNewSubcategoryName('');
        setError(null);
    }, [category]);

    const handleAddSubcategory = () => {
        setError(null);
        const trimmedName = newSubcategoryName.trim();
        if (!trimmedName) return;
        if (subcategories.some(sub => sub.name.toLowerCase() === trimmedName.toLowerCase())) {
            setError("This subcategory already exists.");
            return;
        }
        const newSub = {
            id: `sub-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name: trimmedName,
        };
        setSubcategories(prev => [...prev, newSub]);
        setNewSubcategoryName('');
    };

    const handleRemoveSubcategory = (subId: string) => {
        setError(null);
        const subToRemove = subcategories.find(s => s.id === subId);
        if(!subToRemove) return;

        // Prevent removing a subcategory if it's in use
        const isSubcategoryInUse = products.some(p => 
            p.category === (category?.name || name) &&
            p.subcategory === subToRemove.name
        );

        if (isSubcategoryInUse) {
            setError(`Cannot remove "${subToRemove.name}" as it's being used by products.`);
            return;
        }

        setSubcategories(prev => prev.filter(sub => sub.id !== subId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (isSaving || !name.trim()) {
            if(!name.trim()) setError("Category name cannot be empty.");
            return;
        };

        if (category) {
            onSave({
                ...category,
                name: name.trim(),
                subcategories: subcategories,
            });
        } else {
            onSave({
                name: name.trim(),
                subcategories: subcategories,
            });
        }
    };

    const title = category ? 'Edit Category' : 'Add New Category';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={isSaving ? undefined : onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[80vh]">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-semibold text-primary">{title}</h2>
                        <button type="button" onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    
                    <fieldset disabled={isSaving} className="p-6 md:p-8 flex-grow overflow-y-auto space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                id="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent disabled:bg-gray-50"
                                placeholder="e.g., Phone Cases"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subcategories</label>
                            <div className="mt-2 space-y-2 border rounded-md p-3 bg-gray-50 min-h-[8rem] max-h-48 overflow-y-auto">
                                {subcategories.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No subcategories yet.</p>}
                                {subcategories.map((sub) => (
                                    <div key={sub.id} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm animate-fade-in">
                                        <span className="text-sm text-gray-800">{sub.name}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveSubcategory(sub.id)} 
                                            className="text-red-500 hover:text-red-700 font-bold p-1 rounded-full w-6 h-6 flex items-center justify-center"
                                            aria-label={`Remove ${sub.name}`}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 flex gap-2">
                                <input
                                    type="text"
                                    value={newSubcategoryName}
                                    onChange={e => {
                                        setNewSubcategoryName(e.target.value);
                                        setError(null);
                                    }}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubcategory(); }}}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent disabled:bg-gray-50"
                                    placeholder="Add a new subcategory"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSubcategory}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition"
                                >
                                    Add
                                </button>
                            </div>
                             {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                        </div>
                    </fieldset>

                    <div className="flex justify-end items-center p-6 border-t bg-gray-50 rounded-b-lg flex-shrink-0">
                        <button type="button" onClick={onClose} disabled={isSaving} className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition mr-3 disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={isSaving || !name.trim()} className="px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover transition w-28 text-center disabled:bg-indigo-400 disabled:cursor-not-allowed">
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryFormModal;