from django.db import models
from django.conf import settings

User= settings.AUTH_USER_MODEL


class Category(models.Model):
    name=models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    def __Str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = ' Categories'

class Product(models.Model):
    seller = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='products')
    name= models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10,decimal_places=2)
    price_old = models.DecimalField(max_digits=10,decimal_places=2, null=True, blank=True)
    image = models.URLField(blank=True)
    stock = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    badge = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')


    def __str__(self):
        return self.name
    
    @property
    def in_stock(self):
        return self.stock > 0
    
    @property
    def avg_rating(Self):
        reviews = self.reviews.all()
        if not reviews:
            return 0
        return round(sum(r.rating for r in reviews) / len(reviews), 2)