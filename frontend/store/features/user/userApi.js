import { apiSlice } from "../../api/apiSlice";
import { USERS_URL } from "../../constant";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateRewardPoints: builder.mutation({
            query: ({ pointsToAdd }) => ({
                url: `${USERS_URL}/update-rewards-points/`,
                method: 'PATCH',
                body: { points_to_add: pointsToAdd },
            }),
        }),

        getAllRewards: builder.query({
            query: () => `${USERS_URL}/all-rewards`,
        }),

        getAvailableRewards: builder.query({
            query: () => `${USERS_URL}/available-rewards/`,
        }),

        redeemReward: builder.mutation({
            query: ({ rewardId }) => ({
                url: `${USERS_URL}/redeem-reward/${rewardId}/`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useUpdateRewardPointsMutation,
    useGetAllRewardsQuery,
    useGetAvailableRewardsQuery,
    useRedeemRewardMutation,
} = userApi;
