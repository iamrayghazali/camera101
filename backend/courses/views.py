from rest_framework import generics, permissions
from .models import Course, Chapter, Lesson
from .serializers import CourseSerializer, ChapterSerializer, LessonSerializer


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all().prefetch_related("chapters__lessons__blocks")
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all().prefetch_related("chapters__lessons__blocks")
    serializer_class = CourseSerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]


class ChapterDetailView(generics.RetrieveAPIView):
    queryset = Chapter.objects.all().prefetch_related("lessons__blocks")
    serializer_class = ChapterSerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]


class LessonByNumberView(generics.RetrieveAPIView):
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Lesson.objects.select_related("chapter__course").prefetch_related("blocks")

    def get_object(self):
        course_slug = self.kwargs["course_slug"]
        chapter_slug = self.kwargs["chapter_slug"]
        number = int(self.kwargs["number"])
        return (
            self.get_queryset()
            .filter(
                chapter__course__slug=course_slug,
                chapter__slug=chapter_slug,
                number=number,
            )
            .get()
        )


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import LessonProgress, Course


class LessonStartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_slug: str, chapter_slug: str, number: int):
        try:
            lesson = (
                Lesson.objects.select_related("chapter__course")
                .get(
                    chapter__course__slug=course_slug,
                    chapter__slug=chapter_slug,
                    number=number,
                )
            )
        except Lesson.DoesNotExist:
            return Response({"detail": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

        progress, _ = LessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
        return Response({"status": "started"}, status=status.HTTP_200_OK)


class LessonCompleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_slug: str, chapter_slug: str, number: int):
        try:
            lesson = (
                Lesson.objects.select_related("chapter__course")
                .get(
                    chapter__course__slug=course_slug,
                    chapter__slug=chapter_slug,
                    number=number,
                )
            )
        except Lesson.DoesNotExist:
            return Response({"detail": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

        progress, _ = LessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
        if not progress.completed_at:
            progress.completed_at = timezone.now()
            progress.save(update_fields=["completed_at"])
        return Response({"status": "completed"}, status=status.HTTP_200_OK)


class LastIncompleteLessonView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        progress = (
            LessonProgress.objects.select_related("lesson__chapter__course")
            .filter(user=request.user, completed_at__isnull=True)
            .order_by("-started_at")
            .first()
        )
        if not progress:
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        lesson = progress.lesson
        return Response(
            {
                "course_slug": lesson.chapter.course.slug,
                "chapter_slug": lesson.chapter.slug,
                "number": lesson.number,
                "title": lesson.title,
            }
        )


class CourseProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, course_slug: str):
        try:
            course = Course.objects.get(slug=course_slug)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get all lessons in the course
        total_lessons = Lesson.objects.filter(chapter__course=course).count()
        
        # Get completed lessons for this user
        completed_lessons = LessonProgress.objects.filter(
            user=request.user,
            lesson__chapter__course=course,
            completed_at__isnull=False
        ).count()
        
        percentage = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
        
        return Response({
            "completed": completed_lessons,
            "total": total_lessons,
            "percentage": round(percentage, 1)
        })


class NextAvailableLessonView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, course_slug: str):
        try:
            course = Course.objects.get(slug=course_slug)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get all lessons in order
        all_lessons = Lesson.objects.filter(
            chapter__course=course
        ).select_related('chapter').order_by('chapter__order_index', 'number')

        # Get completed lessons for this user
        completed_lessons = LessonProgress.objects.filter(
            user=request.user,
            lesson__chapter__course=course,
            completed_at__isnull=False
        ).values_list('lesson_id', flat=True)

        # Find the first lesson that is not completed
        for lesson in all_lessons:
            if lesson.id not in completed_lessons:
                return Response({
                    "course_slug": course.slug,
                    "chapter_slug": lesson.chapter.slug,
                    "number": lesson.number,
                    "title": lesson.title,
                    "is_free_preview": lesson.is_free_preview
                })

        # If all lessons are completed, return the last lesson
        if all_lessons.exists():
            last_lesson = all_lessons.last()
            return Response({
                "course_slug": course.slug,
                "chapter_slug": last_lesson.chapter.slug,
                "number": last_lesson.number,
                "title": last_lesson.title,
                "is_free_preview": last_lesson.is_free_preview,
                "all_completed": True
            })

        return Response({"detail": "No lessons found"}, status=status.HTTP_404_NOT_FOUND)


class LessonCompletionStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, course_slug: str):
        try:
            course = Course.objects.get(slug=course_slug)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get all lessons in order
        all_lessons = Lesson.objects.filter(
            chapter__course=course
        ).select_related('chapter').order_by('chapter__order_index', 'number')

        # Get completed lesson IDs for this user
        completed_lessons = LessonProgress.objects.filter(
            user=request.user,
            lesson__chapter__course=course,
            completed_at__isnull=False
        ).values_list('lesson_id', flat=True)

        # Get next available lesson
        next_lesson = None
        for lesson in all_lessons:
            if lesson.id not in completed_lessons:
                next_lesson = {
                    "chapter_slug": lesson.chapter.slug,
                    "number": lesson.number
                }
                break

        # Build completion status for each lesson
        lesson_statuses = []
        for lesson in all_lessons:
            is_completed = lesson.id in completed_lessons
            is_next = next_lesson and next_lesson["chapter_slug"] == lesson.chapter.slug and next_lesson["number"] == lesson.number
            
            lesson_statuses.append({
                "lesson_id": lesson.id,
                "chapter_slug": lesson.chapter.slug,
                "number": lesson.number,
                "title": lesson.title,
                "is_completed": is_completed,
                "is_next": is_next,
                "is_free_preview": lesson.is_free_preview
            })

        return Response({
            "course_slug": course.slug,
            "lesson_statuses": lesson_statuses,
            "next_lesson": next_lesson
        })

