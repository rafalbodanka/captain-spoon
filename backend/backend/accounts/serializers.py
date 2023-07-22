from rest_framework import serializers
from django.contrib.auth.models import User

from .models import UserBookmarks
from backend.restapi.models import Recipe
from backend.restapi.serializers import RecipeListSerializer

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(max_length=50, min_length=6)
    username = serializers.CharField(max_length=50, min_length=5)

    class Meta:
        model = User
        fields = ('first_name', 'email', 'username', 'password')

    def validate(self, args):
        email = args.get('email', None)
        username = args.get('username', None)
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {'email': ('email already exists')})
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError(
                {'username': ('username already exists')})

        return super().validate(args)

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username')


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = (
            'id',
            'detail_url',
            'title',
            'publisher',
            'image_url',
        )

class UserBookmarksSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    bookmarks = RecipeListSerializer()

    class Meta:
        model = UserBookmarks
        fields = ['user', 'bookmarks']

class BookmarkCreateSerializer(serializers.Serializer):
    recipe_id = serializers.IntegerField()

    def validate_recipe_id(self, value):
        return value