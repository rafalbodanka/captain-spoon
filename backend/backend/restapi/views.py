from django.shortcuts import render, get_object_or_404
from django.http import Http404, JsonResponse
from django.db.models import Q

from rest_framework.response import Response

from rest_framework import generics, status
from .models import Recipe
from .serializers import RecipeSerializer, RecipeListSerializer, RecipeAddSerializer

from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.contrib.auth.models import User


class RecipeListAPIView(generics.ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = RecipeListSerializer

    def get_queryset(self):
        queryset = Recipe.objects.all()
        search_query = self.request.query_params.get('searchQuery', None)
        print(search_query)

        if search_query:
            # Perform case-insensitive search on relevant fields
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(publisher__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(tags__name__icontains=search_query) |
                Q(ingredients__name__icontains=search_query) |
                Q(creator__username__icontains=search_query)
            ).distinct()

        return queryset.order_by('id')


class RecipeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk, format=None):
        obj = get_object_or_404(self.queryset, pk=pk)
        serializer = RecipeSerializer(obj, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        recipe = self.get_object()
        serializer = RecipeSerializer(recipe, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        recipe = self.get_object()
        recipe.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RecipeAddView(generics.CreateAPIView):
    serializer_class = RecipeAddSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        console.log(request)


class UserRecipeView(generics.ListAPIView):
    serializer_class = RecipeListSerializer

    def get_queryset(self):
        username = self.request.query_params.get('username')
        user = User.objects.get(username=username)
        return Recipe.objects.filter(creator=user).order_by('id')
