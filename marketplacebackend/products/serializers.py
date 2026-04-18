from rest_framework import serializers
from.models import Category, Product



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields= ['id', 'name', 'slug']
class ProductSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(source='category.name', read_only=True)
    in_stock = serializers.BooleanField(read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    review_count = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'price_old', 'image',
                  'stock', 'in_stock', 'is_featured', 'badge', 'category', 
                  'category_name', 'avg_rating', 'review_count','created_at']
        
    def get_review_count(self, obj):
        return obj.reviews.count()