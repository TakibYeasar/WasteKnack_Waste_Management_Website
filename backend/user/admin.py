from django.contrib import admin
from .models import Reward


@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'points',
                    'level', 'is_available', 'created_at')
    list_filter = ('level', 'is_available')
    search_fields = ('user__email', 'name')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
