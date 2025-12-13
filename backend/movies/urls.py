from django.urls import path, include
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.routers import DefaultRouter
from .views import (
    # Auth
    RegisterView, LoginView, LogoutView,
    # Movies & Interactions
    MovieList, MovieDetail, 
    ReviewListCreate, ReviewDetail,
    CategoryViewSet,
    CommentListCreate, CommentDetail,
    FavoriteListCreate, FavoriteDestroy,
    ReportViewSet,
)
User = get_user_model()

# Sử dụng DefaultRouter cho các ViewSet (Category, Report)
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
# ReportViewSet sẽ xử lý cả việc tạo báo cáo (user) và quản lý (admin)
router.register(r'reports', ReportViewSet, basename='report') 

urlpatterns = [
    # --- API AUTHENTICATION ---
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'), 

    # --- API PHIM ---
    path('movies/', MovieList.as_view(), name='movie-list'),
    path('movies/<int:pk>/', MovieDetail.as_view(), name='movie-detail'),

    # --- API TƯƠNG TÁC PHIM (LỒNG) ---
    # /api/movies/1/reviews/
    path('movies/<int:movie_pk>/reviews/', ReviewListCreate.as_view(), name='review-list-create'),
    # /api/movies/1/comments/ (Lấy bình luận gốc)
    path('movies/<int:movie_pk>/comments/', CommentListCreate.as_view(), name='comment-list-create'),

    # --- API TƯƠNG TÁC CÁ NHÂN ---
    # /api/reviews/1/
    path('reviews/<int:pk>/', ReviewDetail.as_view(), name='review-detail'),
    # /api/comments/1/
    path('comments/<int:pk>/', CommentDetail.as_view(), name='comment-detail'),
    
    # --- API DANH SÁCH YÊU THÍCH ---
    # /api/favorites/ (POST tạo, GET list của user)
    path('favorites/', FavoriteListCreate.as_view(), name='favorite-list-create'),
    # /api/favorites/1/ (DELETE để xóa khỏi yêu thích)
    path('favorites/<int:pk>/', FavoriteDestroy.as_view(), name='favorite-destroy'),
    # --- API QUẢN LÝ (Admin) & BÁO CÁO (User POST) ---
    path('', include(router.urls)), 
]
