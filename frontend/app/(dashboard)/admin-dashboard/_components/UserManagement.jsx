import React, { useState, useEffect } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    // Simulating fetching user data (replace with real API call)
    useEffect(() => {
        setTimeout(() => {
            setUsers([
                { id: 1, name: 'John Doe', role: 'User', status: 'Active' },
                { id: 2, name: 'Jane Smith', role: 'Collector', status: 'Inactive' },
                { id: 3, name: 'Michael Lee', role: 'User', status: 'Active' },
            ]);
            setIsLoading(false);
        }, 2000); // Simulating loading time
    }, []);

    // Handle user actions (add, update, delete)
    const handleAction = (action, userId) => {
        if (action === 'delete') {
            setUsers(users.filter(user => user.id !== userId));
        } else if (action === 'deactivate') {
            setUsers(users.map(user => user.id === userId ? { ...user, status: 'Inactive' } : user));
        } else if (action === 'activate') {
            setUsers(users.map(user => user.id === userId ? { ...user, status: 'Active' } : user));
        }
    };

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <p className="mb-4">Add, update, delete, or deactivate users and collectors. View user activity logs.</p>

            {isLoading ? (
                <div className="text-center text-lg font-semibold">Loading users...</div>
            ) : (
                <div>
                    {/* User List */}
                    <table className="min-w-full table-auto border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2 text-left">Name</th>
                                <th className="border border-gray-300 p-2 text-left">Role</th>
                                <th className="border border-gray-300 p-2 text-left">Status</th>
                                <th className="border border-gray-300 p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-gray-200">
                                    <td className="p-2">{user.name}</td>
                                    <td className="p-2">{user.role}</td>
                                    <td className="p-2">
                                        <span className={`p-2 text-white rounded ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                                            onClick={() => handleAction(user.status === 'Active' ? 'deactivate' : 'activate', user.id)}
                                        >
                                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                            onClick={() => handleAction('delete', user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Update User Modal */}
                    {selectedUser && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
                            <div className="bg-white p-6 rounded shadow-md w-1/3">
                                <h3 className="text-xl font-bold mb-4">Update User</h3>
                                <div className="mb-4">
                                    <label className="block mb-2">Name</label>
                                    <input
                                        type="text"
                                        className="border border-gray-300 p-2 w-full"
                                        value={selectedUser.name}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Role</label>
                                    <select
                                        className="border border-gray-300 p-2 w-full"
                                        value={selectedUser.role}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                    >
                                        <option value="User">User</option>
                                        <option value="Collector">Collector</option>
                                    </select>
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                        onClick={() => setSelectedUser(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleAction('update', selectedUser.id)}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserManagement;
