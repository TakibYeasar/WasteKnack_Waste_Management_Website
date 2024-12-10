'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '../../../redux/features/auth/authApi';
import { FaFacebook, FaGoogle, FaTwitter } from 'react-icons/fa';

const SignUp = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: '',
    });
    const [selectedRole, setSelectedRole] = useState('');

    const [registerUser, { isLoading, error: registerError }] = useRegisterMutation();

    const handleClose = () => {
        router.push('/');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirm_password) {
            alert('Passwords do not match!');
            return;
        }

        const signUpData = {
            ...formData,
            role: selectedRole || 'user',
        };

        try {
            const result = await registerUser(signUpData).unwrap();

            if (result?.message) {
                router.push('/sign-up/verify-email');
            }
        } catch (err) {
            alert('Sign up failed! Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative w-full max-w-lg bg-white shadow-lg rounded-lg p-8 max-h-[80vh] overflow-y-auto">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    &#x2715;
                </button>

                <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                    Create a new account
                </h2>

                {registerError && (
                    <div className="mb-4 text-center text-red-500">
                        {registerError?.data?.message || 'An error occurred'}
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Your Role <span className="text-red-500">*</span>
                    </label>
                    <div className="flex justify-center space-x-4">
                        {['user', 'collector'].map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setSelectedRole(role)}
                                className={`px-4 py-2 text-center w-1/2 border rounded-md focus:outline-none ${selectedRole === role
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-700 border-gray-300'
                                    } transition duration-300 ease-in-out`}
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleSignUpSubmit}>
                    {['email', 'username', 'first_name', 'last_name'].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {field.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type={field === 'email' ? 'email' : 'text'}
                                name={field}
                                required
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300"
                                placeholder={`Enter your ${field}`}
                            />
                        </div>
                    ))}

                    {['password', 'confirm_password'].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {field.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name={field}
                                required
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300"
                                placeholder={
                                    field === 'password'
                                        ? 'Enter your password'
                                        : 'Confirm your password'
                                }
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-3 rounded-md shadow-lg font-medium hover:bg-secondary transition duration-300"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 mb-4">Or sign up using</p>
                    <div className="flex justify-center space-x-4">
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-800 transition duration-300"
                        >
                            <FaFacebook size={24} />
                        </a>
                        <a
                            href="#"
                            className="text-red-500 hover:text-red-700 transition duration-300"
                        >
                            <FaGoogle size={24} />
                        </a>
                        <a
                            href="#"
                            className="text-blue-400 hover:text-blue-600 transition duration-300"
                        >
                            <FaTwitter size={24} />
                        </a>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Already have an account?
                        <Link
                            href="/sign-in"
                            className="text-primary font-medium ml-1 hover:text-secondary transition duration-300"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
