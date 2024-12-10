from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction
from transaction.models import Transaction
from .models import Reward
from .serializers import RewardSerializer


class GetOrCreateRewardView(APIView):
    def post(self, request, user_id):
        reward, created = Reward.objects.get_or_create(
            user_id=user_id,
            defaults={
                'name': 'Default Reward',
                'collection_info': 'Default Collection Info',
                'points': 0,
                'level': 1,
                'is_available': True,
            }
        )
        serializer = RewardSerializer(reward)
        return Response(serializer.data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)


class UpdateRewardPointsView(APIView):
    def patch(self, request, user_id):
        points_to_add = request.data.get('points_to_add', 0)
        reward = get_object_or_404(Reward, user_id=user_id)
        reward.points += points_to_add
        reward.updated_at = now()
        reward.save()
        serializer = RewardSerializer(reward)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SaveRewardView(APIView):
    def post(self, request, user_id):
        data = {
            'user': user_id,
            'name': 'Waste Collection Reward',
            'collection_info': 'Points earned from waste collection',
            'points': request.data.get('amount', 0),
            'level': 1,
            'is_available': True,
        }
        serializer = RewardSerializer(data=data)
        if serializer.is_valid():
            with transaction.atomic():  # Ensuring atomicity for both operations
                # Save the reward
                reward = serializer.save()

                # Create a transaction for the reward
                Transaction.objects.create(
                    user=reward.user,
                    type='earned',
                    amount=reward.points,
                    description=f"Reward earned: {reward.name}"
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetAllRewardsView(APIView):
    def get(self, request):
        rewards = Reward.objects.all().order_by('-points')
        serializer = RewardSerializer(rewards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetAvailableRewardsView(APIView):
    def get(self, request, user_id):
        user_rewards = Reward.objects.filter(user_id=user_id)
        user_points = sum(reward.points for reward in user_rewards)
        available_rewards = Reward.objects.filter(is_available=True)
        rewards_data = RewardSerializer(available_rewards, many=True).data
        rewards_data.insert(0, {
            'id': 0,
            'name': 'Your Points',
            'cost': user_points,
            'description': 'Redeem your earned points',
            'collection_info': 'Points earned from reporting and collecting waste',
        })
        return Response(rewards_data, status=status.HTTP_200_OK)


class RedeemRewardView(APIView):
    def post(self, request, user_id, reward_id):
        reward = get_object_or_404(Reward, user_id=user_id)

        with transaction.atomic():  # Ensuring atomicity for reward and transaction update
            if reward_id == 0:  # Clear all points
                redeemed_points = reward.points
                reward.points = 0
                reward.updated_at = now()
                reward.save()

                # Create a transaction for clearing all points
                Transaction.objects.create(
                    user=reward.user,
                    type='redeemed',
                    amount=redeemed_points,
                    description="All reward points redeemed."
                )
            else:  # Redeem a specific reward
                available_reward = get_object_or_404(
                    Reward, id=reward_id, is_available=True
                )
                if reward.points < available_reward.points:
                    return Response({'detail': 'Insufficient points or invalid reward'}, status=status.HTTP_400_BAD_REQUEST)

                redeemed_points = available_reward.points
                reward.points -= redeemed_points
                reward.updated_at = now()
                reward.save()

                # Create a transaction for the specific reward redemption
                Transaction.objects.create(
                    user=reward.user,
                    type='redeemed',
                    amount=redeemed_points,
                    description=f"Reward redeemed: {available_reward.name}"
                )

        serializer = RewardSerializer(reward)
        return Response(serializer.data, status=status.HTTP_200_OK)
