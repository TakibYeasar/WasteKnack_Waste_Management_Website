from rest_framework import serializers
from .models import *

class ReportCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["image", "location", "waste_type",
                  "amount", "verification_result"]


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'


class CollectWasteCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectedWaste
        fields = '__all__'
        extra_kwargs = {
            'report': {'read_only': True},
            'collector': {'read_only': True},
        }


class CollectedWasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectedWaste
        fields = '__all__'
