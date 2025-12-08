from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import MovieList,MovieDetail
urlpatterns = [
    path('movies/', MovieList.as_view(), name='movie-list'),
    path('movies/<int:pk>/', MovieDetail.as_view(), name='movie-detail')
]
