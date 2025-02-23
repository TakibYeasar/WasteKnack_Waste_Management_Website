
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import { userApi } from "./features/user/userApi";
import { wasteApi } from "./features/waste/wasteApi";
import { transactionApi } from "./features/transaction/transactionApi";
import { notificationApi } from "./features/notification/notificationApi";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer, // Authentication reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware, userApi.middleware, wasteApi.middleware, notificationApi.middleware, transactionApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
});

export default store;
