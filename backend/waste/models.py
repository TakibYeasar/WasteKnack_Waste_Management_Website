from django.db import models
from django.conf import settings

class Report(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='reports', on_delete=models.CASCADE)
    location = models.TextField()
    waste_type = models.CharField(max_length=255)
    amount = models.CharField(max_length=255)
    image = models.ImageField(blank=True, null=True)
    verification_result = models.JSONField(blank=True, null=True)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report {self.id} by {self.user.email}"


class CollectedWaste(models.Model):
    STATUS_CHOICES = [
        ('collected', 'Collected'),
        ('pending', 'Pending'),
    ]
    
    report = models.ForeignKey(Report, related_name='collected_wastes', on_delete=models.CASCADE)
    collector = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='collections', on_delete=models.CASCADE)
    collection_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='collected')

    def __str__(self):
        return f"CollectedWaste {self.id} by {self.collector.email}"

