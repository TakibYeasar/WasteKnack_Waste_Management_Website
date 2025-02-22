import { apiSlice } from "../../api/apiSlice";
import { TRANSACTION_URL } from "../../constant";

export const transactionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch reward transactions for a user
        getRewardTransactions: builder.query({
            query: (userId) => `${TRANSACTION_URL}/transactions/${userId}/`,
            providesTags: (result, error, userId) => [{ type: 'Transaction', id: userId }],
        }),

        // Create a new transaction
        createTransaction: builder.mutation({
            query: (transaction) => ({
                url: `${TRANSACTION_URL}/transactions/create/`,
                method: 'POST',
                body: transaction,
            }),
            invalidatesTags: ['Transaction', 'Balance'],
        }),

        // Fetch the user balance
        getUserBalance: builder.query({
            query: (userId) => `${TRANSACTION_URL}/balance/${userId}/`,
            providesTags: (result, error, userId) => [{ type: 'Balance', id: userId }],
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useGetRewardTransactionsQuery,
    useCreateTransactionMutation,
    useGetUserBalanceQuery,
} = transactionApi;
