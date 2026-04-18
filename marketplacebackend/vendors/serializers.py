from rest_framework import serializers
from .models import Vendor, VendorStats

class VendorStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorStats
        fields= '__all__'


class VendorSerializer(serializers.ModelSerializer):
    stats= VendorStatsSerializer(read_only=True)

    class Meta:
        model = Vendor
        fields = ['id', 'shop_name', 'handle', 'description', 'logo', 'location', 'is_verified', 'created_at', 'stats']
