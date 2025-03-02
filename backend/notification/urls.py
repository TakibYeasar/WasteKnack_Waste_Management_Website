from django.urls import path
from .views import *

urlpatterns = [
    path('notifications/create/', CreateNotificationAPIView.as_view(),
         name='create-notification'),
    path('notifications/unread/', UnreadNotificationsAPIView.as_view(),
         name='unread-notifications'),
    path('notifications/<int:notification_id>/read/',
         MarkNotificationAsReadAPIView.as_view(), name='mark-notification-read'),
]
