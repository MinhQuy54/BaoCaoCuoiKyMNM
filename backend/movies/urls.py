from django.urls import path, include
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.routers import DefaultRouter
from .views import (
    # Auth
    # Movies & Interactions
    MovieList, MovieDetail, 
    RegisterView, LoginView, LogoutView
)
User = get_user_model()
urlpatterns = [
        # --- API AUTHENTICATION ---
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'), 
       # --- API PHIM ---
    path('movies/', MovieList.as_view(), name='movie-list'),
    path('movies/<int:pk>/', MovieDetail.as_view(), name='movie-detail'),
]
