import React from 'react';
import { useManageUsersQuery, useChangeUserRoleMutation, useRemoveUserMutation } from "../../../../store/features/user/userApi";
import { toast } from 'react-hot-toast';

const UserManagement = () => {
    const { data: users, error, isLoading } = useManageUsersQuery();
    const [changeUserRole] = useChangeUserRoleMutation();
    const [removeUser] = useRemoveUserMutation();

    const handleRoleChange = async (id, newRole) => {
        if (newRole !== "admin") return;
        try {
            await changeUserRole({ userId: String(id), role: newRole }).unwrap();
            toast.success("Role Updated Successfully!");
        } catch (err) {
            console.error("Failed to update role:", err);
            toast.error("Failed to update role.");
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await removeUser({ userId: id }).unwrap();
            toast.success("User removed successfully!");
        } catch (err) {
            console.error("Failed to remove user:", err);
            toast.error("Failed to remove user.");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="p-5 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-5">Manage Users</h1>
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">#</th>
                        <th className="border px-4 py-2">Username</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Role</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={user.id}>
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">{user.username}</td>
                                <td className="border px-4 py-2">{user.email}</td>
                                <td className="border px-4 py-2">
                                    {user.role === "admin" ? (
                                        "Admin"
                                    ) : (
                                        <select
                                            className="bg-white border px-2 py-1"
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        >
                                            <option >{user.role}</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {user.is_verified ? "Verified" : "Not Verified"}
                                </td>
                                <td className="border px-4 py-2 space-x-2">
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4">
                                No users available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;