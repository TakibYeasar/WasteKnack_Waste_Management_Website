import { apiSlice } from "../../api/apiSlice";
import { WASTE_URL } from "../../constant";

export const wasteApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Reports Endpoints
        createReport: builder.mutation({
            query: (newReport) => ({
                url: `${WASTE_URL}/create-report/`,
                method: 'POST',
                body: newReport,
            }),
        }),

        getReportsByUser: builder.query({
            query: () => `${WASTE_URL}/user-reports/`,
        }),

        getPendingReports: builder.query({
            query: () => `${WASTE_URL}/pending-reports/`,
        }),

        updateReportStatus: builder.mutation({
            query: ({ reportId, updateData }) => ({
                url: `${WASTE_URL}/reports/${reportId}/update-status/`,
                method: 'PATCH',
                body: updateData,
            }),
        }),

        getRecentReports: builder.query({
            query: () => `${WASTE_URL}/recent-reports/`,
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
            query: () => `${WASTE_URL}/collector/collected-waste/`,
        }),

        saveCollectedWaste: builder.mutation({
            query: (collectedWasteData) => ({
                url: `${WASTE_URL}/save-collected-waste/`,
                method: 'POST',
                body: collectedWasteData,
            }),
        }),

        // Task Endpoints
        getWasteCollectionTasks: builder.query({
            query: () => `${WASTE_URL}/waste-collection-tasks/`,
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
