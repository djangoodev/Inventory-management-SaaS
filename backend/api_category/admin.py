from django.contrib import admin
from api_category import models


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('pk', 'parent', 'title')
