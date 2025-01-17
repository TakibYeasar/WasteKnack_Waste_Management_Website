import React, { useState } from 'react';

const ContentManagement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [faq, setFaq] = useState([]);
    const [helpSections, setHelpSections] = useState([]);

    const handleAddAnnouncement = () => {
        // Logic to add an announcement
    };

    const handleEditAnnouncement = (id) => {
        // Logic to edit an announcement
    };

    const handleDeleteAnnouncement = (id) => {
        // Logic to delete an announcement
    };

    const handleAddFaq = () => {
        // Logic to add an FAQ
    };

    const handleEditFaq = (id) => {
        // Logic to edit an FAQ
    };

    const handleDeleteFaq = (id) => {
        // Logic to delete an FAQ
    };

    const handleAddHelpSection = () => {
        // Logic to add a help section
    };

    const handleEditHelpSection = (id) => {
        // Logic to edit a help section
    };

    const handleDeleteHelpSection = (id) => {
        // Logic to delete a help section
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Content Management</h2>

            <div className="my-4">
                <h3 className="text-lg font-semibold">Announcements</h3>
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                    onClick={handleAddAnnouncement}
                >
                    Add Announcement
                </button>
                <div className="mt-4">
                    {announcements.length === 0 ? (
                        <p>No announcements available.</p>
                    ) : (
                        <ul>
                            {announcements.map((announcement, index) => (
                                <li key={index} className="flex justify-between items-center mb-2">
                                    <span>{announcement}</span>
                                    <div className="flex space-x-2">
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1 rounded-md"
                                            onClick={() => handleEditAnnouncement(index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded-md"
                                            onClick={() => handleDeleteAnnouncement(index)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="my-4">
                <h3 className="text-lg font-semibold">FAQs</h3>
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                    onClick={handleAddFaq}
                >
                    Add FAQ
                </button>
                <div className="mt-4">
                    {faq.length === 0 ? (
                        <p>No FAQs available.</p>
                    ) : (
                        <ul>
                            {faq.map((question, index) => (
                                <li key={index} className="flex justify-between items-center mb-2">
                                    <span>{question}</span>
                                    <div className="flex space-x-2">
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1 rounded-md"
                                            onClick={() => handleEditFaq(index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded-md"
                                            onClick={() => handleDeleteFaq(index)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="my-4">
                <h3 className="text-lg font-semibold">Help Sections</h3>
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                    onClick={handleAddHelpSection}
                >
                    Add Help Section
                </button>
                <div className="mt-4">
                    {helpSections.length === 0 ? (
                        <p>No help sections available.</p>
                    ) : (
                        <ul>
                            {helpSections.map((section, index) => (
                                <li key={index} className="flex justify-between items-center mb-2">
                                    <span>{section}</span>
                                    <div className="flex space-x-2">
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1 rounded-md"
                                            onClick={() => handleEditHelpSection(index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded-md"
                                            onClick={() => handleDeleteHelpSection(index)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;
