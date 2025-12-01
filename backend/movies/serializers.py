from rest_framework import serializers
from .models import Movie

class MovieSerializers(serializers.ModelSerializer):
    bg = serializers.SerializerMethodField()
    thumb = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = '__all__'

    def get_bg(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.bg.url) if obj.bg else None

    def get_thumb(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.thumb.url) if obj.thumb else None


