from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'trans_type', 'amount', 'date')
    list_filter = ('trans_type', 'date')
    search_fields = ('user__email', 'description')
    readonly_fields = ('date',)
    date_hierarchy = 'date'
    ordering = ('-date',)
