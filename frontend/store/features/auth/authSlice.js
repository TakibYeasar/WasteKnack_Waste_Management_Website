import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    successMessage: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Reset authentication state
        resetAuthState: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.successMessage = null;
        },

        // Set authentication tokens
        setTokens: (state, action) => {
            const { accessToken, refreshToken } = action.payload || {};
            state.accessToken = accessToken || null;
            state.refreshToken = refreshToken || null;
            state.isAuthenticated = Boolean(accessToken);
        },

        // Set user details
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = Boolean(action.payload);
        },

        // Set loading state
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        // Set error message
        setError: (state, action) => {
            state.error = action.payload;
        },

        // Set success message
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
        },
    },
});

export const {
    resetAuthState,
    setTokens,
    setUser,
    setLoading,
    setError,
    setSuccessMessage,
} = authSlice.actions;

export default authSlice.reducer;
