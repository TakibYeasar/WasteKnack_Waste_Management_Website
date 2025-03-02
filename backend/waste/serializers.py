from rest_framework import serializers
from .models import *

class ReportCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["location", "waste_type", "amount"]


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
