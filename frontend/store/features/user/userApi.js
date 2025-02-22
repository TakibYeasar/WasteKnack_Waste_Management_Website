import { apiSlice } from "../../api/apiSlice";
import { USERS_URL } from "../../constant";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrCreateReward: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/reward/${userId}/get-or-create/`,
                method: 'POST',
            }),
        }),

        updateRewardPoints: builder.mutation({
            query: ({ userId, pointsToAdd }) => ({
                url: `${USERS_URL}/reward/${userId}/update-points/`,
                method: 'PATCH',
                body: { points_to_add: pointsToAdd },
            }),
        }),

        saveReward: builder.mutation({
            query: ({ userId, amount }) => ({
                url: `${USERS_URL}/reward/${userId}/save/`,
                method: 'POST',
                body: { amount },
            }),
        }),

        getAllRewards: builder.query({
            query: () => 'rewards/',
        }),

        getAvailableRewards: builder.query({
            query: (userId) => `${USERS_URL}/rewards/${userId}/available/`,
        }),

        redeemReward: builder.mutation({
            query: ({ userId, rewardId }) => ({
                url: `${USERS_URL}/reward/${userId}/redeem/${rewardId}/`,
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
