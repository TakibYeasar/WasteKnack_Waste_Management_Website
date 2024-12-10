import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: null,
    user: null,
    userInfo: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
        },
        userLoggedOut: (state) => {
            state.accessToken = null;
            state.user = null;
            state.userInfo = null;
        },
        addUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
    }
})

export const { userLoggedIn, userLoggedOut, addUserInfo } = authSlice.actions;
export default authSlice.reducer;