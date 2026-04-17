from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]


    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)
    

    def post(self, request):
        """ Add Item to Cart"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product')
        quantity = int(request.data.get('quantity', 1))
        item, created = CartItem.objects.get_or_create(cart=cart , product_id=product_id)
        if not created:
            item.quantity += quantity
        else: 
            item.quantity = quantity
        item.save()
        return Response(CartSerializer(Cart).data, status=status.HTTP_200_OK)
    

    def delete(self, request):
        """ REMOVE FROM CART"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product')
        CartItem.objects.filter(cart=cart, product_id=product_id). delete()

        return Response(CartSerializer(Cart).data)
    

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(buyer=request.user).prefetch_related('items')
    
    def create(self, request):
        """ Checkout: Convert Cart to Order"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({'error': 'Cart is Empty'}, status=400)
        
        order = Order.objects.create(buyer=request.user, total_price=cart.total)
        for item in cart.items.all():
            OrderItem.objects.create(
                order = order,
                product=item.product,
                quantity=item.quantity,
                price_at_purchase=item.product.price,
            )
            cart.items.all().delete()
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)