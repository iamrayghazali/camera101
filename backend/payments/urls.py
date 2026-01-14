from django.urls import path
from .views import CreatePaymentLinkView, stripe_webhook, CheckCourseAccessView, HandlePaymentSuccessView
from .views_auth import RegisterView, MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
urlpatterns = [
    path('create-payment-link/', CreatePaymentLinkView.as_view(), name='create-payment-link'),
    path('check-access/<str:course_slug>/', CheckCourseAccessView.as_view(), name='check-course-access'),
    path('payment-success/', HandlePaymentSuccessView.as_view(), name='payment-success'),
    path('webhook/', stripe_webhook),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

]