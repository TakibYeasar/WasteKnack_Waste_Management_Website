from rest_framework import serializers
from .models import *


class ReportCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["image", "location", "waste_type",
                  "amount", "verification_result"]


class ReportCollectorSerializer(serializers.ModelSerializer):
    collector = serializers.CharField(
        source='collector.username')
    collection_date = serializers.DateTimeField(
        format="%Y-%m-%d")

    class Meta:
        model = CollectedWaste
        fields = ['collector', 'collection_date']


class ReportSerializer(serializers.ModelSerializer):
    collected_wastes = ReportCollectorSerializer(many=True, read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'user', 'location', 'waste_type', 'amount', 'image',
            'verification_result', 'status', 'created_at', 'collected_wastes'
        ]
        read_only_fields = ['created_at', 'collected_wastes']


class CollectWasteCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectedWaste
        fields = '__all__'
        extra_kwargs = {
            'report': {'read_only': True},
            'collector': {'read_only': True},
        }


class CollectedWasteSerializer(serializers.ModelSerializer):
    report = ReportSerializer(read_only=True)

    class Meta:
        model = CollectedWaste
        fields = ['id', 'report']

