from django.db import models

# Create your models here.
class Item(models.Model):
    name = models.CharField(max_length=250, null=False)
    price = models.CharField(max_length=50, null=False)
    rating = models.CharField(max_length=50, null=False)
    link = models.CharField(max_length=250, null=False)
    free_delivery = models.BooleanField(default=False)
    top_quality_vendor = models.BooleanField(default=False)