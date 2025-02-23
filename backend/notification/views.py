from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import *


class CreateNotificationAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Create a new notification for a user.
        """
        user = request.user
        data = request.data
        notification = Notification.objects.create(
            user=user,
            message=data['message'],
            message_type=data['message_type']
        )
        serializer = NotificationCreateUpdateSerializer(notification)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UnreadNotificationsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Fetch unread notifications for a given user.
        """
        user = request.user
        notifications = Notification.objects.filter(
            user=user, is_read=False)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MarkNotificationAsReadAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, notification_id):
        """
        Mark a specific notification as read.
        """
        notification = get_object_or_404(Notification, id=notification_id)
        notification.is_read = True
        notification.save()
        serializer = NotificationCreateUpdateSerializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)

