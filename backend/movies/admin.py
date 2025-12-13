from django.contrib import admin
from .models import (
    Movie, Category, Review, Comment, Favorite, Report
)

# ========== CATEGORY ==========
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'slug']
    search_fields = ['name']


# ========== MOVIE ==========
@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'year', 'status']
    list_filter = ['year', 'status', 'categories']
    search_fields = ['title']
    filter_horizontal = ['categories']


# ========== REVIEW ==========
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'movie', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['movie__title', 'user__username']


# ========== COMMENT ==========
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'movie', 'user', 'parent', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'user__username', 'movie__title']


# ========== FAVORITE ==========
@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'movie', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'movie__title']


# ========== REPORT ==========
@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['id', 'reporter', 'reported_comment', 'is_resolved', 'created_at']
    list_filter = ['is_resolved', 'created_at']
    search_fields = ['reason', 'reporter__username']
    list_editable = ['is_resolved']
