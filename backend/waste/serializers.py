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


class CollectedWasteCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectedWaste
        fields = ["report", "collector", "status"]

class CollectedWasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectedWaste
        fields = '__all__'
