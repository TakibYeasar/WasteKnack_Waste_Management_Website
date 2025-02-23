import { apiSlice } from "../../api/apiSlice";
import { USERS_URL } from "../../constant";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrCreateReward: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/reward-get-or-create/`,
                method: 'POST',
            }),
        }),

        updateRewardPoints: builder.mutation({
            query: ({ pointsToAdd }) => ({
                url: `${USERS_URL}/reward-update-points/`,
                method: 'PATCH',
                body: { points_to_add: pointsToAdd },
            }),
        }),

        saveReward: builder.mutation({
            query: ({ amount }) => ({
                url: `${USERS_URL}/reward-save/`,
                method: 'POST',
                body: { amount },
            }),
        }),

        getAllRewards: builder.query({
            query: () => `${USERS_URL}/rewards/`,
        }),

        getAvailableRewards: builder.query({
            query: () => `${USERS_URL}/rewards-available/`,
        }),

        redeemReward: builder.mutation({
            query: ({ rewardId }) => ({
                url: `${USERS_URL}/reward-redeem/${rewardId}/`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useGetOrCreateRewardMutation,
    useUpdateRewardPointsMutation,
    useSaveRewardMutation,
    useGetAllRewardsQuery,
    useGetAvailableRewardsQuery,
    useRedeemRewardMutation,
} = userApi;
