import { apiSlice } from "../../api/apiSlice";
import { WASTE_URL } from "../../constant";

export const wasteApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        dashboardOverview: builder.query({
            query: () => `${WASTE_URL}/dashboard/`,
        }),

        manageReports: builder.query({
            query: () => `${WASTE_URL}/manage-reports/`,
        }),

        removeReport: builder.mutation({
            query: (id) => ({
                url: `${WASTE_URL}/reports/${id}/remove/`,
                method: "DELETE",
            }),
        }),

        createReport: builder.mutation({
            query: (newReport) => ({
                url: `${WASTE_URL}/reports/`,
                method: 'POST',
                body: newReport,
            }),
        }),

        getReportsByUser: builder.query({
            query: () => `${WASTE_URL}/reports/`,
        }),

        getPendingReports: builder.query({
            query: () => `${WASTE_URL}/pending-reports/`,
        }),

        getRecentReports: builder.query({
            query: () => `${WASTE_URL}/recent-reports/`,
        }),

        createCollectedWaste: builder.mutation({
            query: ({ reportId, collectedWasteData }) => ({
                url: `${WASTE_URL}/collected-waste/`,
                method: 'POST',
                body: { ...collectedWasteData, report_id: reportId },
            }),
        }),

        updateCollectedWasteStatus: builder.mutation({
            query: ({ wasteId, status }) => ({
                url: `${WASTE_URL}/collected-waste/${wasteId}/`,
                method: 'PATCH',
                body: { status },
            }),
        }),

        getCollectedWastesByCollector: builder.query({
            query: () => `${WASTE_URL}/collected-waste/`,
        }),

        getWasteCollectionTasks: builder.query({
            query: () => `${WASTE_URL}/waste-collection-tasks/`,
        }),
    }),
});

export const {
    useDashboardOverviewQuery,
    useManageReportsQuery,
    useRemoveReportMutation,
    useCreateReportMutation,
    useGetReportsByUserQuery,
    useGetPendingReportsQuery,
    useGetRecentReportsQuery,
    useCreateCollectedWasteMutation,
    useUpdateCollectedWasteStatusMutation,
    useGetCollectedWastesByCollectorQuery,
    useGetWasteCollectionTasksQuery,
} = wasteApi;
