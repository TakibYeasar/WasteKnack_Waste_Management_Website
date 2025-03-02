from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from .models import Notification
from .serializers import *


class CreateNotificationAPIView(generics.CreateAPIView):
    serializer_class = NotificationCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UnreadNotificationsAPIView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user, is_read=False)


class MarkNotificationAsReadAPIView(generics.UpdateAPIView):
    serializer_class = NotificationCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'notification_id'

    def get_object(self):
        return get_object_or_404(Notification, id=self.kwargs['notification_id'])

    def perform_update(self, serializer):
        serializer.instance.is_read = True
        serializer.save()
