'use client'
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Briefcase, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '@/store/features/user/userApi';

export default function SettingsPage() {
    const { data: profile, isLoading } = useGetUserProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
    const [settings, setSettings] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        collection_area: '',
        vehicle_number: '',
        license_number: '',
        waste_collection_frequency: ''
    });

    useEffect(() => {
        if (profile) {
            setSettings({
                first_name: profile.user.first_name || '',
                last_name: profile.user.last_name || '',
                email: profile.user.email || '',
                phone: profile.phone_number || '',
                address: profile.address || '',
                role: profile.user.role || '',
                collection_area: profile.collection_area || '',
                vehicle_number: profile.vehicle_number || '',
                license_number: profile.license_number || '',
                waste_collection_frequency: profile.waste_collection_frequency || ''
            });
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({
                first_name: settings.first_name,
                last_name: settings.last_name,
                phone_number: settings.phone,
                address: settings.address,
                collection_area: settings.collection_area,
                vehicle_number: settings.vehicle_number,
                license_number: settings.license_number,
                waste_collection_frequency: settings.waste_collection_frequency
            }).unwrap();
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            </div>
        );
    }

    return (
        <motion.div
            className="p-8 max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">Settings</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={settings.first_name}
                            onChange={handleInputChange}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md text-gray-900 dark:text-white"
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={settings.last_name}
                            onChange={handleInputChange}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md text-gray-900 dark:text-white"
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={settings.email}
                            onChange={handleInputChange}
                            readOnly
                            className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Phone Number */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                    </label>
                    <div className="relative">
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={settings.phone}
                            onChange={handleInputChange}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={settings.address}
                            onChange={handleInputChange}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Role (Read-Only) */}
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="role"
                            value={settings.role}
                            readOnly
                            className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
                        />
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Additional Fields for Specific Roles */}
                {settings.role === 'collector' && (
                    <>
                        <div>
                            <label htmlFor="collection_area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Collection Area
                            </label>
                            <input
                                type="text"
                                id="collection_area"
                                name="collection_area"
                                value={settings.collection_area}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="vehicle_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Vehicle Number
                            </label>
                            <input
                                type="text"
                                id="vehicle_number"
                                name="vehicle_number"
                                value={settings.vehicle_number}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="license_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                License Number
                            </label>
                            <input
                                type="text"
                                id="license_number"
                                name="license_number"
                                value={settings.license_number}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
                            />
                        </div>
                    </>
                )}

                {settings.role === 'user' && (
                    <div>
                        <label htmlFor="waste_collection_frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Waste Collection Frequency
                        </label>
                        <input
                            type="text"
                            id="waste_collection_frequency"
                            name="waste_collection_frequency"
                            value={settings.waste_collection_frequency}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-200 ease-in-out"
                    disabled={isUpdating}
                >
                    {isUpdating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
}
