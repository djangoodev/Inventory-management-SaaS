from django.db import models
from authentication.models import User


class Customer(models.Model):

    first_name = models.CharField(max_length=400, blank=True, default='')
    last_name = models.CharField(max_length=400, blank=True, default='')
    email = models.EmailField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    company = models.CharField(max_length=400, blank=True, default='')
    phone = models.CharField(max_length=400, blank=True, default='')
    apartment = models.CharField(max_length=400, blank=True, default='')
    address = models.CharField(max_length=400, blank=True, default='')
    city = models.CharField(max_length=400, blank=True, default='')
    country = models.CharField(max_length=400, blank=True, default='')
    region = models.CharField(max_length=400, blank=True, default='')
    postal_code = models.CharField(max_length=400, blank=True, default='')
    image = models.CharField(max_length=400, blank=True, default='')

    class Meta:
        db_table = 'customer'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return self.first_name

