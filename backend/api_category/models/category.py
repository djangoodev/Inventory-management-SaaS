from django.db import models


class Category(models.Model):
    parent = models.IntegerField(default=0)
    title = models.CharField(max_length=800, blank=True, default='')

    class Meta:
        db_table = 'category'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return self.title
