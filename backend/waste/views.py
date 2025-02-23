from django.shortcuts import get_object_or_404
from .models import Report, CollectedWaste
from user.models import Reward
from transaction.models import Transaction
from notification.models import Notification
from django.db import transaction
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied


class CreateReportAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    
    def post(self, request):
        
        user = request.user
        if user.role != 'user':
            raise PermissionDenied(
                "You do not have permission to Create a Report.")
            
        serializer = ReportCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():  # Ensure atomicity for all operations
                # Save the report
                report = serializer.save(user=request.user)

                # Update or create a reward record
                reward, created = Reward.objects.get_or_create(
                    user=report.user)
                reward.points += 10
                reward.save()

                # Create a transaction for the earned points
                Transaction.objects.create(
                    user=report.user,
                    trans_type='earned',
                    amount=10,
                    description="Points earned for reporting waste."
                )

                # Create a notification for the user
                Notification.objects.create(
                    user=report.user,
                    message="You have earned 10 points for reporting waste!",
                    message_type='success'
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetReportsByUserAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if user.role != 'user':
            raise PermissionDenied(
                "You do not have permission to see reports.")
            
        reports = Report.objects.filter(user=user)
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data)


class CreateCollectedWasteAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        
        user = request.user
        if user.role != 'collector':
            raise PermissionDenied(
                "You do not have permission to Collect Waste.")
            
        serializer = CollectedWasteCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetCollectedWastesByCollectorAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if user.role != 'collector':
            raise PermissionDenied(
                "You do not have permission to see Collected Waste.")
        
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
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, report_id):
        report = get_object_or_404(Report, id=report_id)
        serializer = ReportCreateUpdateSerializer(report, data=request.data, partial=True)
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
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        report_id = request.data.get('report')
        report = get_object_or_404(Report, id=report_id)

        if report.status != 'verified':
            return Response({'error': 'Report must be verified before collection'}, status=status.HTTP_400_BAD_REQUEST)

        collected_waste_data = {
            'report': report.id,
            'collector': user.id,
            'status': 'collected',
        }

        serializer = CollectedWasteCreateUpdateSerializer(data=collected_waste_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateTaskStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, report_id):
        user = request.user
        report = get_object_or_404(Report, id=report_id)
        new_status = request.data.get('status')
        collector_id = request.data.get('collector')

        if new_status not in dict(Report.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        update_data = {'status': new_status}

        if collector_id:
            collector = get_object_or_404(user, id=collector_id)
            update_data['collector'] = collector

        serializer = ReportSerializer(report, data=update_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
