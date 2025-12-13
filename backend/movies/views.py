from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Movie, Review, Category, Comment, Favorite, Report
from .serializers import (
    MovieSerializers, ReviewSerializer, CategorySerializer, 
    CommentSerializer, FavoriteSerializer, ReportSerializer,
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

