'use client';

import { useState, useCallback } from 'react';
import { MapPin, Upload, CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import { toast } from 'react-hot-toast';
import { useCurrentUserQuery } from '../../../store/features/auth/authApi';
import { useCreateReportMutation, useGetReportsByUserQuery } from '@/store/features/waste/wasteApi';

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

const ReportPage = () => {
    const { data: currentUser } = useCurrentUserQuery();
    const { data: userReports = [], refetch: refetchReports } = useGetReportsByUserQuery();

    const [newReport, setNewReport] = useState({
        image: '',
        location: '',
        waste_type: '',
        amount: '',
        verification_result: '',
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState('idle');
    const [verificationResult, setVerificationResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchBox, setSearchBox] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey,
        libraries,
    });

    const onLoad = useCallback((ref) => {
        setSearchBox(ref);
    }, []);

    const onPlacesChanged = () => {
        if (searchBox) {
            const places = searchBox.getPlaces();
            if (places?.length) {
                const place = places[0];
                setNewReport((prev) => ({
                    ...prev,
                    location: place.formatted_address || '',
                }));
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReport((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const readFileAsBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const handleVerify = async () => {
        if (!file) return;
        setVerificationStatus('verifying');

        try {
            const genAI = new GoogleGenerativeAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const base64Data = await readFileAsBase64(file);
            const imageData = base64Data.split(',')[1];

            const imageParts = [
                {
                    inlineData: {
                        data: imageData,
                        mimeType: file.type,
                    },
                },
            ];

            const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
            1. The type of waste (e.g., plastic, paper, glass, metal, organic)
            2. An estimate of the quantity or amount (in kg or liters)
            3. Your confidence level in this assessment (as a percentage)

            Respond in JSON format like this:
            {
            "wasteType": "type of waste",
            "quantity": "estimated quantity with unit",
            "confidence": confidence level as a number between 0 and 1
            }`;

            // Send the request to the model and get the result
            const result = await model.generateContent([prompt, ...imageParts]);

            // Log the raw response to understand its structure
            console.log("Raw verification result:", result);

            const rawText = await result.response.text();

            // Clean markdown formatting.
            const cleanedText = rawText.replace(/```(json)?/g, '').trim();
            const parsedResult = JSON.parse(cleanedText);

            if (
                parsedResult.wasteType &&
                parsedResult.quantity &&
                parsedResult.confidence != null
            ) {
                setVerificationResult(parsedResult);
                setVerificationStatus('success');
                setNewReport((prev) => ({
                    ...prev,
                    waste_type: parsedResult.wasteType,
                    amount: parsedResult.quantity,
                }));
            } else {
                console.error('Invalid verification result:', parsedResult);
                setVerificationStatus('failure');
            }
        } catch (error) {
            console.error('Error verifying waste:', error);
            setVerificationStatus('failure');
        }
    };

    // Make sure your RTK Query endpoint is configured to accept FormData.
    const [createReport] = useCreateReportMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (verificationStatus !== 'success') {
            toast.error('Please verify the waste before submitting.');
            return;
        }

        if (!currentUser) {
            toast.error('Please log in before submitting a report.');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('location', newReport.location);
            formData.append('waste_type', newReport.waste_type);
            formData.append('amount', newReport.amount);
            if (file) {
                formData.append('image', file);
            }
            if (verificationResult) {
                formData.append('verification_result', JSON.stringify(verificationResult));
            }

            await createReport(formData).unwrap();
            refetchReports();

            // Reset form state.
            setNewReport({
                image: '',
                location: '',
                waste_type: '',
                amount: '',
                verification_result: '', });
            setFile(null);
            setPreview(null);
            setVerificationStatus('idle');
            setVerificationResult(null);

            toast.success("Report submitted successfully! You've earned points for reporting waste.");
        } catch (error) {
            console.error('Error submitting report:', error);
            toast.error('Failed to submit report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Report Waste</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg mb-12">
                {/* File Upload Section */}
                <div className="mb-8">
                    <label htmlFor="waste-image" className="block text-lg font-medium text-gray-700 mb-2">
                        Upload Waste Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="waste-image"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        id="waste-image"
                                        name="waste-image"
                                        type="file"
                                        className="sr-only"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>

                {preview && (
                    <div className="mt-4 mb-8">
                        <img src={preview} alt="Waste preview" className="max-w-full h-auto rounded-xl shadow-md" />
                    </div>
                )}

                {/* Verification Button */}
                <Button
                    type="button"
                    onClick={handleVerify}
                    className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl transition-colors duration-300"
                    disabled={!file || verificationStatus === 'verifying'}
                >
                    {verificationStatus === 'verifying' ? (
                        <>
                            <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            Verifying...
                        </>
                    ) : (
                        'Verify Waste'
                    )}
                </Button>

                {verificationStatus === 'success' && verificationResult && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-xl">
                        <div className="flex items-center">
                            <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-green-800">Verification Successful</h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>Waste Type: {verificationResult.wasteType}</p>
                                    <p>Quantity: {verificationResult.quantity}</p>
                                    <p>Confidence: {(verificationResult.confidence * 100).toFixed(2)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        {isLoaded ? (
                            <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={newReport.location}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                                    placeholder="Enter waste location"
                                />
                            </StandaloneSearchBox>
                        ) : (
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={newReport.location}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                                placeholder="Enter waste location"
                            />
                        )}
                    </div>
                    <div>
                        <label htmlFor="waste_type" className="block text-sm font-medium text-gray-700 mb-1">
                            Waste Type
                        </label>
                        <input
                            type="text"
                            id="waste_type"
                            name="waste_type"
                            value={newReport.waste_type}
                            onChange={handleInputChange}
                            required
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                            placeholder="Verified waste type"
                        />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Estimated Amount
                        </label>
                        <input
                            type="text"
                            id="amount"
                            name="amount"
                            value={newReport.amount}
                            onChange={handleInputChange}
                            required
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                            placeholder="Verified amount"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300 flex items-center justify-center"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Report'
                    )}
                </Button>
            </form>

            {/* Recent Reports Table */}
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Recent Reports</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {userReports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
                                        {report.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.waste_type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;
