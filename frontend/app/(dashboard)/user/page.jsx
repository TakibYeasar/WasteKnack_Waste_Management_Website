"use client";

import React, { useState } from "react";
import ProfileManagement from "./components/ProfileManagement";
import PickupStatusTracking from "./components/PickupStatusTracking";
import PaymentHistory from "./components/PaymentHistory";
import FeedbackAndRatings from "./components/FeedbackAndRatings";

const UserDashboard = () => {
    const [activeSection, setActiveSection] = useState("profile");

    const sections = [
        { key: "profile", label: "Profile Management", component: <ProfileManagement /> },
        { key: "tracking", label: "Pickup Status Tracking", component: <PickupStatusTracking /> },
        { key: "payment", label: "Payment History", component: <PaymentHistory /> },
        { key: "feedback", label: "Feedback & Ratings", component: <FeedbackAndRatings /> },
    ];

    const Sidebar = () => (
        <div className="w-1/4 bg-green-800 text-white min-h-screen p-5">
            <h2 className="text-2xl font-bold mb-5">User Dashboard</h2>
            <ul className="space-y-4">
                {sections.map((section) => (
                    <li key={section.key}>
                        <button
                            className={`w-full text-left p-2 rounded hover:bg-green-700 ${activeSection === section.key ? "bg-green-600" : ""
                                }`}
                            onClick={() => setActiveSection(section.key)}
                        >
                            {section.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

    const ContentArea = () => (
        <div className="w-3/4 p-5 bg-gray-100 min-h-screen">
            {sections.find((section) => section.key === activeSection)?.component}
        </div>
    );

    return (
        <div className="flex">
            <Sidebar />
            <ContentArea />
        </div>
    );
};

export default UserDashboard;
