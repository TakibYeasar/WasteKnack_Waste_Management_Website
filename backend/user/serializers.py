from rest_framework import serializers
from .models import *


class RewardCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = ["user", "points", "level",
                  "description", "name", "collection_info", "is_available"]


class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__'
