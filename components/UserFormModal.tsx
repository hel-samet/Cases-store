import React, { useState } from 'react';
import type { User } from '../types';

interface UserFormModalProps {
    onAddUser: (userData: Omit<User, 'id'>) => Promise<void>;
    onClose: () => void;
    existingUsers: User[];
}

const UserFormModal: React.FC<UserFormModalProps> = ({ onAddUser, onClose, existingUsers }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError("Email and password cannot be empty.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if(existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            setError("A user with this email already exists.");
            return;
        }

        setIsSaving(true);
        try {
            await onAddUser({ email, password });
            onClose();
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={isSaving ? undefined : onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-semibold text-primary">Add New User</h2>
                        <button type="button" onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    
                    <fieldset disabled={isSaving} className="p-6 md:p-8 flex-grow space-y-4">
                        {error && (
                            <div className="p-3 text-sm font-medium text-red-800 bg-red-100 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent disabled:bg-gray-50"
                            />
                        </div>
                         <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent disabled:bg-gray-50"
                            />
                        </div>
                         <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                id="confirmPassword" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent disabled:bg-gray-50"
                            />
                        </div>
                    </fieldset>

                    <div className="flex justify-end items-center p-6 border-t bg-gray-50 rounded-b-lg">
                        <button type="button" onClick={onClose} disabled={isSaving} className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition mr-3 disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover transition w-28 text-center disabled:bg-indigo-400 disabled:cursor-not-allowed">
                            {isSaving ? 'Saving...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;
