
import React, { useState, useEffect, useMemo } from 'react';
import type { Product, Category } from '../types';

interface ProductFormModalProps {
    product: Product | null;
    categories: Category[];
    onSave: (productData: Product | Omit<Product, 'id' | 'rating' | 'reviews'>) => void;
    onClose: () => void;
    isSaving: boolean;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, categories, onSave, onClose, isSaving }) => {
    const getInitialState = () => {
        if (product) {
            const subImages = [...(product.subImageUrls || [])];
            while (subImages.length < 3) {
                subImages.push('');
            }
            return { ...product, subImageUrls: subImages.slice(0, 3) };
        }
        return {
            name: '',
            description: '',
            price: 0,
            category: categories[0]?.name || '',
            subcategory: '',
            imageUrl: '',
            subImageUrls: ['', '', ''],
            rating: 0,
            reviews: 0,
        };
    };

    const [formData, setFormData] = useState<Omit<Product, 'id' | 'subcategory'> & { subcategory?: string } | Product>(getInitialState);

    useEffect(() => {
        setFormData(getInitialState());
    }, [product]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value };
            if (name === 'category') {
                newState.subcategory = ''; // Reset subcategory when main category changes
            }
            return newState;
        });
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => { // -1 for main, 0-2 for sub
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setFormData(prev => {
                const newFormState = { ...prev };
                if (index === -1) { // Main image
                    newFormState.imageUrl = result;
                } else { // Sub image
                    const newSubImages = [...(newFormState.subImageUrls || [])];
                    newSubImages[index] = result;
                    newFormState.subImageUrls = newSubImages;
                }
                return newFormState;
            });
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveSubImage = (index: number) => {
        setFormData(prev => {
            const newSubImages = [...(prev.subImageUrls || [])];
            newSubImages[index] = '';
            return { ...prev, subImageUrls: newSubImages };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;
        if (!formData.imageUrl) {
            alert("Please upload a main image for the product.");
            return;
        }
        const dataToSave = {
            ...formData,
            subcategory: formData.subcategory || undefined, // Ensure it's undefined if empty
            subImageUrls: formData.subImageUrls.filter(Boolean)
        };
        onSave(dataToSave as any); // Cast to handle the Omit type
    };

    const availableSubcategories = useMemo(() => {
        const selectedCat = categories.find(c => c.name === formData.category);
        return selectedCat?.subcategories || [];
    }, [formData.category, categories]);

    const title = product ? 'Edit Product' : 'Add New Product';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={isSaving ? undefined : onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-semibold text-primary">{title}</h2>
                        <button type="button" onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    
                    <fieldset disabled={isSaving} className="p-6 md:p-8 flex-grow overflow-y-auto space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleTextChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent disabled:bg-gray-50"/>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" id="description" value={formData.description} onChange={handleTextChange} required rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent disabled:bg-gray-50"></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                                <input type="number" name="price" id="price" value={formData.price} onChange={handleTextChange} required min="0" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent disabled:bg-gray-50"/>
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <select name="category" id="category" value={formData.category} onChange={handleTextChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent bg-white disabled:bg-gray-50">
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Subcategory</label>
                                <select name="subcategory" id="subcategory" value={formData.subcategory} onChange={handleTextChange} disabled={availableSubcategories.length === 0} required={availableSubcategories.length > 0} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed">
                                    <option value="">Select subcategory...</option>
                                    {availableSubcategories.map(sub => (
                                        <option key={sub.id} value={sub.name}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="imageUploadMain" className="block text-sm font-medium text-gray-700">Main Image</label>
                            <input 
                                type="file" 
                                name="imageUploadMain" 
                                id="imageUploadMain" 
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, -1)} 
                                className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 disabled:opacity-50"
                            />
                             {formData.imageUrl && <img src={formData.imageUrl} alt="Main preview" className="mt-2 rounded-md max-h-40 object-contain mx-auto bg-gray-50 p-1 border" />}
                        </div>
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Sub Images (up to 3)</label>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {(formData.subImageUrls || ['', '', '']).map((imgUrl, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="relative">
                                            {imgUrl && (
                                                <div className="relative group">
                                                    <img src={imgUrl} alt={`Sub Preview ${index + 1}`} className="rounded-md h-24 w-full object-cover bg-gray-50 p-1 border" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSubImage(index)}
                                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                        aria-label={`Remove sub image ${index + 1}`}
                                                    >&times;</button>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                id={`subImageUpload-${index}`}
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, index)}
                                                className={`mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-accent hover:file:bg-indigo-100 disabled:opacity-50 ${imgUrl ? 'mt-2' : ''}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </fieldset>

                    <div className="flex justify-end items-center p-6 border-t bg-gray-50 rounded-b-lg">
                        <button type="button" onClick={onClose} disabled={isSaving} className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition mr-3 disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover transition w-36 text-center disabled:bg-indigo-400 disabled:cursor-not-allowed">
                            {isSaving ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
