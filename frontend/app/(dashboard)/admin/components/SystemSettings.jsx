import React, { useState } from 'react';

const SystemSettings = () => {
    const [pickupFee, setPickupFee] = useState(10); // Default fee
    const [serviceAreas, setServiceAreas] = useState(['Area 1', 'Area 2']); // Default areas
    const [newArea, setNewArea] = useState('');

    const handleUpdatePickupFee = (e) => {
        setPickupFee(e.target.value);
    };

    const handleAddServiceArea = () => {
        if (newArea.trim()) {
            setServiceAreas([...serviceAreas, newArea]);
            setNewArea('');
        }
    };

    const handleRemoveServiceArea = (area) => {
        setServiceAreas(serviceAreas.filter(item => item !== area));
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">System Settings</h2>
            <p>Manage platform-wide settings like pickup fees, areas of service, etc.</p>

            {/* Pickup Fee Settings */}
            <div className="my-6">
                <h3 className="text-lg font-semibold">Pickup Fee</h3>
                <div className="mt-2">
                    <label htmlFor="pickupFee" className="block text-sm font-medium">Set Pickup Fee ($)</label>
                    <input
                        type="number"
                        id="pickupFee"
                        value={pickupFee}
                        onChange={handleUpdatePickupFee}
                        className="mt-1 p-2 border rounded-md w-24"
                    />
                </div>
            </div>

            {/* Service Areas Settings */}
            <div className="my-6">
                <h3 className="text-lg font-semibold">Service Areas</h3>
                <div className="mt-2">
                    <label htmlFor="newArea" className="block text-sm font-medium">Add New Service Area</label>
                    <input
                        type="text"
                        id="newArea"
                        value={newArea}
                        onChange={(e) => setNewArea(e.target.value)}
                        className="mt-1 p-2 border rounded-md"
                    />
                    <button
                        onClick={handleAddServiceArea}
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Add Area
                    </button>
                </div>
                <div className="mt-4">
                    <h4 className="text-md font-medium">Existing Areas</h4>
                    <ul className="list-disc ml-6">
                        {serviceAreas.map((area, index) => (
                            <li key={index} className="flex justify-between items-center mb-2">
                                <span>{area}</span>
                                <button
                                    onClick={() => handleRemoveServiceArea(area)}
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Other Settings */}
            <div className="my-6">
                <h3 className="text-lg font-semibold">Other Settings</h3>
                <div className="mt-2">
                    <p className="text-sm">Additional settings such as working hours, holidays, etc., can be added here.</p>
                    {/* Placeholder for additional settings */}
                    <button
                        onClick={() => alert('More settings functionality to be added!')}
                        className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md"
                    >
                        Manage Other Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
