from django.urls import path
from .views import *

urlpatterns = [
    path('transactions/<int:user_id>/',
         RewardTransactionsAPIView.as_view(), name='reward-transactions'),
    path('transactions/create/', CreateTransactionAPIView.as_view(),
         name='create-transaction'),
    path('balance/<int:user_id>/',
         UserBalanceAPIView.as_view(), name='user-balance'),
]
