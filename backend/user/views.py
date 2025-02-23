from django.utils.timezone import now
from django.shortcuts import get_object_or_404
from django.db import transaction
from transaction.models import Transaction
from .models import Reward
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied


class GetOrCreateRewardView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user

        # Check if a reward already exists for this user.
        reward = Reward.objects.filter(user=user).first()
        if reward:
            serializer = RewardSerializer(reward)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # If no reward exists, validate and create one using the provided data.
        serializer = RewardCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # The serializer's save() method will create a new Reward and automatically associate the current user.
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UpdateRewardPointsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        user = request.user
        
        points_to_add = request.data.get('points_to_add', 0)
        reward = get_object_or_404(Reward, user=user)
        reward.points += points_to_add
        reward.updated_at = now()
        reward.save()
        serializer = RewardCreateUpdateSerializer(reward)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SaveRewardView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        
        if user.role != "collector":
            raise PermissionDenied(
                "You do not have permission save reward.")

        serializer = RewardCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():  # Ensuring atomicity for both operations
                # Save the reward
                reward = serializer.save(user=user)  # Explicitly assign user

                # Create a transaction for the reward
                Transaction.objects.create(
                    user=user,
                    trans_type='earned',  # Ensure this matches the Transaction model field
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
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # if user != Reward.user:
        #     raise PermissionDenied(
        #         "You do not have permission to see availabel rewards.")
        
        user_rewards = Reward.objects.filter(user=user)
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
    permission_classes = [IsAuthenticated]
    
    def post(self, request, reward_id):
        user = request.user
        
        if user != Reward.user:
            raise PermissionDenied(
                "You do not have permission to Redeem Reward.")
            
        reward = get_object_or_404(Reward, user=user)
        with transaction.atomic():  # Ensuring atomicity for reward and transaction update
            if reward_id == 0:  # Clear all points
                redeemed_points = reward.points
                reward.points = 0
                reward.updated_at = now()
                reward.save()

                # Create a transaction for clearing all points
                Transaction.objects.create(
                    user=reward.user,
                    trans_type='redeemed',
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
                    trans_type='redeemed',
                    amount=redeemed_points,
                    description=f"Reward redeemed: {available_reward.name}"
                )

        serializer = RewardSerializer(reward)
        return Response(serializer.data, status=status.HTTP_200_OK)
