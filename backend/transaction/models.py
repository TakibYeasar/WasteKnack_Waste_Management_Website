from django.db import models
from django.conf import settings

class Transaction(models.Model):
    TYPE_CHOICES = [
        ('earned_report', 'Earned_Report'),
        ('earned_collect', 'Earned_Collect'),
        ('redeemed', 'Redeemed'),
    ]

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='transactions', on_delete=models.CASCADE)
    trans_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    amount = models.IntegerField()
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaction {self.id} for {self.user.email}"


