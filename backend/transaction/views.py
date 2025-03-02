from rest_framework import generics, permissions
from .models import Transaction
from .serializers import *
from rest_framework.response import Response


class RewardTransactionsAPIView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')[:10]


class CreateTransactionAPIView(generics.CreateAPIView):
    serializer_class = TransactionCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserBalanceAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        transactions = Transaction.objects.filter(user=request.user)
        balance = sum(
            transaction.amount if transaction.trans_type.startswith(
                'earned') else -transaction.amount
            for transaction in transactions
        )
        return Response({"balance": max(balance, 0)})
