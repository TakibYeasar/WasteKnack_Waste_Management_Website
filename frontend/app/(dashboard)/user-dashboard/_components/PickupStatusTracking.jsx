import React, { useState, useEffect } from 'react';

const PickupStatusTracking = () => {
    const [pickupRequests, setPickupRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simulate fetching pickup request data (replace with actual API call)
    useEffect(() => {
        // Example data: Normally, you would fetch this from an API
        const fetchedRequests = [
            { id: 1, wasteType: 'Organic', status: 'Pending', pickupTime: '2025-01-20T10:00' },
            { id: 2, wasteType: 'Recyclable', status: 'Assigned', pickupTime: '2025-01-21T12:00' },
            { id: 3, wasteType: 'Hazardous', status: 'Completed', pickupTime: '2025-01-15T09:00' },
        ];

        setPickupRequests(fetchedRequests);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="p-5 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Pickup Status Tracking</h2>
                <p>Loading your pickup status...</p>
            </div>
        );
    }

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Pickup Status Tracking</h2>
            <p className="mb-4">Check the status of your pickup requests (pending, assigned, completed).</p>

            {/* Table for displaying pickup request status */}
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border-b py-2 px-4 text-left">Waste Type</th>
                        <th className="border-b py-2 px-4 text-left">Pickup Time</th>
                        <th className="border-b py-2 px-4 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {pickupRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-100">
                            <td className="border-b py-2 px-4">{request.wasteType}</td>
                            <td className="border-b py-2 px-4">{new Date(request.pickupTime).toLocaleString()}</td>
                            <td className={`border-b py-2 px-4 ${getStatusClass(request.status)}`}>
                                {request.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Helper function to determine the status styling
const getStatusClass = (status) => {
    switch (status) {
        case 'Pending':
            return 'text-yellow-500';
        case 'Assigned':
            return 'text-blue-500';
        case 'Completed':
            return 'text-green-500';
        default:
            return '';
    }
};

export default PickupStatusTracking;
