import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AnalyticsReporting = () => {
    const [wasteData, setWasteData] = useState([]);
    const [userActivityData, setUserActivityData] = useState([]);
    const [collectorPerformanceData, setCollectorPerformanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate fetching data (replace with real API calls)
    useEffect(() => {
        setTimeout(() => {
            setWasteData([10, 20, 30, 40, 50, 60, 70]); // Example data for waste collection
            setUserActivityData([5, 15, 25, 35, 45, 55, 65]); // Example data for user activity
            setCollectorPerformanceData([8, 18, 28, 38, 48, 58, 68]); // Example data for collector performance
            setIsLoading(false);
        }, 2000); // Simulating loading time
    }, []);

    // Chart data configuration for waste collection trends
    const wasteChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Example months
        datasets: [
            {
                label: 'Waste Collected (Tons)',
                data: wasteData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1,
            },
        ],
    };

    // Chart data configuration for user activity
    const userActivityChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Example months
        datasets: [
            {
                label: 'User Activity (Logins)',
                data: userActivityData,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
                tension: 0.1,
            },
        ],
    };

    // Chart data configuration for collector performance
    const collectorPerformanceChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Example months
        datasets: [
            {
                label: 'Completed Pickups',
                data: collectorPerformanceData,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: true,
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Analytics & Reporting</h2>
            <p className="mb-4">View reports on waste collection trends, user activity, and performance of collectors.</p>

            {isLoading ? (
                <div className="text-center text-lg font-semibold">Loading analytics data...</div>
            ) : (
                <div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Waste Collection Trends</h3>
                        <Line data={wasteChartData} options={{ responsive: true }} />
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">User Activity</h3>
                        <Line data={userActivityChartData} options={{ responsive: true }} />
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Collector Performance</h3>
                        <Line data={collectorPerformanceChartData} options={{ responsive: true }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsReporting;
