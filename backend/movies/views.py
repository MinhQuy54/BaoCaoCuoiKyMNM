from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.db.models import Q
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated # <-- Cần xác thực để đăng xuất
from rest_framework_simplejwt.tokens import RefreshToken # <-- Import RefreshToken
# Lấy Model User
User = get_user_model()

from .models import Movie, Review, Category, Comment, Favorite, Report
from .serializers import (
    MovieSerializers, ReviewSerializer, CategorySerializer, 
    CommentSerializer, FavoriteSerializer, ReportSerializer,
    UserRegisterSerializer # Thêm Serializer cho đăng ký
)
from .permission import IsAdminOrReadOnly, IsOwnerOrReadOnly 

# =======================================================
#               PHẦN 1: API PHIM & TƯƠNG TÁC
# =======================================================

# --- API Phim ---
class MovieList(APIView):
    # Cho phép tìm kiếm theo tags, title, director, category
    permission_classes = [AllowAny] # Mọi người đều được xem

    def get(self, request):
        search_query = request.query_params.get('search')
        tag_name = request.query_params.get('tag')
        status_filter = request.query_params.get('status')
        category_name = request.query_params.get('category')

        movies = Movie.objects.all()

        if tag_name:
            movies = movies.filter(tags__contains=[tag_name])
        
        if status_filter:
            movies = movies.filter(status=status_filter.upper())

        if category_name:
            movies = movies.filter(categories__name__icontains=category_name)
            
        if search_query:
            movies = movies.filter(
                Q(title__icontains=search_query) | 
                Q(director__icontains=search_query) |
                Q(tags__contains=[search_query])
            ).distinct()

        serializer = MovieSerializers(movies, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        # Chỉ Admin được tạo phim
        if not request.user.is_staff:
            return Response({"detail": "Bạn không có quyền này."}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = MovieSerializers(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MovieDetail(APIView):
    permission_classes = [IsAdminOrReadOnly] 
    
    def get_object(self, pk):
        try:
            return Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            return None

    def get(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = MovieSerializers(movie, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = MovieSerializers(movie, data=request.data, context={'request': request})
        if serializer.is_valid():
            self.check_object_permissions(request, movie) # Kiểm tra quyền Admin
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request, movie) # Kiểm tra quyền Admin
        movie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# --- API Category ---
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly] 

# --- API Review ---
class ReviewListCreate(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        movie_pk = self.kwargs['movie_pk']
        return Review.objects.filter(movie__pk=movie_pk).select_related('user', 'movie')

    def perform_create(self, serializer):
        movie_pk = self.kwargs['movie_pk']
        try:
            movie = Movie.objects.get(pk=movie_pk)
            if Review.objects.filter(user=self.request.user, movie=movie).exists():
                raise serializers.ValidationError({"error": "Bạn đã đánh giá phim này rồi."})
        except Movie.DoesNotExist:
            raise serializers.ValidationError("Phim không tồn tại.")
        
        serializer.save(user=self.request.user, movie=movie)

class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsOwnerOrReadOnly] 

# --- API Comment ---
class CommentListCreate(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        movie_pk = self.kwargs['movie_pk']
        return Comment.objects.filter(
            movie__pk=movie_pk,
            parent__isnull=True
        ).prefetch_related('replies')

    def perform_create(self, serializer):
        movie_pk = self.kwargs['movie_pk']
        try:
            movie = Movie.objects.get(pk=movie_pk)
        except Movie.DoesNotExist:
            raise serializers.ValidationError("Phim không tồn tại.")

        parent_id = self.request.data.get('parent')
        parent_comment = None

        if parent_id:
            parent_comment = Comment.objects.filter(pk=parent_id, movie=movie).first()
            if not parent_comment:
                raise serializers.ValidationError({"parent": "Bình luận cha không tồn tại."})

        serializer.save(
            user=self.request.user,
            movie=movie,
            parent=parent_comment
        )

class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerOrReadOnly] 

# --- API Favorite ---
class FavoriteListCreate(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('movie')

    def perform_create(self, serializer):
        movie_id = self.request.data.get('movie_id')
        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            raise serializers.ValidationError({"movie_id": "Phim không tồn tại."})
        
        if Favorite.objects.filter(user=self.request.user, movie=movie).exists():
            raise serializers.ValidationError({"error": "Phim đã có trong danh sách yêu thích."})
            
        serializer.save(user=self.request.user, movie=movie)

class FavoriteDestroy(generics.DestroyAPIView):
    queryset = Favorite.objects.all()
    permission_classes = [IsOwnerOrReadOnly]

# --- API Report (Admin và User tạo báo cáo) ---
class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.filter(is_resolved=False).select_related('reporter', 'reported_comment')
    serializer_class = ReportSerializer
    # Cần chỉnh lại quyền: User được POST (tạo báo cáo), Admin được GET/PUT/DELETE
    
    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = [IsAuthenticated]
        else: # list, retrieve, update, destroy
            self.permission_classes = [IsAdminUser]
        return super(ReportViewSet, self).get_permissions()

    def create(self, request, *args, **kwargs):
        reported_comment_id = request.data.get('reported_comment_id')
        try:
            comment = Comment.objects.get(pk=reported_comment_id)
        except Comment.DoesNotExist:
            return Response({"reported_comment_id": "Bình luận không tồn tại."}, status=status.HTTP_400_BAD_REQUEST)

        if comment.user == request.user:
             return Response({"error": "Bạn không thể báo cáo bình luận của chính mình."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(reporter=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# =======================================================
#               PHẦN 2: API AUTHENTICATION
# =======================================================

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save() 
            return Response({"message": "Đăng ký thành công"}, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Sai tài khoản hoặc mật khẩu"}, status=status.HTTP_400_BAD_REQUEST)

        # Tạo JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user_id": user.id,
            "username": user.username
        })

class LogoutView(APIView):
    # Người dùng phải đăng nhập (có access token hợp lệ) để gọi API này
    permission_classes = (IsAuthenticated,) 

    def post(self, request):
        try:
            # 1. Lấy Refresh Token từ body request
            # Frontend phải gửi Refresh Token lên
            refresh_token = request.data["refresh_token"]
            
            # 2. Tạo đối tượng RefreshToken và cho vào Blacklist
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Đăng xuất thành công, Refresh Token đã bị vô hiệu hóa."}, status=status.HTTP_205_RESET_CONTENT)
        
        except KeyError:
             # Xảy ra nếu frontend không gửi refresh_token
             return Response({"error": "Thiếu Refresh Token trong yêu cầu."}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            # Xảy ra nếu token không hợp lệ (ví dụ: đã hết hạn)
            print(e)
            return Response({"error": "Refresh Token không hợp lệ hoặc đã bị vô hiệu hóa trước đó."}, status=status.HTTP_400_BAD_REQUEST)
        

