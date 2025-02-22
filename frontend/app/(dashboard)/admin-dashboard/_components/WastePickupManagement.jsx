import React, { useState, useEffect } from 'react';

const WastePickupManagement = () => {
    const [pickups, setPickups] = useState([]);
    const [collectors, setCollectors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Simulating fetching pickup and collector data (replace with real API calls)
    useEffect(() => {
        setTimeout(() => {
            setPickups([
                { id: 1, address: '123 Elm Street', wasteType: 'Plastic', scheduledTime: '2025-01-20 10:00 AM', status: 'Pending', collector: null },
                { id: 2, address: '456 Oak Avenue', wasteType: 'Organic', scheduledTime: '2025-01-20 11:00 AM', status: 'Assigned', collector: 'John Doe' },
                { id: 3, address: '789 Pine Road', wasteType: 'Paper', scheduledTime: '2025-01-21 9:00 AM', status: 'Pending', collector: null },
            ]);
            setCollectors([
                { id: 1, name: 'John Doe' },
                { id: 2, name: 'Jane Smith' },
                { id: 3, name: 'Michael Lee' },
            ]);
            setIsLoading(false);
        }, 2000); // Simulating loading time
    }, []);

    // Handle actions (assign, update status)
    const handleAction = (action, pickupId, collectorName) => {
        if (action === 'assign') {
            setPickups(pickups.map(pickup =>
                pickup.id === pickupId ? { ...pickup, collector: collectorName, status: 'Assigned' } : pickup
            ));
        } else if (action === 'updateStatus') {
            setPickups(pickups.map(pickup =>
                pickup.id === pickupId ? { ...pickup, status: 'Completed' } : pickup
            ));
        }
    };

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Waste Pickup Management</h2>
            <p className="mb-4">Assign pickup requests to collectors. Monitor pickup statuses.</p>

            {isLoading ? (
                <div className="text-center text-lg font-semibold">Loading pickup data...</div>
            ) : (
                <div>
                    {/* Pickup List */}
                    <table className="min-w-full table-auto border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2 text-left">Address</th>
                                <th className="border border-gray-300 p-2 text-left">Waste Type</th>
                                <th className="border border-gray-300 p-2 text-left">Scheduled Time</th>
                                <th className="border border-gray-300 p-2 text-left">Status</th>
                                <th className="border border-gray-300 p-2 text-left">Collector</th>
                                <th className="border border-gray-300 p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pickups.map((pickup) => (
                                <tr key={pickup.id} className="border-b border-gray-200">
                                    <td className="p-2">{pickup.address}</td>
                                    <td className="p-2">{pickup.wasteType}</td>
                                    <td className="p-2">{pickup.scheduledTime}</td>
                                    <td className="p-2">
                                        <span className={`p-2 text-white rounded ${pickup.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                            {pickup.status}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        {pickup.collector || 'Not Assigned'}
                                    </td>
                                    <td className="p-2">
                                        {pickup.status === 'Pending' && (
                                            <select
                                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                                onChange={(e) => handleAction('assign', pickup.id, e.target.value)}
                                            >
                                                <option value="">Assign Collector</option>
                                                {collectors.map(collector => (
                                                    <option key={collector.id} value={collector.name}>{collector.name}</option>
                                                ))}
                                            </select>
                                        )}
                                        {pickup.status !== 'Completed' && pickup.status !== 'Pending' && (
                                            <button
                                                className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                                                onClick={() => handleAction('updateStatus', pickup.id)}
                                            >
                                                Mark as Completed
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default WastePickupManagement;
