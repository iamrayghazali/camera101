from django.contrib import admin
from .models import Course, Chapter, Lesson, LessonBlock, LessonProgress


class LessonBlockInline(admin.TabularInline):
    model = LessonBlock
    extra = 0
    fields = ("order_index", "block_type", "text_markdown", "image_urls", "video_url", "links")
    ordering = ("order_index",)


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0
    fields = ("order_index", "number", "title", "is_free_preview")
    ordering = ("order_index",)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "stripe_price_id", "image")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "slug")
    inlines = []


class ChapterInline(admin.TabularInline):
    model = Chapter
    extra = 0
    fields = ("order_index", "title")
    ordering = ("order_index",)


CourseAdmin.inlines = [ChapterInline]


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order_index")
    list_filter = ("course",)
    ordering = ("course", "order_index")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "chapter", "number", "order_index", "is_free_preview")
    list_filter = ("chapter__course", "chapter")
    ordering = ("chapter", "order_index")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [LessonBlockInline]

@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "lesson", "started_at", "completed_at")
    list_filter = ("lesson__chapter__course", "lesson__chapter", "completed_at")
    search_fields = ("user__username", "user__email", "lesson__title")


