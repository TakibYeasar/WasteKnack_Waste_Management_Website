import React, { useState, useEffect } from 'react';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Simulate fetching payment history data (replace with actual API call)
    useEffect(() => {
        // Example payment data (replace with real API data)
        const fetchedPayments = [
            { id: 1, amount: 50.0, date: '2025-01-10', status: 'Completed' },
            { id: 2, amount: 30.0, date: '2025-01-05', status: 'Completed' },
            { id: 3, amount: 40.0, date: '2025-01-01', status: 'Pending' },
        ];

        setPayments(fetchedPayments);
        setLoading(false);
    }, []);

    // Simulate processing payment (replace with actual payment integration)
    const handleMakePayment = () => {
        setIsProcessingPayment(true);
        setTimeout(() => {
            setIsProcessingPayment(false);
            alert('Payment processed successfully!');
        }, 2000);
    };

    if (loading) {
        return (
            <div className="p-5 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Payment History</h2>
                <p>Loading your payment history...</p>
            </div>
        );
    }

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Payment History</h2>
            <p className="mb-4">Pay for pickup services and view your payment history below.</p>

            {/* Button to make a payment */}
            <div className="mb-6">
                <button
                    onClick={handleMakePayment}
                    className={`px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ${isProcessingPayment ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={isProcessingPayment}
                >
                    {isProcessingPayment ? 'Processing Payment...' : 'Make Payment'}
                </button>
            </div>

            {/* Table for displaying payment history */}
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border-b py-2 px-4 text-left">Date</th>
                        <th className="border-b py-2 px-4 text-left">Amount</th>
                        <th className="border-b py-2 px-4 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-100">
                            <td className="border-b py-2 px-4">{new Date(payment.date).toLocaleDateString()}</td>
                            <td className="border-b py-2 px-4">${payment.amount.toFixed(2)}</td>
                            <td className={`border-b py-2 px-4 ${getPaymentStatusClass(payment.status)}`}>
                                {payment.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Helper function to determine the payment status styling
const getPaymentStatusClass = (status) => {
    switch (status) {
        case 'Completed':
            return 'text-green-500';
        case 'Pending':
            return 'text-yellow-500';
        default:
            return '';
    }
};

export default PaymentHistory;
