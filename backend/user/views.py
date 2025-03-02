from django.utils.timezone import now
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import Sum
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from transaction.models import Transaction
from .models import Reward
from .serializers import *


class RewardViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RewardSerializer

    def get_queryset(self):
        return Reward.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        """Ensure that a reward is assigned to the authenticated user"""
        serializer.save(user=self.request.user)


class UpdateRewardPointsView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RewardCreateUpdateSerializer

    def get_object(self):
        return get_object_or_404(Reward, user=self.request.user)

    def patch(self, request, *args, **kwargs):
        reward = self.get_object()
        points_to_add = request.data.get('points_to_add', 0)
        reward.points += points_to_add
        reward.updated_at = now()
        reward.save()
        return Response(RewardSerializer(reward).data, status=status.HTTP_200_OK)


class GetAllRewardsView(generics.ListAPIView):
    queryset = Reward.objects.all().order_by('-points')
    serializer_class = RewardSerializer


class GetAvailableRewardsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RewardSerializer

    def get(self, request):
        user = request.user

        user_points = Reward.objects.filter(user=user).aggregate(
            total_points=Sum('points'))['total_points'] or 0

        available_rewards = Reward.objects.filter(is_available=True)
        rewards_data = RewardSerializer(available_rewards, many=True).data

        response_data = {
            "user_points": {
                "id": 0,
                "name": "Your Points",
                "cost": user_points,
                "description": "Redeem your earned points",
                "collection_info": "Points earned from reporting / collecting waste",
            },
            "available_rewards": rewards_data,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class RedeemRewardView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, reward_id):
        user = request.user
        reward = get_object_or_404(Reward, user=user)

        with transaction.atomic():
            if reward_id == 0:  # Clear all points
                redeemed_points = reward.points
                reward.points = 0
                reward.updated_at = now()
                reward.save()

                Transaction.objects.create(
                    user=user,
                    trans_type='redeemed',
                    amount=redeemed_points,
                    description="All reward points redeemed."
                )

            else:  # Redeem a specific reward
                available_reward = get_object_or_404(
                    Reward, id=reward_id, is_available=True)

                if reward.points < available_reward.points:
                    return Response({'detail': 'Insufficient points or invalid reward'}, status=status.HTTP_400_BAD_REQUEST)

                redeemed_points = available_reward.points
                reward.points -= redeemed_points
                reward.updated_at = now()
                reward.save()

                Transaction.objects.create(
                    user=user,
                    trans_type='redeemed',
                    amount=redeemed_points,
                    description=f"Reward redeemed: {available_reward.name}"
                )

        return Response(RewardSerializer(reward).data, status=status.HTTP_200_OK)
