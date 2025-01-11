from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from authapi.models import CustomUser
from .models import Notification
from .serializers import NotificationSerializer
from django.contrib.auth import get_user_model


class CreateNotificationAPIView(APIView):
    def post(self, request):
        """
        Create a new notification for a user.
        """
        data = request.data
        user = get_object_or_404(CustomUser, id=data.get('user_id'))
        notification = Notification.objects.create(
            user=user,
            message=data['message'],
            type=data['type']
        )
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UnreadNotificationsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        """
        Fetch unread notifications for a given user.
        """
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
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)

