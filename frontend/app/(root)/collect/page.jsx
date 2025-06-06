'use client';

import { useState } from 'react';
import { Trash2, MapPin, Upload, Loader, Calendar, Weight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useCurrentUserQuery } from "../../../store/features/auth/authApi";
import { useCreateCollectedWasteMutation, useUpdateReportStatusMutation, useGetWasteCollectionTasksQuery } from '../../../store/features/waste/wasteApi';
import StatusBadge from '@/components/containers/StatusBadge';

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const ITEMS_PER_PAGE = 5;

const CollectPage = () => {
    const { data: userInfo } = useCurrentUserQuery();
    const { data: tasks = [], isLoading } = useGetWasteCollectionTasksQuery();
    const [createCollection] = useCreateCollectedWasteMutation();
    const [updateReportStatus] = useUpdateReportStatusMutation();

    const [hoveredWasteType, setHoveredWasteType] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTask, setSelectedTask] = useState(null);
    const [verificationImage, setVerificationImage] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState('idle');
    const [verificationResult, setVerificationResult] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setVerificationImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleStartCollection = async (taskId, newStatus) => {
        if (!userInfo) {
            toast.error('Please log in to collect waste.');
            return;
        }

        try {
            const response = await createCollection({
                reportId: taskId,
            }).unwrap();

            if (response) {
                toast.success('Task status updated successfully.');
            } else {
                toast.error('Failed to update task status. Please try again.');
            }
        } catch (error) {
            console.error('Error updating task status:', error);
            toast.error(error?.data?.error || 'Failed to update task status. Please try again.');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        if (!userInfo) {
            toast.error('Please log in to collect waste.');
            return;
        }

        try {
            const response = await updateReportStatus({
                reportId: taskId,
                status: newStatus,
            }).unwrap();

            if (response) {
                toast.success('Task status updated successfully.');
            } else {
                toast.error('Failed to update task status. Please try again.');
            }
        } catch (error) {
            console.error('Error updating task status:', error);
            toast.error(error?.data?.error || 'Failed to update task status. Please try again.');
        }
    };

    const handleVerify = async () => {
        if (!selectedTask || !verificationImage || !userInfo) {
            toast.error('Missing required information for verification.');
            return;
        }

        setVerificationStatus('verifying');

        try {
            // Initialize the Google Generative AI instance
            const genAI = new GoogleGenerativeAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            // Prepare the base64 image data
            const base64Data = verificationImage.split(',')[1];
            const imageParts = [
                {
                    inlineData: { data: base64Data, mimeType: 'image/jpeg' },
                },
            ];

            // Define the prompt for the generative model
            const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
            1. Confirm if the waste type matches: ${selectedTask.waste_type}
            2. Estimate if the quantity matches: ${selectedTask.amount}
            3. Your confidence level in this assessment (as a number between 0 and 1)

            Respond in JSON format like this:
            {
            "wasteTypeMatch": true/false,
            "quantityMatch": true/false,
            "confidence": <number>
            }`;

            // Send the request to the model and get the result
            const result = await model.generateContent([prompt, ...imageParts]);
            console.log("Raw verification result:", result);

            // Extract and clean the raw text response
            const rawText = await result.response.text();
            const cleanedText = rawText.replace(/```(json)?/g, '').trim();
            const parsedResult = JSON.parse(cleanedText);

            // Validate the parsed result structure
            if (
                typeof parsedResult.wasteTypeMatch === 'boolean' &&
                typeof parsedResult.quantityMatch === 'boolean' &&
                typeof parsedResult.confidence === 'number'
            ) {
                setVerificationResult(parsedResult);
                setVerificationStatus('success');

                // Check if the verification criteria are met
                if (
                    parsedResult.wasteTypeMatch &&
                    parsedResult.quantityMatch &&
                    parsedResult.confidence > 0.7
                ) {
                    await handleStatusChange(selectedTask.id, 'verified');
                    const earnedReward = Math.floor(Math.random() * 50) + 10; // Random reward between 10 and 60 tokens
                    toast.success(`Verification successful! You earned ${earnedReward} tokens.`);
                } else {
                    toast.error('Verification failed. Waste does not match.');
                }
            } else {
                console.error('Error parsing verification response:', parsedResult);
                toast.error('Verification failed: Invalid response from the model.');
                setVerificationStatus('failure');
                return;
            }
        } catch (error) {
            console.error('Verification error:', error);
            toast.error('Verification failed. Please try again.');
            setVerificationStatus('failure');
        }
    };


    const filteredTasks = tasks.filter((task) =>
        task.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pageCount = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
    const paginatedTasks = filteredTasks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Waste Collection Tasks</h1>

            <div className="mb-4 flex items-center">
                <Input
                    type="text"
                    placeholder="Search by area..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mr-2"
                />
                <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader className="animate-spin h-8 w-8 text-gray-500" />
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {Array.isArray(paginatedTasks) && paginatedTasks.length > 0 ? (
                            paginatedTasks.map((task) => (
                                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-lg font-medium text-gray-800 flex items-center">
                                            <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                                            {task.location}
                                        </h2>
                                        <StatusBadge status={task.status} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center relative">
                                            <Trash2 className="w-4 h-4 mr-2 text-gray-500" />
                                            <span
                                                onMouseEnter={() => setHoveredWasteType(task.waste_type)}
                                                onMouseLeave={() => setHoveredWasteType(null)}
                                                className="cursor-pointer"
                                            >
                                                {task.waste_type?.length > 8 ? `${task.waste_type.slice(0, 8)}...` : task.waste_type}
                                            </span>
                                            {hoveredWasteType === task.waste_type && (
                                                <div className="absolute left-0 top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                                                    {task.waste_type}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            <Weight className="w-4 h-4 mr-2 text-gray-500" />
                                            {task.amount}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                            {task.created_at}
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        {task.status === 'pending' && (
                                            <Button onClick={() => handleStartCollection(task.id)} variant="outline" size="sm">
                                                Start Collection
                                            </Button>
                                        )}
                                        {task.status === 'in_progress' && (
                                            <Button onClick={() => setSelectedTask(task)} variant="outline" size="sm">
                                                Complete & Verify
                                            </Button>
                                        )}
                                        {task.status === 'verified' && (
                                            <span className="text-green-600 text-sm font-medium">Reward Earned</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No tasks available</p>
                        )}
                    </div>

                    <div className="mt-4 flex justify-center">
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="mr-2"
                        >
                            Previous
                        </Button>
                        <span className="mx-2 self-center">
                            Page {currentPage} of {pageCount}
                        </span>
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                            disabled={currentPage === pageCount}
                            className="ml-2"
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}

            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">Verify Collection</h3>
                        <p className="mb-4 text-sm text-gray-600">
                            Upload a photo of the collected waste to verify and earn your reward.
                        </p>
                        <div className="mb-4">
                            <label htmlFor="verification-image" className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Image
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="verification-image"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="verification-image"
                                                name="verification-image"
                                                type="file"
                                                className="sr-only"
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                        {verificationImage && (
                            <img src={verificationImage} alt="Verification" className="mb-4 rounded-md w-full" />
                        )}
                        <Button
                            onClick={handleVerify}
                            className="w-full"
                            disabled={!verificationImage || verificationStatus === 'verifying'}
                        >
                            {verificationStatus === 'verifying' ? (
                                <>
                                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify Collection'
                            )}
                        </Button>
                        {verificationStatus === 'success' && verificationResult && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                                <p>Waste Type Match: {verificationResult.wasteTypeMatch ? 'Yes' : 'No'}</p>
                                <p>Quantity Match: {verificationResult.quantityMatch ? 'Yes' : 'No'}</p>
                                <p>Confidence: {(verificationResult.confidence * 100).toFixed(2)}%</p>
                            </div>
                        )}
                        {verificationStatus === 'failure' && (
                            <p className="mt-2 text-red-600 text-center text-sm">Verification failed. Please try again.</p>
                        )}
                        <Button onClick={() => setSelectedTask(null)} variant="outline" className="w-full mt-2">
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectPage;
