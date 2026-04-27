from django.contrib import admin




from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem



class CartItemInline(admin.TabularInline):
    model           = CartItem
    extra           = 0
    fields          = ['product', 'quantity', 'subtotal', 'added_at']
    readonly_fields = ['subtotal', 'added_at']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display    = ['user', 'total_items', 'total', 'created_at', 'updated_at']
    search_fields   = ['user__email']
    readonly_fields = ['total', 'total_items', 'created_at', 'updated_at']
    inlines         = [CartItemInline]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display    = ['cart', 'product', 'quantity', 'subtotal', 'added_at']
    search_fields   = ['cart__user__email', 'product__name']
    readonly_fields = ['subtotal', 'added_at']




class OrderItemInline(admin.TabularInline):
    model           = OrderItem
    extra           = 0
    fields          = ['product', 'product_name', 'vendor_name', 'quantity', 'price_at_purchase', 'subtotal']
    readonly_fields = ['subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display    = ['id', 'buyer', 'status', 'total_price', 'item_count', 'created_at']
    list_filter     = ['status']
    search_fields   = ['buyer__email', 'id']
    readonly_fields = ['item_count', 'created_at', 'updated_at']
    inlines         = [OrderItemInline]

    # Allow changing status directly from the list view
    list_editable   = ['status']


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display    = ['order', 'product_name', 'vendor_name', 'quantity', 'price_at_purchase', 'subtotal']
    search_fields   = ['order__id', 'product_name', 'vendor_name']
    readonly_fields = ['subtotal']