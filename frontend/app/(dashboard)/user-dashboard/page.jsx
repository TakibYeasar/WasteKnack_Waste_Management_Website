"use client";

import React, { useState } from "react";
import ProfileManagement from "./_components/ProfileManagement";
import PickupStatusTracking from "./_components/PickupStatusTracking";
import PaymentHistory from "./_components/PaymentHistory";
import FeedbackAndRatings from "./_components/FeedbackAndRatings";

const UserDashboard = () => {
    const [activeSection, setActiveSection] = useState("dashboard");

    const sections = [
        { key: "dashboard", label: "Dashboard", component: <PickupStatusTracking /> },
        { key: "profile", label: "Profile Management", component: <ProfileManagement /> },
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
