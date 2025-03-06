from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.db.models import Sum
from django.db import transaction
from authapi.models import CustomUser
from .models import Report, CollectedWaste
from .serializers import *
from user.models import Reward
from transaction.models import Transaction
from notification.models import Notification


class DashboardOverview(APIView):
    def get(self, request):
        total_users = CustomUser.objects.count()
        total_reports = Report.objects.count()
        pending_report = Report.objects.filter(status='pending').count()
        progress_report = Report.objects.filter(status='in_progress').count()
        collected_waste = Report.objects.filter(status='verified').count()
        data = {
            'total_users': total_users,
            'total_reports': total_reports,
            'pending_report': pending_report,
            'progress_report': progress_report,
            'collected_waste': collected_waste,
        }

        return Response(data)

class ManageReportsView(generics.ListAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != "admin":
            raise PermissionDenied("You do not have permission to view reports.")
        return super().get_queryset()


class RemoveReportView(generics.DestroyAPIView):
    queryset = Report.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        if request.user.role != 'admin':
            raise PermissionDenied(
                "You do not have permission to delete report.")

        report = get_object_or_404(Report, id=kwargs['id'])
        report.delete()
        return Response({"message": "Report deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class ReportViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Report.objects.all().order_by('-created_at')
    serializer_class = ReportSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'user':
            return Report.objects.filter(user=user)
        elif user.role == 'collector':
            return Report.objects.filter(status='verified')
        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        user = request.user
        if user.role != 'user':
            raise PermissionDenied(
                "You do not have permission to create a report.")

        serializer = ReportCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                report = serializer.save(user=user, status='pending')
                reward, _ = Reward.objects.get_or_create(user=user)
                reward.points += 10
                reward.save()

                Transaction.objects.create(
                    user=user, trans_type='earned', amount=10,
                    description="Points earned for reporting waste."
                )

                Notification.objects.create(
                    user=user, message="You have earned 10 points for reporting waste!",
                    message_type='success'
                )
            return Response(ReportSerializer(report).data, status=201)
        return Response(serializer.errors, status=400)


class PendingReportsListView(generics.ListAPIView):
    queryset = Report.objects.filter(status='pending')
    serializer_class = ReportSerializer


class RecentReportsListView(generics.ListAPIView):
    serializer_class = ReportSerializer

    def get_queryset(self):
        limit = self.request.query_params.get('limit', 10)
        return Report.objects.order_by('-created_at')[:int(limit)]


class WasteCollectionTasksListView(generics.ListAPIView):
    serializer_class = ReportSerializer

    def get_queryset(self):
        limit = self.request.query_params.get('limit', 20)
        return Report.objects.filter()[:int(limit)]


class CollectedWasteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = CollectedWaste.objects.all().order_by('-collection_date')
    serializer_class = CollectedWasteSerializer

    def get_queryset(self):
        """Limit the queryset to the collector's own collected wastes if they are a collector."""
        user = self.request.user
        if user.role == 'collector':
            return CollectedWaste.objects.filter(collector=user)
        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        """Create a new collected waste entry."""
        user = request.user
        report_id = request.data.get('report_id')
        report = get_object_or_404(Report, id=report_id)

        if user.role != 'collector':
            raise PermissionDenied(
                "You do not have permission to collect waste.")

        serializer = CollectWasteCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                # Create a new CollectedWaste record
                collected_waste = serializer.save(
                    report=report,
                    collector=user,
                    status='in_progress'  # Default status
                )

                # Update the report status
                report.status = 'in_progress'
                report.save()

                # Return the serialized response
                return Response(CollectedWasteSerializer(collected_waste).data, status=status.HTTP_201_CREATED)

        # If validation fails, return errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        """Handle PATCH requests to update the collected waste status."""
        user = request.user
        collected_waste = get_object_or_404(
            CollectedWaste, id=kwargs.get('pk'))
        new_status = request.data.get('status')

        if user.role != 'collector':
            raise PermissionDenied(
                "You do not have permission to collect waste.")

        if new_status not in dict(CollectedWaste.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            # Update the collected waste status
            collected_waste.roport.status = new_status
            collected_waste.save()

            # If the status is "verified", update the report and create rewards/transactions
            if new_status == 'verified':
                report = collected_waste.report
                if report.status != 'verified':  # Prevent updating if already verified
                    report.status = 'verified'
                    report.save()

                    # Reward the collector
                    reward = Reward.objects.create(
                        user=collected_waste.collector,
                        name="Waste Collection Reward",
                        points=10
                    )

                    # Record the transaction
                    Transaction.objects.create(
                        user=collected_waste.collector,
                        trans_type='earned',
                        amount=reward.points,
                        description=f"Reward earned: {reward.name}"
                    )

            # Return the updated CollectedWaste details
            return Response(CollectedWasteSerializer(collected_waste).data)

