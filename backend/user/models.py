from django.db import models
from django.conf import settings


class UserProfile(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             related_name='profile', on_delete=models.CASCADE)
    address = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='profiles/', blank=True, null=True)
    
    # Collector-specific fields
    collection_area = models.CharField(max_length=255, blank=True, null=True)
    vehicle_number = models.CharField(max_length=20, blank=True, null=True)
    license_number = models.CharField(max_length=50, blank=True, null=True)

    # Admin-specific fields
    admin_notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.username


class Reward(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='rewards', on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    description = models.TextField(blank=True, null=True)
    name = models.CharField(max_length=255)
    collection_info = models.TextField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Reward {self.name} for {self.user.email}"
