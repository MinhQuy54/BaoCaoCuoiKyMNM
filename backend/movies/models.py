from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth import get_user_model
from django.db.models import Avg

# Lấy Model User mặc định của Django
User = get_user_model()

# --- Model Category ---
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

# --- Model Movie ---
class Movie(models.Model):
    title = models.CharField(max_length=200)
    year = models.CharField(max_length=10)
    episodes = models.CharField(max_length=20)
    age = models.CharField(max_length=16)
    desc = models.TextField()
    bg = models.ImageField(upload_to='bg/')
    thumb = models.ImageField(upload_to='thumb/')
    tags = ArrayField(models.CharField(max_length=100), blank=True, default=list) 
    video_url = models.URLField(max_length=500, blank=True, null=True, 
                                verbose_name="Video URL (Stream/Embed)")
    director = models.CharField(max_length=200, blank=True, null=True)
    release_country = models.CharField(max_length=100, default='Unknown')
    trailer_url = models.URLField(max_length=500, blank=True, null=True)

    STATUS_CHOICES = (
        ('NOW', 'Đang Chiếu'),
        ('UPCOMING', 'Sắp Chiếu'),
        ('FEATURED', 'Nổi Bật'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='NOW')
    
    categories = models.ManyToManyField(Category, related_name='movies', blank=True)

    def __str__(self):
        return self.title
    
    def get_average_rating(self):
        result = self.reviews.aggregate(Avg('rating'))
        return result['rating__avg']

# --- Model Review (Đánh giá & Xếp hạng) ---
class Review(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)]) 
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('movie', 'user') 
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.movie.title} - {self.user.username} ({self.rating} sao)'

# --- Model Comment (Bình luận) ---
class Comment(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='replies'
    ) 

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'Comment by {self.user.username} on {self.movie.title}'

# --- Model Favorite (Danh sách yêu thích) ---
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie') 

    def __str__(self):
        return f'{self.user.username} favorites {self.movie.title}'

# --- Model Report (Báo cáo bình luận tiêu cực) ---
class Report(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_reports')
    reported_comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='reports')
    reason = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Report on Comment {self.reported_comment.id} by {self.reporter.username}'
