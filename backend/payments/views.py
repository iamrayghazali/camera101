from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import stripe

from .serializers import RegisterSerializer, MyTokenObtainPairSerializer
from django.contrib.auth import get_user_model
from courses.models import Course
from .models import CoursePurchase

User = get_user_model()
stripe.api_key = settings.STRIPE_SECRET_KEY

# JWT
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Stripe Checkout

class CreatePaymentLinkView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        course_slug = request.data.get('course_slug')
        if not course_slug:
            return Response({"detail": "course_slug is required"}, status=400)
        try:
            course = Course.objects.get(slug=course_slug)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found"}, status=404)

        if not user.is_authenticated:
            return Response({"detail": "Not authenticated"}, status=401)

        # Your Stripe Payment Link URL
        payment_link_url = "https://buy.stripe.com/7sY7sK3745RraCAgK9efC01"
        
        # Add user info as URL parameters for tracking
        success_url = f"http://localhost:8000/api/payments/payment-success/?course={course.slug}&user_id={user.id}"
        cancel_url = "http://localhost:5173/cancel"
        
        # Redirect to Stripe Payment Link with success URL
        final_url = f"{payment_link_url}?success_url={success_url}&cancel_url={cancel_url}"
        
        return Response({'payment_url': final_url})

# Stripe Webhook
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        return JsonResponse({'status': 'invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError:
        return JsonResponse({'status': 'invalid signature'}, status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session.get('metadata', {}).get('user_id')
        course_slug = session.get('metadata', {}).get('course_slug')
        if user_id and course_slug:
            user = User.objects.get(id=user_id)
            try:
                course = Course.objects.get(slug=course_slug)
            except Course.DoesNotExist:
                return JsonResponse({'status': 'course not found'}, status=400)
            CoursePurchase.objects.get_or_create(
                user=user,
                course=course,
                defaults={
                    'stripe_session_id': session.get('id', ''),
                    'stripe_payment_intent': session.get('payment_intent', ''),
                }
            )
    
    # Handle Payment Link purchases
    elif event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        # For Payment Links, we need to identify the user from the success URL
        # The success URL contains user_id and course_slug as parameters
        print(f"Payment succeeded: {payment_intent['id']}")
        
    # Handle successful payments from Payment Links
    elif event['type'] == 'invoice.payment_succeeded':
        invoice = event['data']['object']
        # Handle successful payment from Payment Link
        print(f"Invoice payment succeeded: {invoice['id']}")
        
    # Handle checkout.session.completed for Payment Links
    elif event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Check if this is from a Payment Link (no metadata)
        if not session.get('metadata'):
            # This is likely from a Payment Link
            # We'll need to handle this differently - perhaps by checking the success URL
            print(f"Payment Link purchase completed: {session['id']}")
            # For now, we'll create a generic purchase record
            # You might want to modify this based on your specific needs

    return JsonResponse({'status': 'success'})


class CheckCourseAccessView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, course_slug):
        user = request.user
        try:
            course = Course.objects.get(slug=course_slug)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found"}, status=404)
        
        has_access = CoursePurchase.objects.filter(
            user=user, 
            course=course
        ).exists()
        
        return Response({
            "has_access": has_access,
            "course_slug": course_slug
        })


class HandlePaymentSuccessView(APIView):
    """
    Handle successful payments from Payment Links
    This view is called when users return from successful Stripe payments
    """
    permission_classes = [AllowAny]  # Allow access without authentication for now

    def get(self, request):
        course_slug = request.GET.get('course')
        user_id = request.GET.get('user_id')
        
        if not course_slug or not user_id:
            return Response({"detail": "Missing course or user_id"}, status=400)
        
        try:
            user = User.objects.get(id=user_id)
            course = Course.objects.get(slug=course_slug)
            
            # Create or update the purchase record
            CoursePurchase.objects.get_or_create(
                user=user,
                course=course,
                defaults={
                    'stripe_session_id': 'payment_link_purchase',
                    'stripe_payment_intent': 'payment_link_purchase',
                }
            )
            
            # Redirect to the frontend success page
            return HttpResponseRedirect(f"http://localhost:5173/success?course={course.slug}")
            
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found"}, status=404)