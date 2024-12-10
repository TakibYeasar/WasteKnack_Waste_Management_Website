import { apiSlice } from "../../api/apiSlice";
import { AUTH_URL } from "../../constant";
import { addUserInfo, userLoggedIn, userLoggedOut } from './authSlice';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get Current User
        currentUser: builder.query({
            query: () => `${AUTH_URL}/current-user`,
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;

                    // Save user info in the state
                    dispatch(addUserInfo(result.data));
                } catch (err) {
                    console.log("Error fetching current user:", err);
                }
            },
        }),

        // Register new user
        register: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/register/`,
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;

                    // Save auth info in local storage
                    localStorage.setItem(
                        'auth',
                        JSON.stringify({
                            accessToken: result.data.accessToken,
                            user: result.data.user,
                        })
                    );

                    // Dispatch login action
                    dispatch(
                        userLoggedIn({
                            accessToken: result.data.accessToken,
                            user: result.data.user,
                        })
                    );
                } catch (err) {
                    console.log("Error registering user:", err);
                }
            },
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
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;

                    // Save auth info in local storage
                    localStorage.setItem(
                        'auth',
                        JSON.stringify({
                            accessToken: result.data.accessToken,
                            user: result.data.user,
                        })
                    );

                    // Dispatch login action
                    dispatch(
                        userLoggedIn({
                            accessToken: result.data.accessToken,
                            user: result.data.user,
                        })
                    );
                } catch (err) {
                    console.log("Error logging in user:", err);
                }
            },
        }),

        // Logout the user
        logout: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/logout/`,
                method: 'POST',
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;

                    // Remove auth info from local storage
                    localStorage.removeItem('auth');

                    // Dispatch logout action
                    dispatch(userLoggedOut());
                } catch (err) {
                    console.log("Error logging out user:", err);
                }
            },
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
            query: ({ uidb64, token }) =>
                `${AUTH_URL}/password-reset-confirm/${uidb64}/${token}/`,
        }),

        // Set a new password after token confirmation
        setNewPassword: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/set-new-password/`,
                method: 'PATCH',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;

                    console.log("Password reset successfully!");
                } catch (err) {
                    console.log("Error resetting password:", err);
                }
            },
        }),

        // Change the user's password
        changePassword: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/change-password/`,
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;

                    console.log("Password changed successfully!");
                } catch (err) {
                    console.log("Error changing password:", err);
                }
            },
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
} = authApi;
