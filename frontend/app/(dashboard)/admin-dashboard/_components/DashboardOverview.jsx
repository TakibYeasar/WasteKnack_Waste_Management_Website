import React, { useState, useEffect } from 'react';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCollectors: 0,
        completedPickups: 0,
        pendingPickups: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Fetching statistics (replace with actual API call)
    useEffect(() => {
        setTimeout(() => {
            setStats({
                totalUsers: 1200,
                totalCollectors: 50,
                completedPickups: 900,
                pendingPickups: 150,
            });
            setIsLoading(false);
        }, 2000); // Simulating loading time
    }, []);

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
            <p className="mb-4">Overview of key statistics: Number of users, collectors, completed pickups, etc.</p>

            {isLoading ? (
                <div className="text-center text-lg font-semibold">Loading data...</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {/* Total Users */}
                    <div className="bg-blue-100 p-4 rounded shadow">
                        <h3 className="text-lg font-semibold">Total Users</h3>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>

                    {/* Total Collectors */}
                    <div className="bg-green-100 p-4 rounded shadow">
                        <h3 className="text-lg font-semibold">Total Collectors</h3>
                        <p className="text-2xl font-bold">{stats.totalCollectors}</p>
                    </div>

                    {/* Completed Pickups */}
                    <div className="bg-yellow-100 p-4 rounded shadow">
                        <h3 className="text-lg font-semibold">Completed Pickups</h3>
                        <p className="text-2xl font-bold">{stats.completedPickups}</p>
                    </div>

                    {/* Pending Pickups */}
                    <div className="bg-red-100 p-4 rounded shadow">
                        <h3 className="text-lg font-semibold">Pending Pickups</h3>
                        <p className="text-2xl font-bold">{stats.pendingPickups}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardOverview;
