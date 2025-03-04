'use client';

import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useCreateTransactionMutation } from '../../store/features/transaction/transactionApi';
import { useRedeemRewardMutation } from '../../store/features/user/userApi';

const AvailableRewards = ({ userInfo, reward, balance }) => {
    const [redeemReward, { isLoading: isRedeeming }] = useRedeemRewardMutation();
    const [createTransaction] = useCreateTransactionMutation();

    const handleRedeemReward = async (rewardId) => {
        if (!userInfo) {
            toast.error('Please log in to redeem rewards.');
            return;
        }

        if (balance < reward.points) {
            toast.error('Insufficient balance.');
            return;
        }

        try {
            await redeemReward({ userId: userInfo.id, rewardId }).unwrap();
            await createTransaction({
                userId: userInfo.id,
                type: 'redeemed',
                amount: reward.points,
                description: `Redeemed ${reward.name || 'Reward'}`,
            }).unwrap();

            toast.success(`Successfully redeemed: ${reward.name || 'Reward'}`);
        } catch (error) {
            console.error('Error redeeming reward:', error);
            toast.error('Failed to redeem reward. Please try again.');
        }
    };

    const handleRedeemAllPoints = async () => {
        if (!userInfo) {
            toast.error('Please log in to redeem points.');
            return;
        }

        if (balance === 0) {
            toast.error('No points available to redeem.');
            return;
        }

        try {
            await redeemReward({ userId: userInfo.id, rewardId: 0 }).unwrap();
            await createTransaction({
                userId: userInfo.id,
                type: 'redeemed',
                amount: balance,
                description: 'Redeemed all points',
            }).unwrap();

            toast.success('Successfully redeemed all your points!');
        } catch (error) {
            console.error('Error redeeming all points:', error);
            toast.error('Failed to redeem all points. Please try again.');
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                    {reward.name || "Unnamed Reward"}
                </h3>
                <span className="text-green-500 font-semibold">{reward.points} points</span>
            </div>
            {reward.description && (
                <p className="text-gray-600 mb-2">{reward.description}</p>
            )}
            {reward.collection_info && (
                <p className="text-sm text-gray-500 mb-4">{reward.collection_info}</p>
            )}

            <Button
                onClick={
                    reward.id === 0 ? handleRedeemAllPoints : () => handleRedeemReward(reward.id)
                }
                className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
                disabled={
                    isRedeeming ||
                    (reward.id === 0 ? balance === 0 : balance < reward.points)
                }
            >
                <Gift className="w-4 h-4 mr-2" />
                {reward.id === 0 ? "Redeem All Points" : "Redeem Reward"}
            </Button>
        </div>
    );
};

export default AvailableRewards;
