from django.urls import path
from .views import *

urlpatterns = [
    path('notifications/create/', CreateNotificationAPIView.as_view(),
         name='create-notification'),
    path('notifications/unread/<int:user_id>/',
         UnreadNotificationsAPIView.as_view(), name='unread-notifications'),
    path('notifications/mark-read/<int:notification_id>/',
         MarkNotificationAsReadAPIView.as_view(), name='mark-notification-as-read'),
]
