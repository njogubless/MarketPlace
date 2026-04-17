
from rest_framework import viewsets,permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('Category')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured', 'seller']
    search_fields = ['name', 'descritption']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        in_stock = self.request.query_params.get('in_Stock')
        if in_stock == 'true':
            qs = qs.filter(Stock__gt=0)
        return qs

class CategoryViewSet(viewsets.ReadOnlyModeViewSet):
    querryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [ permissions.AllowAny]