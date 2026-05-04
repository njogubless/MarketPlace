from rest_framework import serializers
from .models import User

#User = get_user_model()
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    full_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id','full_name', 'email', 'password', 'is_vendor']

    def create(self, validated_data):
        full_name = validated_data.pop('full_name', '')
        parts = full_name.strip().split(' ',1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ''

        base_username = validated_data['email'].split('@')[0]
        username =base_username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        return User.objects.create_user(
            username = username,
            email = validated_data['email'],
            password = validated_data['password'],
            first_name = first_name,
            last_name = last_name,
            is_vendor = validated_data.get('is_vendor', False),        
        )

       


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields =['id','username', 'email', 'is_vendor', 'bio', 'avatar']