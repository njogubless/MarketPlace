from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer

class ReviewListCreateiew(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [ permissions.IsAuthenticated()]
        return [ permissions.AllowAny]
    
    def get_queryset(self):
        product_id = self.request.query_params.get('product')
        if product_id:
            return Review.objects.filter(product_id=product_id).select_related('user')
        return Review.objects.all().select_related('user')
    
    def perfom_create(self, serializer):
        serializer.save(user=self.request.user)