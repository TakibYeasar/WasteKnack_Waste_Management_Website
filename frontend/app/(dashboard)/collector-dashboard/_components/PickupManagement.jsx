import React, { useState } from "react";

const PickupManagement = () => {
    const [pickups, setPickups] = useState([
        {
            id: 1,
            userName: "John Doe",
            address: "123 Elm St, Springfield",
            wasteType: "Recyclable",
            scheduledTime: "2025-01-20 10:00 AM",
            status: "Pending",
        },
        {
            id: 2,
            userName: "Jane Smith",
            address: "456 Oak St, Rivertown",
            wasteType: "Organic",
            scheduledTime: "2025-01-21 2:00 PM",
            status: "Pending",
        },
    ]);

    const handleStatusChange = (id, newStatus) => {
        setPickups(pickups.map((pickup) =>
            pickup.id === id ? { ...pickup, status: newStatus } : pickup
        ));
    };

    const handleMarkAsCompleted = (id) => {
        setPickups(pickups.map((pickup) =>
            pickup.id === id ? { ...pickup, status: "Completed" } : pickup
        ));
    };

    return (
        <div className="bg-white p-5 shadow rounded">
            <h2 className="text-2xl font-bold mb-6">Pickup Management</h2>

            {pickups.length === 0 ? (
                <p>No pickups assigned at the moment.</p>
            ) : (
                <ul className="space-y-4">
                    {pickups.map((pickup) => (
                        <li
                            key={pickup.id}
                            className="border-b py-4 flex justify-between items-center"
                        >
                            <div className="space-y-2">
                                <p className="font-semibold">{pickup.userName}</p>
                                <p className="text-gray-600">{pickup.address}</p>
                                <p className="text-gray-600">Waste Type: {pickup.wasteType}</p>
                                <p className="text-gray-600">Scheduled Time: {pickup.scheduledTime}</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <p
                                    className={`text-sm font-semibold mb-2 ${pickup.status === "Completed"
                                            ? "text-green-600"
                                            : pickup.status === "In Progress"
                                                ? "text-yellow-600"
                                                : "text-gray-600"
                                        }`}
                                >
                                    Status: {pickup.status}
                                </p>

                                {pickup.status !== "Completed" && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleStatusChange(pickup.id, "In Progress")}
                                            className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                                        >
                                            In Progress
                                        </button>
                                        <button
                                            onClick={() => handleMarkAsCompleted(pickup.id)}
                                            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                                        >
                                            Complete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PickupManagement;
