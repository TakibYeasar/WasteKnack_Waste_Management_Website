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
        }),

        getUnreadNotifications: builder.query({
            query: () => `${NOTIFICATION_URL}/notifications/unread/`,
        }),

        markNotificationAsRead: builder.mutation({
            query: (notificationId) => ({
                url: `${NOTIFICATION_URL}/notifications/${notificationId}/read/`,
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
