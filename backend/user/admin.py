from django.contrib import admin
from .models import Reward, UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'address', 'role_display')
    list_filter = ('user__role',)
    search_fields = ('user__username', 'user__email', 'phone_number')
    ordering = ('user__role',)

    fieldsets = (
        ("Basic Information", {
            "fields": ("user", "phone_number", "address", "profile_picture")
        }),
        ("Collector Details", {
            "fields": ("collection_area", "vehicle_number", "license_number"),
            # Makes it collapsible in the admin panel
            "classes": ("collapse",),
        }),
        ("Admin Details", {
            "fields": ("admin_notes",),
            "classes": ("collapse",),
        }),
    )

    def role_display(self, obj):
        return obj.user.role
    role_display.short_description = "User Role"


@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'points',
                    'level', 'is_available', 'created_at')
    list_filter = ('level', 'is_available')
    search_fields = ('user__email', 'name')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
