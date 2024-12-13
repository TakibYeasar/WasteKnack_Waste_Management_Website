import { apiSlice } from "../../api/apiSlice";
import { WASTE_URL } from "../../constant";

export const wasteApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Reports Endpoints
        createReport: builder.mutation({
            query: (reportData) => ({
                url: `${WASTE_URL}/reports/create/`,
                method: 'POST',
                body: reportData,
            }),
        }),

        getReportsByUser: builder.query({
            query: (userId) => `${WASTE_URL}/reports/user/${userId}/`,
        }),

        getPendingReports: builder.query({
            query: () => `${WASTE_URL}/reports/pending/`,
        }),

        updateReportStatus: builder.mutation({
            query: ({ reportId, updateData }) => ({
                url: `${WASTE_URL}/reports/${reportId}/update-status/`,
                method: 'PATCH',
                body: updateData,
            }),
        }),

        getRecentReports: builder.query({
            query: () => `${WASTE_URL}/reports/recent/`,
        }),

        // Collected Waste Endpoints
        createCollectedWaste: builder.mutation({
            query: (collectedWasteData) => ({
                url: `${WASTE_URL}/collected-waste/create/`,
                method: 'POST',
                body: collectedWasteData,
            }),
        }),

        getCollectedWastesByCollector: builder.query({
            query: (collectorId) => `${WASTE_URL}/collected-waste/collector/${collectorId}/`,
        }),

        saveCollectedWaste: builder.mutation({
            query: (collectedWasteData) => ({
                url: `${WASTE_URL}/collected-waste/save/`,
                method: 'POST',
                body: collectedWasteData,
            }),
        }),

        // Task Endpoints
        getWasteCollectionTasks: builder.query({
            query: () => `${WASTE_URL}/tasks/waste-collection/`,
        }),

        updateTaskStatus: builder.mutation({
            query: ({ reportId, updateData }) => ({
                url: `${WASTE_URL}/tasks/${reportId}/update-status/`,
                method: 'PATCH',
                body: updateData,
            }),
        }),
    }),
});

export const {
    useCreateReportMutation,
    useGetReportsByUserQuery,
    useGetPendingReportsQuery,
    useUpdateReportStatusMutation,
    useGetRecentReportsQuery,
    useCreateCollectedWasteMutation,
    useGetCollectedWastesByCollectorQuery,
    useSaveCollectedWasteMutation,
    useGetWasteCollectionTasksQuery,
    useUpdateTaskStatusMutation,
} = wasteApi;
