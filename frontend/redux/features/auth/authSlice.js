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
        resetAuthState: (state) => {
            state.loading = false;
            state.error = null;
            state.successMessage = null;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
        },
        setTokens: (state, action) => {
            const { accessToken, refreshToken } = action.payload;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = Boolean(accessToken);
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = Boolean(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
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
