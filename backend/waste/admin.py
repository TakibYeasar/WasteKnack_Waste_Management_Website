from django.contrib import admin

from .models import (
    Report,
    CollectedWaste,
)

admin.site.register([
    Report,
    CollectedWaste,
])
