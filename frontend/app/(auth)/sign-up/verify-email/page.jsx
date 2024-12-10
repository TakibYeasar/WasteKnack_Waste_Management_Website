'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVerifyEmailMutation } from '../../../../redux/features/auth/authApi';

const EmailVerification = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const [verifyEmail, { isLoading, error }] = useVerifyEmailMutation();

    const handleOtpChange = (e) => setOtp(e.target.value);

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const response = await verifyEmail({ otp }).unwrap();
            setMessage(response.message);
            // Redirect to /signin after successful verification
            setTimeout(() => router.push('/sign-in'), 2000);
        } catch (err) {
            const errorMessage = err.message || 'Invalid OTP. Please try again.';
            setMessage(errorMessage);
        }
    };

    const handleClose = () => router.push('/');

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Close"
                >
                    &#x2715;
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Verify Your Email
                </h2>

                <form onSubmit={handleVerify} className="space-y-5">
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter OTP <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition duration-300"
                            placeholder="Enter the OTP sent to your email"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 bg-primary text-white font-semibold rounded-md shadow transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>

                    {message && (
                        <p className={`mt-4 text-center text-sm ${message.includes('Invalid') ? 'text-red-500' : 'text-green-500'}`}>
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="mt-4 text-center text-sm text-red-500">
                            {error.message || 'An error occurred. Please try again.'}
                        </p>
                    )}
                </form>

                <button
                    onClick={handleClose}
                    className="w-full mt-6 text-sm text-gray-600 hover:text-gray-800 transition duration-300"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EmailVerification;