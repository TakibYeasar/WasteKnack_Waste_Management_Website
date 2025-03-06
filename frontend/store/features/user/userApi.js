import { apiSlice } from "../../api/apiSlice";
import { USERS_URL } from "../../constant";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        manageUsers: builder.query({
            query: () => ({
                url: `${USERS_URL}/manage-users/`,
            })
        }),

        changeUserRole: builder.mutation({
            query: ({ userId, role }) => ({
                url: `${USERS_URL}/user/${userId}/change-role/`,
                method: "PUT",
                body: { role },
            }),
        }),

        removeUser: builder.mutation({
            query: (id) => ({
                url: `${USERS_URL}/user/${id}/remove/`,
                method: "DELETE",
            }),
        }),

        getUserProfile: builder.query({
            query: () => `${USERS_URL}/profile/`,
        }),

        updateUserProfile: builder.mutation({
            query: (profileData) => ({
                url: `${USERS_URL}/profile/`,
                method: "PUT",
                body: profileData,
            }),
        }),

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
    useManageUsersQuery,
    useChangeUserRoleMutation,
    useRemoveUserMutation,
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useUpdateRewardPointsMutation,
    useGetAllRewardsQuery,
    useGetAvailableRewardsQuery,
    useRedeemRewardMutation,
} = userApi;
