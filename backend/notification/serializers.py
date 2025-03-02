from rest_framework import serializers
from .models import Notification


class NotificationCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["message", "message_type", "is_read"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
