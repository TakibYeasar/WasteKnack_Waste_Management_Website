import React, { useState } from "react";

const ProfileManagement = () => {
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        address: "",
    });
    const [successMessage, setSuccessMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate an API call
        setTimeout(() => {
            setSuccessMessage("Profile updated successfully!");
        }, 500);
    };

    return (
        <div className="bg-white p-5 shadow rounded">
            <h2 className="text-2xl font-bold mb-6">Profile Management</h2>
            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                {/* Contact */}
                <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                        Contact Number
                    </label>
                    <input
                        type="tel"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="Enter your contact number"
                        required
                        pattern="[0-9]{10}"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                    <small className="text-gray-500">Format: 10-digit phone number</small>
                </div>

                {/* Address */}
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                        required
                        rows="3"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-green-500 focus:border-green-500"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                    >
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileManagement;
