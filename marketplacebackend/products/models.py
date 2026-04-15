from django.db import models
from django.conf import settings

User= settings.AUTH_USER_MODEL

class Product(models.Model):
    seller = models.ForeignKey(
        User, on_delete=models.CASCADE)
    name= models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10,decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name