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
from .permission import IsAdminOrReadOnly, IsOwnerOrReadOnly 
# Lấy Model User
User = get_user_model()
from .models import Movie, Review, Category, Comment, Favorite, Report
from .serializers import (
    MovieSerializers, ReviewSerializer, CategorySerializer, 
    CommentSerializer, FavoriteSerializer, ReportSerializer,
    UserRegisterSerializer
)

# --- API Phim ---
class MovieList(APIView):

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

        serializer = MovieSerializers(movies, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):

        if not request.user.is_staff:
            return Response({"detail": "Bạn không có quyền này."}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = MovieSerializers(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MovieDetail(APIView):
    
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
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
        movie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
        

