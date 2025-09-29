import os
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv()

# SECURITY SETTINGS
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
DEBUG = os.environ.get('DJANGO_DEBUG', 'False').lower() == 'true'  # Fixed this line

# ALLOWED_HOSTS - Simple approach
ALLOWED_HOSTS = ['*']  # Allow everything for now

# Application definition (YOU NEED THIS)
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    # Your apps
    'payments',
    'courses',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# CORS SETTINGS
CORS_ALLOWED_ORIGINS = [
    "https://learncamera101.com",
    "https://www.learncamera101.com",
    "http://localhost:3000",
]

if os.getenv('RAILWAY_ENVIRONMENT'):
    CORS_ALLOWED_ORIGINS.extend([
        "https://nxv40dv9.up.railway.app",
    ])

CORS_ALLOW_CREDENTIALS = True

# STRIPE SETTINGS
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY")  # Fixed name
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")

# URL SETTINGS
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://learncamera101.com')
BACKEND_URL = os.environ.get('BACKEND_URL', 'https://nxv40dv9.up.railway.app')

# DATABASE - Your existing logic is fine
DB_PROD_LIVE = os.environ.get('DB_PROD_LIVE')

if DB_PROD_LIVE in ['True', 'true']:
    DATABASES = {
        "default": {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('PROD_POSTGRES_DB'),
            'USER': os.environ.get('PROD_POSTGRES_USER'),
            'PASSWORD': os.environ.get('PROD_POSTGRES_PASSWORD'),
            'HOST': os.environ.get('PROD_POSTGRES_HOST'),
            'PORT': os.environ.get('PROD_POSTGRES_PORT'),
        }
    }
else:
    DATABASES = {
        "default": {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DEV_POSTGRES_DB'),
            'USER': os.environ.get('DEV_POSTGRES_USER'),
            'PASSWORD': os.environ.get('DEV_POSTGRES_PASSWORD'),
            'HOST': os.environ.get('DEV_POSTGRES_HOST'),
            'PORT': os.environ.get('DEV_POSTGRES_PORT'),
        }
    }

# SECURITY MIDDLEWARE
SECURE_SSL_REDIRECT = os.environ.get('RAILWAY_ENVIRONMENT') is not None
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# STATIC FILES
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# MEDIA FILES
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'