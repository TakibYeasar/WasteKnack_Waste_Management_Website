from rest_framework import serializers
from .models import UserProfile, Reward
from authapi.serializers import UserSerializer


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user']

    def to_representation(self, instance):
        """Return role-specific fields dynamically."""
        data = super().to_representation(instance)
        role = instance.user.role  # Get user role

        if role == 'admin':
            allowed_fields = ['user', 'address',
                              'phone_number', 'profile_picture', 'admin_notes']
        elif role == 'collector':
            allowed_fields = ['user', 'address', 'phone_number', 'profile_picture',
                              'collection_area', 'vehicle_number', 'license_number']
        else:  # user
            allowed_fields = ['user', 'address', 'phone_number',
                              'profile_picture', 'waste_collection_frequency']

        return {field: data[field] for field in allowed_fields if field in data}

    def validate(self, attrs):
        """Validate required fields based on user role."""
        user = self.context['request'].user
        role = user.role

        if role == 'collector':
            required_fields = ['collection_area',
                               'vehicle_number', 'license_number']
        elif role == 'user':
            required_fields = ['waste_collection_frequency']
        else:
            required_fields = []

        for field in required_fields:
            if not attrs.get(field):
                raise serializers.ValidationError(
                    {field: f"{field} is required for {role} role."})

        return attrs

class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__'


class RewardCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = ['points', 'level', 'description',
                  'name', 'collection_info', 'is_available']
