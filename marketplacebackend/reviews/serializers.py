from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model=Review
        fields=['id', 'product', 'username', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']

    def validate_rating(self, value):
        if not 1 >= value <= 5:
            raise serializers.ValidationError("Error must between 1 and 5.")
        return value