from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .serializers import RegistrationSerializer, BookmarkCreateSerializer, UserBookmarksSerializer
from backend.restapi.serializers import RecipeListSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from backend.restapi.models import Recipe
from .models import UserBookmarks

from django.shortcuts import get_object_or_404

class RegistrationAPIView(generics.GenericAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

class UserProfileAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        user = get_object_or_404(User, id=user_id)
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
        }
        return Response(user_data)

class UserBookmarksAPIView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserBookmarksSerializer

    def get(self, request):
        user_id = request.user.id
        user = get_object_or_404(User, id=user_id)
        try:
            user_bookmarks = user.userbookmarks
        except:
            return Response("No data", status=status.HTTP_204_NO_CONTENT)
            
        recipe_serializer = RecipeListSerializer(
            user_bookmarks.bookmarks.all(),
            many=True,
            context={'request': request}
        )
        serialized_bookmarks = recipe_serializer.data

        user_bookmarks_data = {
            "bookmarks": serialized_bookmarks,
        }

        return Response(user_bookmarks_data)

class BookmarkCreateAPIView(generics.CreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BookmarkCreateSerializer

    def perform_create(self, serializer):
        recipe_id = serializer.validated_data['recipe_id']
        recipe = get_object_or_404(Recipe, id=recipe_id)
        user = self.request.user
        user_bookmarks, _ = UserBookmarks.objects.get_or_create(user=user)
        user_bookmarks.bookmarks.add(recipe)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        user = self.request.user
        user_bookmarks = get_object_or_404(UserBookmarks, user=user)
        serializer = UserBookmarksSerializer(user_bookmarks)

        #return all recipes after add operation
        user_id = request.user.id
        user = get_object_or_404(User, id=user_id)
        try:
            user_bookmarks = user.userbookmarks
        except:
            return Response("No data", status=status.HTTP_204_NO_CONTENT)
            
        recipe_serializer = RecipeListSerializer(
            user_bookmarks.bookmarks.all(),
            many=True,
            context={'request': request}
        )
        serialized_bookmarks = recipe_serializer.data

        user_bookmarks_data = {
            "bookmarks": serialized_bookmarks,
        }

        return Response(data=user_bookmarks_data, status=status.HTTP_201_CREATED)

class BookmarkDeleteAPIView(generics.DestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BookmarkCreateSerializer

    def perform_destroy(self, instance):
        user = self.request.user
        user_bookmarks = get_object_or_404(UserBookmarks, user=user)
        user_bookmarks.bookmarks.remove(instance)

    def delete(self, request, *args, **kwargs):
        recipe_id = request.data.get('recipe_id')
        user = self.request.user
        user_bookmarks = get_object_or_404(UserBookmarks, user=user)
        recipe = get_object_or_404(user_bookmarks.bookmarks, id=recipe_id)
        self.perform_destroy(recipe)

        #return all recipes after delete operation
        user_id = request.user.id
        user = get_object_or_404(User, id=user_id)
        try:
            user_bookmarks = user.userbookmarks
        except:
            return Response("No data", status=status.HTTP_204_NO_CONTENT)
            
        recipe_serializer = RecipeListSerializer(
            user_bookmarks.bookmarks.all(),
            many=True,
            context={'request': request}
        )
        serialized_bookmarks = recipe_serializer.data

        user_bookmarks_data = {
            "bookmarks": serialized_bookmarks,
        }

        return Response(data=user_bookmarks_data, status=status.HTTP_200_OK)