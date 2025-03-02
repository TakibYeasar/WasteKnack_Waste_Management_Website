import { apiSlice } from "../../api/apiSlice";
import { TRANSACTION_URL } from "../../constant";

export const transactionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRewardTransactions: builder.query({
            query: () => `${TRANSACTION_URL}/transactions/`,
        }),

        createTransaction: builder.mutation({
            query: (transaction) => ({
                url: `${TRANSACTION_URL}/transactions/create/`,
                method: 'POST',
                body: transaction,
            }),
        }),

        getUserBalance: builder.query({
            query: () => `${TRANSACTION_URL}/transactions/balance/`,
        }),
    }),
});

export const {
    useGetRewardTransactionsQuery,
    useCreateTransactionMutation,
    useGetUserBalanceQuery,
} = transactionApi;
