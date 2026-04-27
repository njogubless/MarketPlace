

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Cart, CartItem, Order, OrderItem
from .serializers import (
    CartSerializer,
    CartItemSerializer,
    CartItemWriteSerializer,
    OrderSerializer,
    OrderCreateSerializer,
)
from products.models import Product



class CartView(APIView):
  
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # get_or_create: returns existing cart OR creates a new empty one
        Cart.objects.get_or_create(user=request.user)

        
        cart = (
            Cart.objects
            .prefetch_related('items__product__vendor')
            .get(user=request.user)
        )
        return Response(CartSerializer(cart).data)


class CartItemView(APIView):
   
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CartItemWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        product_id = serializer.validated_data['product_id']
        quantity   = serializer.validated_data['quantity']
        product    = get_object_or_404(Product, id=product_id, status='active')

        
        if quantity > product.stock:
            return Response(
                {'error': f'Only {product.stock} units available.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart, _ = Cart.objects.get_or_create(user=request.user)

        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
           
            new_qty = cart_item.quantity + quantity
            if new_qty > product.stock:
                return Response(
                    {
                        'error': f'Only {product.stock} units available. '
                                 f'You already have {cart_item.quantity} in your cart.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = new_qty
            cart_item.save()

        return Response(
            CartItemSerializer(cart_item).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


class CartItemDetailView(APIView):
    
    permission_classes = [IsAuthenticated]

    def _get_item(self, request, item_id):
        """Get item — ensures it belongs to the requesting user's cart."""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return get_object_or_404(CartItem, id=item_id, cart=cart)

    def patch(self, request, item_id):
        item     = self._get_item(request, item_id)
        quantity = request.data.get('quantity')

        if quantity is None:
            return Response(
                {'error': 'quantity is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            return Response(
                {'error': 'quantity must be a number.'},
                status=status.HTTP_400_BAD_REQUEST
            )

       
        if quantity < 1:
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        if quantity > item.product.stock:
            return Response(
                {'error': f'Only {item.product.stock} units available.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        item.quantity = quantity
        item.save()
        return Response(CartItemSerializer(item).data)

    def delete(self, request, item_id):
        item = self._get_item(request, item_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartClearView(APIView):
   
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response({'message': 'Cart cleared.'})




class CheckoutView(APIView):
 
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_items = cart.items.select_related('product__vendor').all()

        if not cart_items.exists():
            return Response(
                {'error': 'Your cart is empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )

       
        for item in cart_items:
            if item.quantity > item.product.stock:
                return Response(
                    {
                        'error': f'"{item.product.name}" only has '
                                 f'{item.product.stock} units left but you have '
                                 f'{item.quantity} in your cart.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        
        with transaction.atomic():
            # Calculate total
            total = sum(item.subtotal for item in cart_items)

           
            order = Order.objects.create(
                buyer=request.user,
                total_price=total,
                address=serializer.validated_data.get('address', ''),
                notes=serializer.validated_data.get('notes', ''),
            )

           
            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    product_name=item.product.name,
                    vendor_name=item.product.vendor.shop_name,
                    quantity=item.quantity,
                    price_at_purchase=item.product.price,
                )

               
                item.product.stock -= item.quantity
                item.product.save()

            
            cart.items.all().delete()

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class OrderListView(APIView):
   
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = (
            Order.objects
            .filter(buyer=request.user)
            .prefetch_related('items__product')
            .order_by('-created_at')
        )
        return Response(OrderSerializer(orders, many=True).data)


class OrderDetailView(APIView):
   
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(
            Order.objects.prefetch_related('items__product'),
            id=order_id,
            buyer=request.user   # users can only see their own orders
        )
        return Response(OrderSerializer(order).data)