from django.urls import path
from .views import *

urlpatterns = [
    path('transactions/', RewardTransactionsAPIView.as_view(),
         name='reward-transactions'),
    path('transactions/create/', CreateTransactionAPIView.as_view(),
         name='create-transaction'),
    path('transactions/balance/', UserBalanceAPIView.as_view(), name='user-balance'),
]
