from django.db import models
from authentication.models import User


class Company(models.Model):
    name = models.CharField(max_length=400, blank=True, default='')

    class Meta:
        db_table = 'company'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return self.name


class CompanyStuff(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    stuff = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.IntegerField(default=0)

    class Meta:
        db_table = 'company_stuff'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return self.company.name
