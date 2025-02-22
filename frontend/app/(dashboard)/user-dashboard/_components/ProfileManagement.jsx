import React, { useState } from 'react';

const ProfileManagement = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulate form submission (replace with actual API call)
        setMessage('Profile updated successfully!');
    };

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Profile Management</h2>
            <p className="mb-4">Update personal information like name, address, and contact info.</p>

            {/* Form for updating profile */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Info</label>
                    <input
                        type="text"
                        id="contact"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="Enter your contact information"
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded-lg w-full mt-4"
                >
                    Update Profile
                </button>
            </form>

            {/* Display message after form submission */}
            {message && (
                <div className="mt-4 text-green-500 font-semibold">
                    {message}
                </div>
            )}
        </div>
    );
};

export default ProfileManagement;
