from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'message_type',
                    'message', 'is_read', 'created_at')
    list_filter = ('message_type', 'is_read', 'created_at')
    search_fields = ('user__email', 'message')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

    actions = ['mark_as_read']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected notifications as read"
