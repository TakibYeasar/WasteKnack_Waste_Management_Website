import { apiSlice } from "../../api/apiSlice";
import { TRANSACTION_URL } from "../../constant";

export const transactionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch reward transactions for a user
        getRewardTransactions: builder.query({
            query: () => `${TRANSACTION_URL}/transactions/`,
        }),

        // Create a new transaction
        createTransaction: builder.mutation({
            query: (transaction) => ({
                url: `${TRANSACTION_URL}/create-transactions/`,
                method: 'POST',
                body: transaction,
            }),
        }),

        // Fetch the user balance
        getUserBalance: builder.query({
            query: () => `${TRANSACTION_URL}/balance/`,
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useGetRewardTransactionsQuery,
    useCreateTransactionMutation,
    useGetUserBalanceQuery,
} = transactionApi;
