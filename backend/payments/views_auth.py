from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(write_only=True, required=True)
    # Make username optional so clients can omit it when logging in with email
    username = serializers.CharField(write_only=True, required=False, allow_blank=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Ensure base username field isn't required
        if self.username_field in self.fields:
            self.fields[self.username_field].required = False
            self.fields[self.username_field].allow_blank = True
            self.fields[self.username_field].write_only = True

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email:
            raise serializers.ValidationError({"email": "This field is required."})
        if not password:
            raise serializers.ValidationError({"password": "This field is required."})

        try:
            user = User.objects.get(email__iexact=email.strip().lower())
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "No active account found with the given credentials"})
        except User.MultipleObjectsReturned:
            # If duplicates exist with different casing, pick the earliest created active user
            user = User.objects.filter(email__iexact=email.strip().lower(), is_active=True).order_by('date_joined').first()
            if not user:
                raise serializers.ValidationError({"detail": "No active account found with the given credentials"})

        data = super().validate({
            self.username_field: getattr(user, self.username_field),
            'password': password,
        })

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['has_paid'] = user.has_paid
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer