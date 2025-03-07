'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequestPasswordResetMutation } from '../../../store/features/auth/authApi';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sendResetLink, { isLoading, error }] = useRequestPasswordResetMutation();
    const router = useRouter();

    const handleClose = () => {
        router.push('/');
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await sendResetLink({ email }).unwrap();
            setMessage(response.message); // Success message
        } catch (err) {
            setMessage(err.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    &#x2715; {/* Close icon */}
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                    Forgot Password
                </h2>
                <p className="text-center text-gray-600 mb-4">
                    Enter your email address below, and we’ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-secondary transition duration-300"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                {message && (
                    <div className="mt-4 text-center text-sm">
                        <p className={message.includes('error') ? 'text-red-500' : 'text-green-500'}>
                            {message}
                        </p>
                    </div>
                )}

                <div className="text-center mt-6">
                    <a
                        href="/sign-in"
                        className="text-sm text-primary hover:text-secondary transition duration-300"
                    >
                        Remember your password? Sign in
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
