from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Transaction
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied


class RewardTransactionsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # if user != Transaction.user:
        #     raise PermissionDenied(
        #         "You do not have permission to see the transaction.")
            
        transactions = Transaction.objects.filter(
            user=user).order_by('-date')[:10]
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateTransactionAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        data = request.data
        transaction = Transaction.objects.create(
            user=user,
            trans_type=data['trans_type'],
            amount=data['amount'],
            description=data['description']
        )
        serializer = TransactionCreateUpdateSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserBalanceAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user != Transaction.user:
            raise PermissionDenied(
                "You do not have permission to see the ballance.")
            
            
        transactions = Transaction.objects.filter(user=user)
        balance = 0
        for transaction in transactions:
            if transaction.trans_type.startswith('earned'):
                balance += transaction.amount
            else:
                balance -= transaction.amount
        balance = max(balance, 0)
        return Response({"balance": balance}, status=status.HTTP_200_OK)
