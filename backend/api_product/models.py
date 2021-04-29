from django.db import models
from django.contrib.postgres.fields import ArrayField
from authentication.models import User
from django.utils import timezone


class Product(models.Model):
    title = models.CharField(max_length=800, blank=True, default='')
    image_urls = ArrayField(
        models.CharField(max_length=200, blank=True),
    )
    description = models.TextField()
    categories = ArrayField(
        models.CharField(max_length=200, blank=True),
    )
    cost_price = models.FloatField()
    sales_price = models.FloatField(blank=True, null=True)
    discount = models.FloatField()
    color = ArrayField(
        models.CharField(max_length=200, blank=True),
    )
    size = models.CharField(max_length=200, blank=True, null=True)
    dimension = models.CharField(max_length=200, blank=True, null=True)
    weight = models.CharField(max_length=200, blank=True, null=True)
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)
    added_on = models.DateTimeField(default=timezone.now)
    modified_on = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'product'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return self.title
