from rest_framework import serializers
from .models import Movie, Review, Category, Comment, Favorite, Report
from django.contrib.auth import get_user_model

User = get_user_model()

# Serializer cơ bản cho User (để hiển thị trong Review/Comment)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

# --- Phim ---
class MovieSerializers(serializers.ModelSerializer):
    bg = serializers.SerializerMethodField()
    thumb = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField() 
    categories = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = '__all__'

    def get_bg(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.bg.url) if obj.bg else None

    def get_thumb(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.thumb.url) if obj.thumb else None

    def get_average_rating(self, obj):
        rating = obj.get_average_rating()
        return round(rating, 2) if rating is not None else None

# --- Thể loại ---
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

# --- Đánh giá (Review) ---
class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ('id', 'movie', 'user', 'rating', 'comment', 'created_at')
        read_only_fields = ('user',)
        # movie chỉ dùng để xác định trong URL, không cần hiển thị hoặc nhập lại
        extra_kwargs = {'movie': {'write_only': True, 'required': False}} 

# --- Bình luận (Comment) ---
class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at', 'parent', 'replies']

    def get_replies(self, obj):
        return CommentSerializer(obj.replies.all(), many=True).data

# --- Yêu thích (Favorite) ---
class FavoriteSerializer(serializers.ModelSerializer):
    movie = MovieSerializers(read_only=True) # Hiển thị chi tiết phim
    movie_id = serializers.PrimaryKeyRelatedField(
        queryset=Movie.objects.all(), 
        source='movie', 
        write_only=True
    )

    class Meta:
        model = Favorite
        fields = ('id', 'user', 'movie', 'movie_id', 'created_at')
        read_only_fields = ('user',)

# --- Báo cáo (Report) ---
class ReportSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)
    reported_comment = CommentSerializer(read_only=True)
    reported_comment_id = serializers.PrimaryKeyRelatedField(
        queryset=Comment.objects.all(), 
        source='reported_comment', 
        write_only=True
    )

    class Meta:
        model = Report
        fields = ('id', 'reporter', 'reported_comment', 'reported_comment_id', 'reason', 'is_resolved', 'created_at')
        read_only_fields = ('reporter',)

# --- Đăng ký/Đăng nhập (Auth) ---
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password')

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # Thêm email nếu bạn muốn hỗ trợ đăng ký qua email (như trong Frontend bạn đã gửi)
    email = serializers.EmailField(required=False)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')
    
    # GHI ĐÈ PHƯƠNG THỨC CREATE ĐỂ HASH MẬT KHẨU
    def create(self, validated_data):
        # 1. Lấy mật khẩu và xóa nó khỏi validated_data
        password = validated_data.pop('password', None)
        
        # 2. Tạo đối tượng người dùng BẰNG create_user()
        # Hàm này của Django sẽ tự động mã hóa (hash) mật khẩu.
        user = User.objects.create_user(
            username=validated_data['username'],
            password=password, # Truyền mật khẩu thô vào đây
            email=validated_data.get('email', '') 
        )
        return user
