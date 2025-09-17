from django.urls import path
from .views import CreateCheckoutSessionView, stripe_webhook
from .views_auth import RegisterView, MyTokenObtainPairView

urlpatterns = [
    path('create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    path('webhook/', stripe_webhook),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]