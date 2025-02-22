"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { useCurrentUserQuery } from "@/store/features/auth/authApi";

export default function RootPageLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { data: user, isLoading } = useCurrentUserQuery();

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="flex flex-1">
            {/* Show Sidebar only if the user is logged in */}
            {user && (
                <Sidebar
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                />
            )}

            {/* Main Content */}
            <main className={`flex-1 p-4 lg:p-8 transition-all duration-300 ${user ? "ml-0 lg:ml-64" : ""}`}>
                {children}
            </main>
        </div>
    );
}
