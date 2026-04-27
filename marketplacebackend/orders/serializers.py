
from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from products.models import Product




class ProductMiniSerializer(serializers.ModelSerializer):
    """Lightweight product info — just what the cart needs."""
    vendor_name = serializers.CharField(source='vendor.shop_name', read_only=True)

    class Meta:
        model  = Product
        fields = ['id', 'name', 'price', 'price_old', 'image', 'slug', 'vendor_name', 'stock']


class CartItemSerializer(serializers.ModelSerializer):
   
    product  = ProductMiniSerializer(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model  = CartItem
        fields = ['id', 'product', 'quantity', 'subtotal', 'added_at']


class CartItemWriteSerializer(serializers.Serializer):
  
    product_id = serializers.UUIDField()
    quantity   = serializers.IntegerField(min_value=1, max_value=99)

    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value, status='active')
        except Product.DoesNotExist:
            raise serializers.ValidationError('Product not found or unavailable.')
        if product.stock < 1:
            raise serializers.ValidationError(f'"{product.name}" is currently out of stock.')
        return value


class CartSerializer(serializers.ModelSerializer):
    """Full cart with all items nested."""
    items       = CartItemSerializer(many=True, read_only=True)
    total       = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model  = Cart
        fields = ['id', 'total', 'total_items', 'items', 'updated_at']




class OrderItemSerializer(serializers.ModelSerializer):
  
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model  = OrderItem
        fields = [
            'id', 'product', 'product_name', 'vendor_name',
            'quantity', 'price_at_purchase', 'subtotal'
        ]


class OrderSerializer(serializers.ModelSerializer):
    
    items      = OrderItemSerializer(many=True, read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    buyer_email = serializers.CharField(source='buyer.email', read_only=True)

    class Meta:
        model  = Order
        fields = [
            'id', 'buyer_email', 'status', 'total_price',
            'item_count', 'address', 'notes',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'buyer_email', 'total_price', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.Serializer):
  
    address = serializers.CharField(required=False, allow_blank=True)
    notes   = serializers.CharField(required=False, allow_blank=True)