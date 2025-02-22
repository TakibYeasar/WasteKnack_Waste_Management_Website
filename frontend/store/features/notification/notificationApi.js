import { apiSlice } from "../../api/apiSlice";
import { NOTIFICATION_URL } from "../../constant";

export const notificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createNotification: builder.mutation({
            query: (data) => ({
                url: `${NOTIFICATION_URL}/notifications/create/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Notifications'],
        }),
        getUnreadNotifications: builder.query({
            query: (userId) => `${NOTIFICATION_URL}/notifications/unread/${userId}/`,
            providesTags: ['Notifications'],
        }),
        markNotificationAsRead: builder.mutation({
            query: (notificationId) => ({
                url: `${NOTIFICATION_URL}/notifications/mark-read/${notificationId}/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Notifications'],
        }),
    }),
});

export const {
    useCreateNotificationMutation,
    useGetUnreadNotificationsQuery,
    useMarkNotificationAsReadMutation,
} = notificationApi;
