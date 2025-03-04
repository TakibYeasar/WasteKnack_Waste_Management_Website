from django.db import models
from django.conf import settings
from django.db.models import F


class Report(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             related_name='reports', on_delete=models.CASCADE)
    location = models.TextField()
    waste_type = models.CharField(max_length=255)
    amount = models.CharField(max_length=255)
    image = models.ImageField(upload_to="waste/report/")
    verification_result = models.JSONField(blank=True, null=True)
    status = models.CharField(
        max_length=255, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report {self.id} by {self.user.email}"

    def delete(self, *args, **kwargs):
        # Update the collector points here if needed, or you can just ignore point changes
        # If you are using a field to track points, for example:
        # self.user.points += F('points') # You can do custom calculations here

        # We delete the related `CollectedWaste` instances without affecting the user's points
        # This way, the collector's points remain unchanged
        collected_wastes = self.collected_wastes.all()
        for collected_waste in collected_wastes:
            # Handle any extra logic if needed (e.g., updating collector's point)
            pass  # No change to collector's points

        # Finally, delete the report instance
        super(Report, self).delete(*args, **kwargs)


class CollectedWaste(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('verified', 'Verified'),
    ]

    report = models.ForeignKey(
        Report, related_name='collected_wastes', on_delete=models.CASCADE)
    collector = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='collections', on_delete=models.CASCADE)
    collection_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='in_progress')

    def __str__(self):
        return f"CollectedWaste {self.id} by {self.collector.email}"
