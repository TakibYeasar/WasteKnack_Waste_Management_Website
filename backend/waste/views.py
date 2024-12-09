from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Report, CollectedWaste
from .serializers import ReportSerializer, CollectedWasteSerializer


class CreateReportAPIView(APIView):
    def post(self, request):
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # Logic for awarding points, creating notifications, etc., can be added here
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetReportsByUserAPIView(APIView):
    def get(self, request, user_id):
        reports = Report.objects.filter(user_id=user_id)
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data)


class CreateCollectedWasteAPIView(APIView):
    def post(self, request):
        serializer = CollectedWasteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetCollectedWastesByCollectorAPIView(APIView):
    def get(self, request, collector_id):
        collected_wastes = CollectedWaste.objects.filter(
            collector_id=collector_id)
        serializer = CollectedWasteSerializer(collected_wastes, many=True)
        return Response(serializer.data)


class GetPendingReportsAPIView(APIView):
    def get(self, request):
        pending_reports = Report.objects.filter(status='pending')
        serializer = ReportSerializer(pending_reports, many=True)
        return Response(serializer.data)


class UpdateReportStatusAPIView(APIView):
    def patch(self, request, report_id):
        report = get_object_or_404(Report, id=report_id)
        serializer = ReportSerializer(report, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetRecentReportsAPIView(APIView):
    def get(self, request, limit=10):
        recent_reports = Report.objects.order_by('-created_at')[:limit]
        serializer = ReportSerializer(recent_reports, many=True)
        return Response(serializer.data)


class GetWasteCollectionTasksAPIView(APIView):
    def get(self, request, limit=20):
        tasks = Report.objects.all()[:limit]
        serializer = ReportSerializer(tasks, many=True)
        return Response(serializer.data)


class SaveCollectedWasteAPIView(APIView):
    def post(self, request):
        serializer = CollectedWasteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateTaskStatusAPIView(APIView):
    def patch(self, request, report_id):
        report = get_object_or_404(Report, id=report_id)
        data = request.data
        serializer = ReportSerializer(report, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
