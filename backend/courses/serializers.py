from rest_framework import serializers
from .models import Course, Chapter, Lesson, LessonBlock
from rest_framework import serializers


class LessonBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonBlock
        fields = [
            "id",
            "block_type",
            "order_index",
            "text_markdown",
            "image_urls",
            "video_url",
            "links",
        ]


class LessonSerializer(serializers.ModelSerializer):
    blocks = LessonBlockSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "slug",
            "number",
            "order_index",
            "is_free_preview",
            "blocks",
        ]


class ChapterSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Chapter
        fields = [
            "id",
            "title",
            "slug",
            "order_index",
            "lessons",
        ]


class CourseSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "description_markdown",
            "image_url",
            "chapters",
        ]

    def get_image_url(self, obj: Course):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return ""


