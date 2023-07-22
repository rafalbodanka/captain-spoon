from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegistrationAPIView, UserProfileAPIView, UserBookmarksAPIView, BookmarkCreateAPIView, BookmarkDeleteAPIView

urlpatterns = [
    path('register/', RegistrationAPIView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh-token/', TokenRefreshView.as_view(), name='refresh-token'),
    path('user/', UserProfileAPIView.as_view(), name='user'),
    path('bookmarks/', UserBookmarksAPIView.as_view(), name='bookmarks'),
    path('bookmarks/add/', BookmarkCreateAPIView.as_view(), name='bookmark-add'),
    path('bookmarks/delete/', BookmarkDeleteAPIView.as_view(), name='bookmark-delete'),
]
