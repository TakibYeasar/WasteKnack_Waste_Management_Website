import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constant";

// Helper function to retrieve the auth token
export const getAuthToken = () => {
    const authToken = JSON.parse(localStorage.getItem("authToken"));
    if (!authToken || !authToken.access_token) {
        throw new Error("No access token found");
    }
    return authToken;
};

// Helper function to refresh the token
const refreshAuthToken = async () => {
    const authToken = JSON.parse(localStorage.getItem("authToken"));
    if (!authToken || !authToken.refresh_token) {
        throw new Error("No refresh token found");
    }

    const response = await fetch(`${BASE_URL}/api/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authToken.refresh_token }),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    const newTokens = await response.json();
    const newAuthToken = {
        access_token: newTokens.access,
        refresh_token: authToken.refresh_token, // Keep the same refresh token
        expirationTime: Date.now() + 60 * 60 * 1000, // Assuming a 60-minute lifespan for the new access token
    };

    localStorage.setItem("authToken", JSON.stringify(newAuthToken));
    return newAuthToken.access_token;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: async (headers) => {
            try {
                let token;

                const authToken = getAuthToken();
                const currentTime = Date.now();

                // Check if the token is expired
                if (authToken.expirationTime && currentTime > authToken.expirationTime) {
                    // If the token is expired, remove it from localStorage
                    localStorage.removeItem("authToken");
                    throw new Error("Token expired");
                } else {
                    token = authToken.access_token;
                }

                // Refresh the token if it's close to expiry or expired
                if (authToken.expirationTime - currentTime <= 0) {
                    token = await refreshAuthToken();
                }

                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
            } catch (error) {
                console.error("Error preparing headers:", error);
            }
            return headers;
        },
    }),
    tagTypes: ["Auth", "User", "Waste", "Notifications", "Balance", "Transaction"],
    endpoints: (builder) => ({}),
});

export default apiSlice;
