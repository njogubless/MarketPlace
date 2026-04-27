

from django.db import models
from django.conf import settings
from products.models import Product

User = settings.AUTH_USER_MODEL


# ── Cart ──────────────────────────────────────────────────────────────────────

class Cart(models.Model):
 
    user       = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='cart'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'carts'

    def __str__(self):
        return f"Cart of {self.user.email}"

    @property
    def total(self):
    
        return sum(item.subtotal for item in self.items.all())

    @property
    def total_items(self):
       
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
 
    cart     = models.ForeignKey(Cart,    on_delete=models.CASCADE, related_name='items')
    product  = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table        = 'cart_items'
        unique_together = [['cart', 'product']]
        ordering        = ['-added_at']

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"

    @property
    def subtotal(self):
        return self.product.price * self.quantity




class Order(models.Model):

    class Status(models.TextChoices):
        PENDING   = 'pending',   'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        SHIPPED   = 'shipped',   'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'

    buyer       = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    status      = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    address     = models.TextField(blank=True)
    notes       = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} — {self.buyer.email} ({self.status})"

    @property
    def item_count(self):
        return sum(item.quantity for item in self.items.all())


class OrderItem(models.Model):

    order             = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product           = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    product_name      = models.CharField(max_length=255)
    vendor_name       = models.CharField(max_length=255, blank=True)
    quantity          = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'order_items'

    def __str__(self):
        return f"{self.quantity}x {self.product_name} @ ${self.price_at_purchase}"

    @property
    def subtotal(self):
        return self.price_at_purchase * self.quantity