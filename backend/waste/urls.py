from django.urls import path
from .views import *

urlpatterns = [
    path('reports/create/', CreateReportAPIView.as_view(), name='create-report'),
    path('reports/user/<int:user_id>/',
         GetReportsByUserAPIView.as_view(), name='get-reports-by-user'),
    path('collected-waste/create/', CreateCollectedWasteAPIView.as_view(),
         name='create-collected-waste'),
    path('collected-waste/collector/<int:collector_id>/',
         GetCollectedWastesByCollectorAPIView.as_view(), name='get-collected-wastes-by-collector'),
    path('reports/pending/', GetPendingReportsAPIView.as_view(),
         name='get-pending-reports'),
    path('reports/<int:report_id>/update-status/',
         UpdateReportStatusAPIView.as_view(), name='update-report-status'),
    path('reports/recent/', GetRecentReportsAPIView.as_view(),
         name='get-recent-reports'),
    path('tasks/waste-collection/', GetWasteCollectionTasksAPIView.as_view(),
         name='get-waste-collection-tasks'),
    path('collected-waste/save/', SaveCollectedWasteAPIView.as_view(),
         name='save-collected-waste'),
    path('tasks/<int:report_id>/update-status/',
         UpdateTaskStatusAPIView.as_view(), name='update-task-status'),
]
