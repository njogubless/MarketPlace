

from django.urls import path
from .views import (
    CartView,
    CartItemView,
    CartItemDetailView,
    CartClearView,
    CheckoutView,
    OrderListView,
    OrderDetailView,
)

urlpatterns = [
  
    path('cart/',                    CartView.as_view(),           name='cart'),
    path('cart/items/',              CartItemView.as_view(),        name='cart-items'),
    path('cart/items/<int:item_id>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('cart/clear/',              CartClearView.as_view(),       name='cart-clear'),


    path('checkout/',                CheckoutView.as_view(),        name='checkout'),
    path('',                         OrderListView.as_view(),       name='order-list'),
    path('<int:order_id>/',          OrderDetailView.as_view(),     name='order-detail'),
]