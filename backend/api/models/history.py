from django.db import models
from authentication.models import User


class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ip_address = models.CharField(max_length=400, blank=True, default='')
    browser_info = models.CharField(max_length=400, blank=True, default='')
    location = models.CharField(max_length=400, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'history'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return self.ip_address

