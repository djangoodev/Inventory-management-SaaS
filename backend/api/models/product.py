from django.db import models
from api.models import Company


class Product(models.Model):
    name = models.CharField(max_length=400, blank=True, default='')
    description = models.TextField(blank=True, default='')
    image = models.TextField(blank=True, default='')
    sku = models.CharField(max_length=400, blank=True, default='')
    price = models.FloatField(default=0)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=False)


class VariationType(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    type = models.CharField(max_length=400, blank=True, default='')


class VariationTypeAttribute(models.Model):
    variation_type = models.ForeignKey(VariationType, on_delete=models.CASCADE)
    attribute = models.CharField(max_length=400, blank=True, default='')


class Variation(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    title = models.CharField(max_length=400, blank=True, default='')        # option1/option2/option3/....
    sku = models.CharField(max_length=400, blank=True, default='')
    barcode = models.CharField(max_length=400, blank=True, default='')
    image = models.CharField(max_length=400, blank=True, default='')
    price = models.CharField(max_length=400, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
