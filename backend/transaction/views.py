from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from authapi.models import CustomUser
from .models import Transaction
from .serializers import TransactionSerializer
from django.contrib.auth import get_user_model


class RewardTransactionsAPIView(APIView):
    def get(self, request, user_id):
        """
        Fetch transactions for a given user, sorted by date and limited to 10.
        """
        transactions = Transaction.objects.filter(
            user_id=user_id).order_by('-date')[:10]
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateTransactionAPIView(APIView):
    def post(self, request):
        """
        Create a new transaction for a user.
        """
        data = request.data
        user = get_object_or_404(CustomUser, id=data.get('user_id'))
        transaction = Transaction.objects.create(
            user=user,
            type=data['type'],
            amount=data['amount'],
            description=data['description']
        )
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserBalanceAPIView(APIView):
    def get(self, request, user_id):
        """
        Calculate and return the user's current balance.
        """
        transactions = Transaction.objects.filter(user_id=user_id)
        balance = 0
        for transaction in transactions:
            if transaction.type.startswith('earned'):
                balance += transaction.amount
            else:
                balance -= transaction.amount
        balance = max(balance, 0)
        return Response({"balance": balance}, status=status.HTTP_200_OK)
