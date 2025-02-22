// features/auth/authApi.js
import { apiSlice } from "../../api/apiSlice";
import { AUTH_URL } from "../../constant";
import { resetAuthState, setTokens, setUser } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch the current user
        currentUser: builder.query({
            query: () => ({
                url: `${AUTH_URL}/current-user/`,
            }),
        }),

        // Register a new user
        register: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/register/`,
                method: "POST",
                body: data,
            }),
        }),

        // Verify email
        verifyEmail: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/verify-email/`,
                method: "POST",
                body: data,
            }),
        }),

        // Login user
        login: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login/`,
                method: "POST",
                body: data,
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    const { access_token, refresh_token, email, role } = data;

                    // Save tokens and user details in Redux store
                    dispatch(setTokens({ accessToken: access_token, refreshToken: refresh_token }));
                    dispatch(setUser({ email, role }));

                    // Save tokens and login timestamp to localStorage
                    localStorage.setItem("authToken", JSON.stringify({ access_token, refresh_token }));
                    localStorage.setItem("user", JSON.stringify({ email, role }));
                    localStorage.setItem("loginTimestamp", Date.now());
                } catch (error) {
                    console.error("Login error:", error);
                }
            },
        }),

        // Logout user
        logout: builder.mutation({
            query: ({ refreshToken }) => ({
                url: `${AUTH_URL}/logout/`,
                method: "POST",
                body: { refresh_token: refreshToken },
            }),
            async onQueryStarted(_, { dispatch }) {
                try {
                    // Clear localStorage and reset Redux state
                    localStorage.clear();
                    dispatch(resetAuthState());
                } catch (error) {
                    console.error("Logout failed:", error);
                }
            },
        }),

        // Request password reset
        requestPasswordReset: builder.mutation({
            query: (email) => ({
                url: `${AUTH_URL}/password-reset/`,
                method: "POST",
                body: { email },
            }),
        }),

        // Confirm password reset
        confirmPasswordReset: builder.query({
            query: ({ uidb64, token }) => ({
                url: `${AUTH_URL}/password-reset-confirm/${uidb64}/${token}/`,
            }),
        }),

        // Set a new password
        setNewPassword: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/set-new-password/`,
                method: "PATCH",
                body: data,
            }),
        }),

        // Change password
        changePassword: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/change-password/`,
                method: "POST",
                body: data,
            }),
        }),

        // Refresh token
        refreshToken: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/api/token/refresh/`,
                method: "POST",
                body: data,
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { access } = data;

                    // Update access token in localStorage
                    const authToken = JSON.parse(localStorage.getItem("authToken"));
                    if (authToken) {
                        authToken.access_token = access;
                        localStorage.setItem("authToken", JSON.stringify(authToken));
                    }
                } catch (error) {
                    console.error("Token refresh failed:", error);
                }
            },
        }),
    }),
});

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
    useRefreshTokenMutation,
} = authApi;
