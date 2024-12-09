import { apiSlice } from "../../api/apiSlice";
import { AUTH_URL } from "../../constant";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get Current User
        currentUser: builder.query({
            query: () => `${AUTH_URL}/current-user`,
        }),

        // Register new user
        register: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/register/`,
                method: 'POST',
                body: data,
            }),
        }),

        // Verify email with OTP
        verifyEmail: builder.mutation({
            query: (otp) => ({
                url: `${AUTH_URL}/verify-email/`,
                method: 'POST',
                body: otp,
            }),
        }),

        // Login the user and get JWT tokens
        login: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login/`,
                method: 'POST',
                body: data,
            }),
        }),

        // Logout the user
        logout: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/logout/`,
                method: 'POST',
            }),
        }),

        // Request a password reset link
        requestPasswordReset: builder.mutation({
            query: (email) => ({
                url: `${AUTH_URL}/password-reset/`,
                method: 'POST',
                body: { email },
            }),
        }),

        // Confirm the password reset token
        confirmPasswordReset: builder.query({
            query: ({ uidb64, token }) => `${AUTH_URL}/password-reset-confirm/${uidb64}/${token}/`,
        }),

        // Set a new password after token confirmation
        setNewPassword: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/set-new-password/`,
                method: 'PATCH',
                body: data,
            }),
        }),

        // Change the user's password
        changePassword: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/change-password/`,
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

// Export hooks for using the API endpoints in components
export const {
    useCurrentUserQuery,
    useRegisterMutation,
    useVerifyEmailMutation,
    useLoginMutation,
    useLogoutMutation,
    useRequestPasswordResetMutation,
    useConfirmPasswordResetQuery,
    useSetNewPasswordMutation,
    useChangePasswordMutation,
} = authApiSlice;
