import React from 'react';
import { useDashboardOverviewQuery } from '@/store/features/waste/wasteApi';

const DashboardOverview = () => {
    // Fetching statistics using RTK query hook
    const { data, error, isLoading } = useDashboardOverviewQuery();

    // Handling loading and error states
    if (isLoading) {
        return (
            <div className="p-5 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
                <div className="text-center text-lg font-semibold">Loading data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
                <div className="text-center text-lg font-semibold text-red-500">
                    Error fetching data. Please try again later.
                </div>
            </div>
        );
    }

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
            <p className="mb-4">Overview of key statistics: Number of users, reports, pending and progress reports, etc.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Total Users */}
                <div className="bg-blue-100 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Users</h3>
                    <p className="text-2xl font-bold">{data.total_users}</p>
                </div>

                {/* Total Reports */}
                <div className="bg-green-100 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Reports</h3>
                    <p className="text-2xl font-bold">{data.total_reports}</p>
                </div>

                {/* Pending Reports */}
                <div className="bg-yellow-100 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Pending Reports</h3>
                    <p className="text-2xl font-bold">{data.pending_report}</p>
                </div>

                {/* Progress Reports */}
                <div className="bg-orange-100 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">In-Progress Reports</h3>
                    <p className="text-2xl font-bold">{data.progress_report}</p>
                </div>

                {/* Collected Waste */}
                <div className="bg-red-100 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Collected Waste</h3>
                    <p className="text-2xl font-bold">{data.collected_waste}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
