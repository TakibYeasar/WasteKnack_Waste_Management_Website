import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constant";
import { userLoggedOut } from '../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
        const token = getState()?.auth?.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: async (args, api, extraOptions) => {
        let result = await baseQuery(args, api, extraOptions);

        if (result?.error?.status === 401) {
            api.dispatch(userLoggedOut());
            localStorage.removeItem('auth');
        }
        return result;
    },
    tagTypes: ["Auth", "User", "Waste", "Notification", "Transaction"],
    endpoints: (builder) => ({}),
});