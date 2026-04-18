from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='vendor_profile')
    shop_name= models.CharField(max_length=255)
    handle = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    logo = models.URLField(blank=True)
    location = models.CharField(max_length=255, blank =True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.shop_name
    


class VendorStats(models.Model):
    vendor = models.OneToOneField(Vendor, on_delete=models.CASCADE, related_name='stats')
    total_sales = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    avg_rating = models.FloatField(default=0.0)
    total_reviews = models.IntegerField(default=0)

    def __str__(self):
        return f"Stats for { self.vendor.shop_name}" 