'use client';

import { useState, useEffect } from 'react';
import { Coins, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import RecentTransactions from '@/components/containers/RecentTransactions';
import AvailableRewards from '@/components/containers/AvailableRewards';
import { useCurrentUserQuery } from "../../../store/features/auth/authApi";
import { useGetRewardTransactionsQuery } from '@/store/features/transaction/transactionApi';
import { useGetAvailableRewardsQuery } from '@/store/features/user/userApi';

export default function RewardsPage() {

    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const { data: userInfo } = useCurrentUserQuery();
    const { data: rewards } = useGetAvailableRewardsQuery();
    const { data: transactions } = useGetRewardTransactionsQuery();

    // useEffect(() => {
    //     const fetchUserBalance = async () => {
    //         setLoading(true);
    //         try {
    //             if (userInfo) {
    //                 const calculatedBalance = transactions.reduce((acc, transaction) => {
    //                     return transaction.type.startsWith('earned') ? acc + transaction.amount : acc - transaction.amount;
    //                 }, 0);
    //                 setBalance(Math.max(calculatedBalance, 0));
    //             } else {
    //                 toast.error('User not found. Please log in again.');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching user balance:', error);
    //             toast.error('Failed to load user balance. Please try again.');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchUserBalance();
    // }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin h-8 w-8 text-gray-600" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Rewards</h1>

            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-full border-l-4 border-green-500 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Reward Balance</h2>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center">
                        <Coins className="w-10 h-10 mr-3 text-green-500" />
                        <div>
                            <span className="text-4xl font-bold text-green-500">{balance}</span>
                            <p className="text-sm text-gray-500">Available Points</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent Transactions</h2>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {transactions?.length > 0 ? (
                            transactions.map((transaction) => (
                                <RecentTransactions transaction={transaction} />
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">No transactions yet</div>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Available Rewards</h2>
                    <div className="space-y-4">
                        {rewards?.length > 0 ? (
                            rewards.map((reward) => (
                                <AvailableRewards reward={reward} balance={balance} />
                            ))
                        ) : (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                                <div className="flex items-center">
                                    <AlertCircle className="h-6 w-6 text-yellow-400 mr-3" />
                                    <p className="text-yellow-700">No rewards available at the moment.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
