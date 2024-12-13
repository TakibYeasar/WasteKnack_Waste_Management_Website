// api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constant";

// Helper function to retrieve the access token
export const getAuthToken = () => {
    const authToken = JSON.parse(localStorage.getItem("authToken"));
    if (!authToken || !authToken.access_token) {
        throw new Error("No access token found");
    }

    const currentTime = Date.now();
    if (authToken.expirationTime && currentTime > authToken.expirationTime) {
        throw new Error("Access token has expired");
    }

    return authToken.access_token;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            try {
                const token = getAuthToken();
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
            } catch (error) {
                console.error("Error preparing headers:", error);
            }
            return headers;
        },
    }),
    tagTypes: ["Auth", "User", "Waste", "Notification", "Transaction"],
    endpoints: (builder) => ({}),
});

export default apiSlice;
