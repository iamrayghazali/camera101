from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.conf import settings

try:
    from courses.models import Course
except Exception:
    Course = None

class User(AbstractUser):
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="payments_users",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="payments_users_permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )
    has_paid = models.BooleanField(default=False)


class CoursePurchase(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="purchases")
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name="purchases")
    stripe_session_id = models.CharField(max_length=255, blank=True, default="")
    stripe_payment_intent = models.CharField(max_length=255, blank=True, default="")
    purchased_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = (("user", "course"),)

    def __str__(self):
        return f"{self.user.username} -> {self.course.title} at {self.purchased_at}"