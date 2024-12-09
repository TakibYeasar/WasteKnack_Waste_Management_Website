from django.urls import path
from .views import *

urlpatterns = [
    path('reward/<int:user_id>/get-or-create/',
         GetOrCreateRewardView.as_view(), name='get_or_create_reward'),
    path('reward/<int:user_id>/update-points/',
         UpdateRewardPointsView.as_view(), name='update_reward_points'),
    path('reward/<int:user_id>/save/',
         SaveRewardView.as_view(), name='save_reward'),
    path('rewards/', GetAllRewardsView.as_view(), name='get_all_rewards'),
    path('rewards/<int:user_id>/available/',
         GetAvailableRewardsView.as_view(), name='get_available_rewards'),
    path('reward/<int:user_id>/redeem/<int:reward_id>/',
         RedeemRewardView.as_view(), name='redeem_reward'),
]
