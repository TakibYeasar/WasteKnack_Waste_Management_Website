from django.contrib import admin
from .models import Report, CollectedWaste


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'location', 'waste_type',
                    'amount', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('user__email', 'location', 'waste_type')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)


@admin.register(CollectedWaste)
class CollectedWasteAdmin(admin.ModelAdmin):
    list_display = ('id', 'report', 'collector', 'collection_date')
    search_fields = ('collector__email', 'report__id')
    date_hierarchy = 'collection_date'
    ordering = ('-collection_date',)
