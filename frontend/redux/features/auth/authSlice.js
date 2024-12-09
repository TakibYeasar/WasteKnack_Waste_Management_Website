import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://127.0.0.1:8000/api/auth/',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        currentUser: builder.query({
            query: () => '/current-user/',
        }),

        register: builder.mutation({
            query: (data) => ({
                url: '/register/',
                method: 'POST',
                body: data,
            }),
        }),

        verifyEmail: builder.mutation({
            query: (data) => ({
                url: '/verify-email/',
                method: 'POST',
                body: data,
            }),
        }),

        login: builder.mutation({
            query: (data) => ({
                url: '/login/',
                method: 'POST',
                body: data,
            }),
        }),

        logout: builder.mutation({
            query: (data) => ({
                url: '/logout/',
                method: 'POST',
                body: data,
            }),
        }),

        passwordResetRequest: builder.mutation({
            query: (data) => ({
                url: '/password-reset/',
                method: 'POST',
                body: data,
            }),
        }),

        passwordResetConfirm: builder.query({
            query: ({ uidb64, token }) => `/password-reset-confirm/${uidb64}/${token}/`,
        }),

        setNewPassword: builder.mutation({
            query: (data) => ({
                url: '/set-new-password/',
                method: 'PATCH',
                body: data,
            }),
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: '/change-password/',
                method: 'POST',
                body: data,
            }),
        }),

        tokenObtainPair: builder.mutation({
            query: (data) => ({
                url: '/api/token/',
                method: 'POST',
                body: data,
            }),
        }),

        tokenRefresh: builder.mutation({
            query: (data) => ({
                url: '/api/token/refresh/',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useCurrentUserQuery,
    useRegisterMutation,
    useVerifyEmailMutation,
    useLoginMutation,
    useLogoutMutation,
    usePasswordResetRequestMutation,
    usePasswordResetConfirmQuery,
    useSetNewPasswordMutation,
    useChangePasswordMutation,
    useTokenObtainPairMutation,
    useTokenRefreshMutation,
} = authApi;