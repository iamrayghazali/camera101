from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, CoursePurchase

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = ('username', 'email', 'is_staff', 'is_superuser')

    list_filter = ('is_staff', 'is_superuser')

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("email",)}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "password1", "password2"),
            },
        ),
    )

    search_fields = ("username", "email")
    ordering = ("username",)


@admin.register(CoursePurchase)
class CoursePurchaseAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "purchased_at", "stripe_session_id")
    list_filter = ("course",)
    search_fields = ("user__username", "course__title", "stripe_session_id")