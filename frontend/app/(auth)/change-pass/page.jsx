'use client';

import React, { useState } from 'react';
import { useChangePasswordMutation } from '../../../redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [changePassword, { isLoading, isError, error }] = useChangePasswordMutation();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            await changePassword({
                current_password: currentPassword,
                new_password: newPassword,
            }).unwrap();
            router.push('/profile');
        } catch (err) {
            console.error('Error changing password:', err);
            alert('Error changing password, please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Change Your Password</h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-secondary transition duration-300"
                    >
                        {isLoading ? 'Changing Password...' : 'Change Password'}
                    </button>

                    {isError && <p className="text-red-500 text-center mt-2">{error?.data?.message || 'An error occurred'}</p>}
                </form>

                <div className="text-center mt-6">
                    <a href="/profile" className="text-sm text-primary hover:text-secondary transition duration-300">
                        Back to Profile
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;