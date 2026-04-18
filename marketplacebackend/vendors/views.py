from rest_framework import viewsets, permissions
from .models import Vendor
from .serializers import VendorSerializer

class VendorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Vendor.objects.all().select_related('stats')
    serializer_class = VendorSerializer
    permission_classes = [permission.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(shop_name__icontains=search)
        return qs