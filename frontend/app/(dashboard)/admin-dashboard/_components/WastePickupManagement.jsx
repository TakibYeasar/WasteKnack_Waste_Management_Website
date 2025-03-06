import React from "react";
import {
    useManageReportsQuery,
    useRemoveReportMutation,
} from "@/store/features/waste/wasteApi";

const WastePickupManagement = () => {
    const { data: reports, isLoading, error } = useManageReportsQuery();
    const [removeReport] = useRemoveReportMutation();

    const handleRemove = async (id) => {
        if (window.confirm("Are you sure you want to remove this report?")) {
            try {
                await removeReport(id);
                alert("Report removed successfully!");
            } catch (error) {
                alert("Failed to remove report.");
            }
        }
    };

    // Check if any report has collected_wastes
    const hasCollectedWastes = reports?.some(report => report?.collected_wastes?.length > 0);

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Waste Pickup Management</h2>
            <p className="mb-4">Assign pickup requests to collectors. Monitor pickup statuses.</p>

            {isLoading ? (
                <div className="text-center text-lg font-semibold">
                    Loading pickup data...
                </div>
            ) : error ? (
                <div className="text-red-500">Error loading data.</div>
            ) : (
                <div>
                    <table className="min-w-full table-auto border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2 text-left">Address</th>
                                <th className="border border-gray-300 p-2 text-left">Waste Type</th>
                                {hasCollectedWastes && (
                                    <>
                                        <th className="border border-gray-300 p-2 text-left">Collected By</th>
                                        <th className="border border-gray-300 p-2 text-left">Collection Date</th>
                                    </>
                                )}
                                <th className="border border-gray-300 p-2 text-left">Status</th>
                                <th className="border border-gray-300 p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports?.map((report) => {
                                const collectedWaste = report?.collected_wastes?.[0] || null;

                                return (
                                    <tr key={report.id} className="border-b border-gray-200">
                                        <td className="p-2">{report.location}</td>
                                        <td className="p-2">{report.waste_type}</td>
                                        {hasCollectedWastes && (
                                            <>
                                                <td className="p-2">{collectedWaste?.collector || "Not Assigned"}</td>
                                                <td className="p-2">{collectedWaste?.collection_date || "N/A"}</td>
                                            </>
                                        )}
                                        <td className="p-2">
                                            <span
                                                className={`p-2 text-white rounded ${report.status === "pending"
                                                        ? "bg-yellow-500"
                                                        : report.status === "in_progress"
                                                            ? "bg-blue-500"
                                                            : "bg-green-500"
                                                    }`}
                                            >
                                                {report.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="p-2">
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleRemove(report.id)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default WastePickupManagement;
