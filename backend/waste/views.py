from django.shortcuts import get_object_or_404
from .models import Report, CollectedWaste
from user.models import Reward
from transaction.models import Transaction
from notification.models import Notification
from django.db import transaction
from .serializers import ReportSerializer, CollectedWasteSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied


class CreateReportAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    
    def post(self, request):
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():  # Ensure atomicity for all operations
                # Save the report
                report = serializer.save()

                # Update or create a reward record
                reward = Reward.objects.get_or_create(
                    user=report.user)
                reward.points += 10
                reward.save()

                # Create a transaction for the earned points
                Transaction.objects.create(
                    user=report.user,
                    type='earned',
                    amount=10,
                    description="Points earned for reporting waste."
                )

                # Create a notification for the user
                Notification.objects.create(
                    user=report.user,
                    message="You have earned 10 points for reporting waste!",
                    type='success'
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetReportsByUserAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        reports = Report.objects.filter(user=user)
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
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        collected_wastes = CollectedWaste.objects.filter(
            collector=user)
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
