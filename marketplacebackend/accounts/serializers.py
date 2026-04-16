from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'is_vendor']

        def create(self, validated_data):
            user=user.objects.create_user(
                **validated_data
            )
            return user