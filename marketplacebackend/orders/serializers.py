from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
      model = CartItem
      fields = ['id','product', 'product_name', 'product_price', 'quantity', 'subtotal']
    

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
       model = Cart
       fields =['id', 'items', 'total']

class OrderItemSerializer(serializers.ModelSerializer):
   product_name = serializers.CharField(source='product.name', read_only=True)
   subtotal = serializers.DecimalField(max_digits=0,decimal_places=2, read_only=True)

   class Meta:
     model = OrderItem
     field =['id', 'product', 'product_name', 'quantity', ' price_at_purchase', 'subtotal']



class OrderSerializer(serializers.ModelSerializer):
   items =OrderItemSerializer(many=True, read_only=True)

   class Meta:
      model = Order
      fields =['id', 'status', 'total_price', 'created_at', 'items']