from django.urls import path, include
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.routers import DefaultRouter
from .views import (
    # Auth
    # Movies & Interactions
    MovieList, MovieDetail, 
    RegisterView
)
User = get_user_model()
urlpatterns = [
        # --- API AUTHENTICATION ---
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
       # --- API PHIM ---
    path('movies/', MovieList.as_view(), name='movie-list'),
    path('movies/<int:pk>/', MovieDetail.as_view(), name='movie-detail'),
]
