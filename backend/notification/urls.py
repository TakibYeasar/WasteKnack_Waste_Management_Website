from django.urls import path
from .views import *

urlpatterns = [
    path('create-notification', CreateNotificationAPIView.as_view(),
         name='create-notification'),
    path('unread-notifications/',
         UnreadNotificationsAPIView.as_view(), name='unread-notifications'),
    path('notifications/mark-read/<int:notification_id>/',
         MarkNotificationAsReadAPIView.as_view(), name='mark-notification-as-read'),
]
