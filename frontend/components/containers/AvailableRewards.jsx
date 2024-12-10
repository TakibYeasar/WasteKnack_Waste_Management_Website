'use client';

import { Gift} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AvailableRewards = ({ reward }) => {
  return (
      <div key={reward.id} className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{reward.name}</h3>
              <span className="text-green-500 font-semibold">{reward.cost} points</span>
          </div>
          <p className="text-gray-600 mb-2">{reward.description}</p>
          <p className="text-sm text-gray-500 mb-4">{reward.collectionInfo}</p>
          {reward.id === 0 ? (
              <Button
                  onClick={handleRedeemAllPoints}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  disabled={balance === 0}
              >
                  <Gift className="w-4 h-4 mr-2" />
                  Redeem All Points
              </Button>
          ) : (
              <Button
                  onClick={() => handleRedeemReward(reward.id)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  disabled={balance < reward.cost}
              >
                  <Gift className="w-4 h-4 mr-2" />
                  Redeem Reward
              </Button>
          )}
      </div>
  )
}

export default AvailableRewards