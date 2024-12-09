from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, OneTimePassword


class CustomUserAdmin(BaseUserAdmin):
    # Fields to be displayed in the User model list
    list_display = ["id", "email", "username", "first_name",
                    "last_name", "role", "is_active", "is_staff", "is_superuser"]
    list_filter = ["role", "is_active", "is_staff", "is_superuser"]

    # Fieldsets for the detail view of the User
    fieldsets = (
        ('User Credentials', {"fields": ["email", "password"]}),
        ("Personal Info", {"fields": [
         "username", "first_name", "last_name", "role"]}),
        ("Permissions", {"fields": [
         "is_active", "is_staff", "is_superuser", "is_verified", "groups", "user_permissions"]}),
        ("Additional Info", {"fields": ["last_login", "date_joined"]}),
    )

    # Fieldsets for adding a new user
    add_fieldsets = (
        (None, {
            "classes": ["wide"],
            "fields": ["email", "username", "first_name", "last_name", "role", "password1", "password2"],
        }),
    )

    search_fields = ["email", "username", "first_name", "last_name"]
    ordering = ["email", "id"]
    filter_horizontal = ["groups", "user_permissions"]

    # Mark 'last_login' and 'date_joined' as read-only
    readonly_fields = ["last_login", "date_joined"]

    def save_model(self, request, obj, form, change):
        if not change:  # If creating a new user
            obj.set_password(form.cleaned_data["password1"])
        super().save_model(request, obj, form, change)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(OneTimePassword)
