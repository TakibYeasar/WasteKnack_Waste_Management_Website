import React, { useState } from 'react';

const FeedbackAndRatings = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Handle rating change
    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    // Handle feedback text change
    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    // Submit feedback and rating
    const handleSubmit = async () => {
        if (rating === 0 || !feedback.trim()) {
            setMessage('Please provide a rating and feedback.');
            setIsError(true);
            return;
        }

        setIsSubmitting(true);
        setIsError(false);
        setMessage('Submitting feedback...');

        // Simulate submission process (replace with API call)
        setTimeout(() => {
            setIsSubmitting(false);
            setRating(0);
            setFeedback('');
            setMessage('Feedback submitted successfully!');
            setIsError(false);
        }, 2000);
    };

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Feedback & Ratings</h2>
            <p className="mb-4">Rate collectors, submit complaints, or provide suggestions.</p>

            {/* Rating */}
            <div className="mb-4">
                <label htmlFor="rating" className="block mb-2 text-lg font-semibold">Rate Your Experience</label>
                <select
                    id="rating"
                    value={rating}
                    onChange={handleRatingChange}
                    className="w-full p-2 rounded border border-gray-300"
                >
                    <option value="0">Select a rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                </select>
            </div>

            {/* Feedback */}
            <div className="mb-4">
                <label htmlFor="feedback" className="block mb-2 text-lg font-semibold">Your Feedback</label>
                <textarea
                    id="feedback"
                    value={feedback}
                    onChange={handleFeedbackChange}
                    rows="4"
                    className="w-full p-2 rounded border border-gray-300"
                    placeholder="Share your thoughts or suggestions here"
                ></textarea>
            </div>

            {/* Message */}
            {message && (
                <div className={`mb-4 p-2 text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
        </div>
    );
};

export default FeedbackAndRatings;
