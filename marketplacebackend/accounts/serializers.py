from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'is_vendor']

    def create(self, validated_data):
        user=user.objects.create_user(
         username=validated_data['username'],
         email=validated_data.get('email', ''),
         password= validated_data['password'],
         is_vendor=validated_data.get('is_vendor', False),
      )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields =['id','username', 'email', 'is_vendor', 'bio', 'avatar']