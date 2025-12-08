from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Movie
from .serializers import MovieSerializers

class MovieList(APIView):
    def get(self, request):
        tag_name = request.query_params.get('tag')
        if tag_name:
            movies = Movie.objects.filter(tags__icontains=[tag_name])
        else:
            movies = Movie.objects.all()

        serializer = MovieSerializers(movies, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
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
