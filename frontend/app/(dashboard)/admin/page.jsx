"use client";

import React, { useState } from "react";
import DashboardOverview from "./components/DashboardOverview";
import UserManagement from "./components/UserManagement";
import WastePickupManagement from "./components/WastePickupManagement";
import AnalyticsReporting from "./components/AnalyticsReporting";
import ContentManagement from "./components/ContentManagement";
import SystemSettings from "./components/SystemSettings";

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("dashboard");

    const sections = [
        { key: "dashboard", label: "Dashboard", component: <DashboardOverview /> },
        { key: "users", label: "User Management", component: <UserManagement /> },
        { key: "pickups", label: "Waste Pickup Management", component: <WastePickupManagement /> },
        { key: "analytics", label: "Analytics & Reporting", component: <AnalyticsReporting /> },
        { key: "content", label: "Content Management", component: <ContentManagement /> },
        { key: "settings", label: "System Settings", component: <SystemSettings /> },
    ];

    const Sidebar = () => (
        <div className="w-1/4 bg-gray-800 text-white min-h-screen p-5">
            <h2 className="text-2xl font-bold mb-5">Admin Dashboard</h2>
            <ul className="space-y-4">
                {sections.map((section) => (
                    <li key={section.key}>
                        <button
                            className={`w-full text-left p-2 rounded hover:bg-gray-700 ${activeSection === section.key ? "bg-gray-600" : ""
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

export default AdminDashboard;
