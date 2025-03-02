from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Register viewsets with a router
router = DefaultRouter()
router.register(r'reports', ReportViewSet, basename='report')
router.register(r'collected-waste', CollectedWasteViewSet,
                basename='collected-waste')

urlpatterns = [
    path('', include(router.urls)),  # Includes all routes from viewsets
    path('pending-reports/', PendingReportsListView.as_view(),
         name='pending-reports'),
    path('recent-reports/', RecentReportsListView.as_view(), name='recent-reports'),
    path('waste-collection-tasks/', WasteCollectionTasksListView.as_view(),
         name='waste-collection-tasks'),
]
