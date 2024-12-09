from django.db import models
from django.conf import settings

class Reward(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='rewards', on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_available = models.BooleanField(default=True)
    description = models.TextField(blank=True, null=True)
    name = models.CharField(max_length=255)
    collection_info = models.TextField()

    def __str__(self):
        return f"Reward {self.name} for {self.user.email}"
