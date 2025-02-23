'use client'
import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Save, Briefcase, Settings, Bell, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: 'Administrator',
        notifications: true,
        autoApproveReports: false,
        assignTasksAutomatically: false,
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Load settings from LocalStorage on mount
        const savedSettings = localStorage.getItem('adminSettings')
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings))
        } else {
            // Default values
            setSettings({
                name: 'Admin User',
                email: 'admin@wastemanagement.com',
                phone: '+1 987 654 3210',
                address: '456 Greenway Blvd, EcoTown, 67890',
                role: 'Administrator',
                notifications: true,
                autoApproveReports: false,
                assignTasksAutomatically: false,
            })
        }
    }, [])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        const newSettings = { ...settings, [name]: type === 'checkbox' ? checked : value }
        setSettings(newSettings)
        localStorage.setItem('adminSettings', JSON.stringify(newSettings)) // Save to LocalStorage
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/settings/', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer YOUR_TOKEN_HERE`,
                },
                body: JSON.stringify(settings),
            })

            const data = await response.json()
            if (!response.ok) {
                toast.error('Failed to update settings.')
            } else {
                toast.success('Settings updated successfully!')
            }
        } catch (error) {
            toast.error('Error updating settings.')
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            className="p-8 max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">Admin Settings</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input Fields */}
                {[
                    { label: 'Full Name', name: 'name', type: 'text', icon: User },
                    { label: 'Email Address', name: 'email', type: 'email', icon: Mail },
                    { label: 'Phone Number', name: 'phone', type: 'tel', icon: Phone },
                    { label: 'Address', name: 'address', type: 'text', icon: MapPin },
                ].map(({ label, name, type, icon: Icon }) => (
                    <div key={name}>
                        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {label}
                        </label>
                        <div className="relative">
                            <input
                                type={type}
                                id={name}
                                name={name}
                                value={settings[name]}
                                onChange={handleInputChange}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
                            />
                            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>
                ))}

                {/* Role (Read-only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={settings.role}
                            readOnly
                            className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
                        />
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Checkboxes */}
                {[
                    { label: 'Receive email notifications', name: 'notifications', icon: Bell },
                    { label: 'Auto-approve waste reports', name: 'autoApproveReports', icon: Settings },
                    { label: 'Assign collection tasks automatically', name: 'assignTasksAutomatically', icon: Settings },
                ].map(({ label, name, icon: Icon }) => (
                    <div key={name} className="flex items-center">
                        <input
                            type="checkbox"
                            id={name}
                            name={name}
                            checked={settings[name]}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor={name} className="ml-2 block text-sm text-gray-700 dark:text-gray-300 items-center">
                            <Icon className="w-4 h-4 mr-1" />
                            {label}
                        </label>
                    </div>
                ))}

                {/* Save Button */}
                <button
                    type="submit"
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-200 ease-in-out"
                    disabled={loading}
                >
                    {loading ? (
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
    )
}
