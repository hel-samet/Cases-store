
import React from 'react';
import type { User } from '../types';

interface UserManagerProps {
    currentUser: User;
    users: User[];
    onAddUser: () => void;
    onDeleteUser: (userId: string) => Promise<void>;
    onEditUser: (user: User) => void;
}

const UserManager: React.FC<UserManagerProps> = ({ currentUser, users, onAddUser, onDeleteUser, onEditUser }) => {

    const handleDeleteClick = async (userToDelete: User) => {
        if (userToDelete.id === currentUser.id) {
            alert("You cannot delete your own account.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete the user "${userToDelete.email}"? This action cannot be undone.`)) {
            try {
                await onDeleteUser(userToDelete.id);
            } catch (error) {
                const message = error instanceof Error ? error.message : "An unknown error occurred.";
                console.error("Failed to delete user:", error);
                alert(`Error: Could not delete user.\n${message}`);
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Manage Users</h2>
                <button
                    onClick={onAddUser}
                    className="px-5 py-2 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover transition flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Add New User
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.email} {user.id === currentUser.id && <span className="text-xs text-gray-500">(You)</span>}</div>
                                    <div className="text-sm text-gray-500">{user.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'superadmin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                     <button 
                                        onClick={() => onEditUser(user)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClick(user)} 
                                        className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                                        disabled={user.id === currentUser.id || user.role === 'superadmin'}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManager;
