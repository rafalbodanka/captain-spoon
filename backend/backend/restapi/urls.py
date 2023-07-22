from django.urls import path
from .views import RecipeListAPIView, RecipeDetail, RecipeAddView, UserRecipeView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('recipes/', RecipeListAPIView.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', RecipeDetail.as_view(), name='recipe-detail'),
    path('recipes/add/', RecipeAddView.as_view(), name='recipe-add'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('recipes/user', UserRecipeView.as_view(), name='recipe-user'),
]
