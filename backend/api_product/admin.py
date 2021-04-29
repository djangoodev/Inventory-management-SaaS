from django.contrib import admin
from api_product import models


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'image_urls', 'description', 'categories', 'cost_price', 'sales_price', 'discount',
                  'color', 'size', 'dimension', 'weight', 'added_by', 'added_on', 'modified_on')
