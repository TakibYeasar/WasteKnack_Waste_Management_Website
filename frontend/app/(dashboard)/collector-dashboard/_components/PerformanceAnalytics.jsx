import React, { useState } from 'react';

const PerformanceAnalytics = () => {
    const [completedPickups, setCompletedPickups] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [earnings, setEarnings] = useState(0);

    const fetchAnalytics = () => {
        // Simulate fetching performance data (replace with actual API call)
        setCompletedPickups(120);
        setAverageRating(4.7);
        setEarnings(320.50);
    };

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Performance Analytics</h2>
            <p className="mb-4">View statistics on completed pickups, ratings, and earnings.</p>

            <div className="space-y-4">
                <button
                    onClick={fetchAnalytics}
                    className="bg-blue-600 text-white p-2 rounded-lg w-full"
                >
                    Fetch Performance Data
                </button>

                <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">Completed Pickups:</span>
                        <span className="text-gray-900">{completedPickups}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">Average Rating:</span>
                        <span className="text-gray-900">{averageRating} / 5</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">Earnings:</span>
                        <span className="text-gray-900">${earnings.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceAnalytics;
