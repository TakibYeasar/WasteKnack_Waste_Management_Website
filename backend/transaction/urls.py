from django.urls import path
from .views import *

urlpatterns = [
    path('transactions/',
         RewardTransactionsAPIView.as_view(), name='reward-transactions'),
    path('create-transactions/', CreateTransactionAPIView.as_view(),
         name='create-transaction'),
    path('balance/',
         UserBalanceAPIView.as_view(), name='user-balance'),
]
