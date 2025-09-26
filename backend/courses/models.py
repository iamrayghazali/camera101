from django.db import models
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Course(TimeStampedModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description_markdown = models.TextField(blank=True, default="")
    stripe_price_id = models.CharField(max_length=255, blank=True, default="")
    price_eur = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Price in EUR")
    image = models.ImageField(upload_to="course_images/", blank=True, null=True)

    class Meta:
        ordering = ["title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Chapter(TimeStampedModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="chapters")
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, blank=True)
    order_index = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order_index", "id"]
        unique_together = (("course", "slug"),)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.course.title} / {self.title}"


class Lesson(TimeStampedModel):
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, blank=True)
    order_index = models.PositiveIntegerField(default=0)
    number = models.PositiveIntegerField(default=1)
    is_free_preview = models.BooleanField(default=False)

    class Meta:
        ordering = ["order_index", "id"]
        unique_together = (("chapter", "slug"), ("chapter", "number"))

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.number or self.number == 0:
            last = (
                Lesson.objects.filter(chapter=self.chapter)
                .order_by("-number")
                .first()
            )
            self.number = (last.number + 1) if last else 1
        if not self.order_index or self.order_index == 0:
            self.order_index = max(self.number - 1, 0)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.chapter.title} / {self.title}"


class LessonBlock(TimeStampedModel):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    BLOCK_TYPE_CHOICES = [
        (TEXT, "Text"),
        (IMAGE, "Image"),
        (VIDEO, "Video"),
    ]

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="blocks")
    block_type = models.CharField(max_length=10, choices=BLOCK_TYPE_CHOICES)
    order_index = models.PositiveIntegerField(default=0)

    # Content fields. Only one or more will be used depending on type.
    text_markdown = models.TextField(blank=True, default="")
    image_urls = models.JSONField(blank=True, default=list)
    video_url = models.URLField(blank=True, default="")
    links = models.JSONField(blank=True, default=list)

    class Meta:
        ordering = ["order_index", "id"]

    def __str__(self):
        return f"{self.lesson.title} block {self.order_index} ({self.block_type})"


# Track user progress through lessons
from django.conf import settings


class LessonProgress(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lesson_progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="progress")
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = (("user", "lesson"),)
        ordering = ["-started_at", "id"]

    def __str__(self):
        status = "completed" if self.completed_at else "in-progress"
        return f"{self.user} / {self.lesson} ({status})"

