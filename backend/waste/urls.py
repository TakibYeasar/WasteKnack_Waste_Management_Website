from django.urls import path
from .views import *

urlpatterns = [
    path('create-report/', CreateReportAPIView.as_view(), name='create-report'),
    path('user-reports/',
         GetReportsByUserAPIView.as_view(), name='get-reports-by-user'),
    path('collected-waste/create/', CreateCollectedWasteAPIView.as_view(),
         name='create-collected-waste'),
    path('collector/collected-waste/',
         GetCollectedWastesByCollectorAPIView.as_view(), name='get-collected-wastes-by-collector'),
    path('pending-reports/', GetPendingReportsAPIView.as_view(),
         name='get-pending-reports'),
    path('reports/<int:report_id>/update-status/',
         UpdateReportStatusAPIView.as_view(), name='update-report-status'),
    path('recent-reports/', GetRecentReportsAPIView.as_view(),
         name='get-recent-reports'),
    path('waste-collection-tasks/', GetWasteCollectionTasksAPIView.as_view(),
         name='get-waste-collection-tasks'),
    path('save-collected-waste/', SaveCollectedWasteAPIView.as_view(),
         name='save-collected-waste'),
    path('tasks/<int:report_id>/update-status/',
         UpdateTaskStatusAPIView.as_view(), name='update-task-status'),
]
