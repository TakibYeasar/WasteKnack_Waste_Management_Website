from rest_framework import serializers
from .models import *


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'


class CollectedWasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectedWaste
        fields = '__all__'
