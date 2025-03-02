'use client';

import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useCurrentUserQuery } from '../../store/features/auth/authApi';
import { useCreateTransactionMutation } from '../../store/features/transaction/transactionApi';
import { useGetAvailableRewardsQuery, useRedeemRewardMutation } from '../../store/features/user/userApi';

const AvailableRewards = ({ reward, balance }) => {
    const { data: userInfo } = useCurrentUserQuery();
    const { data: rewards } = useGetAvailableRewardsQuery();

    const handleRedeemReward = async (rewardId) => {
        if (!userInfo) {
            toast.error('Please log in to redeem rewards.');
            return;
        }

        const selectedReward = rewards?.find((r) => r.id === rewardId);
        if (selectedReward && balance >= selectedReward.cost) {
            try {
                await useRedeemRewardMutation({ userId: userInfo.id, rewardId });
                await useCreateTransactionMutation({
                    userId: userInfo.id,
                    type: 'redeemed',
                    amount: selectedReward.cost,
                    description: `Redeemed ${selectedReward.name}`,
                });

                toast.success(`You have successfully redeemed: ${selectedReward.name}`);
            } catch (error) {
                console.error('Error redeeming reward:', error);
                toast.error('Failed to redeem reward. Please try again.');
            }
        } else {
            toast.error('Insufficient balance or invalid reward.');
        }
    };

    const handleRedeemAllPoints = async () => {
        if (!userInfo) {
            toast.error('Please log in to redeem points.');
            return;
        }

        if (balance > 0) {
            try {
                await useRedeemRewardMutation({ userId: userInfo.id, rewardId: 0 });
                await useCreateTransactionMutation({
                    userId: userInfo.id,
                    type: 'redeemed',
                    amount: balance,
                    description: 'Redeemed all points',
                });

                toast.success('You have successfully redeemed all your points!');
            } catch (error) {
                console.error('Error redeeming all points:', error);
                toast.error('Failed to redeem all points. Please try again.');
            }
        } else {
            toast.error('No points available to redeem.');
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{reward.name || "Unnamed Reward"}</h3>
                <span className="text-green-500 font-semibold">{reward.cost} points</span>
            </div>
            {reward.description && <p className="text-gray-600 mb-2">{reward.description}</p>}
            {reward.collection_info && <p className="text-sm text-gray-500 mb-4">{reward.collection_info}</p>}

            <Button
                onClick={reward.id === 0 ? handleRedeemAllPoints : () => handleRedeemReward(reward.id)}
                className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
                disabled={reward.id === 0 ? balance === 0 : balance < reward.cost}
            >
                <Gift className="w-4 h-4 mr-2" />
                {reward.id === 0 ? "Redeem All Points" : "Redeem Reward"}
            </Button>
        </div>
    );
};

export default AvailableRewards;
