# Production-ready Django settings
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import timedelta
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv()

# SECURITY SETTINGS - PRODUCTION READY
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-fallback-key')
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# Handle both production and Railway domains
production_hosts = os.getenv('ALLOWED_HOSTS', 'learncamera101.com,www.learncamera101.com').split(',')

ALLOWED_HOSTS = production_hosts
# For Railway deployment, also allow Railway domains
if os.getenv('RAILWAY_ENVIRONMENT'):
    ALLOWED_HOSTS.extend(['nxv40dv9.up.railway.app', '.railway.app'])

# CORS SETTINGS - Allow your Vercel frontend and Railway
CORS_ALLOWED_ORIGINS = [
    "https://learncamera101.com",
    "https://www.learncamera101.com",
    "http://localhost:3000",  # Local React development
]

# For Railway, also allow the Railway domain
if os.getenv('RAILWAY_ENVIRONMENT'):
    CORS_ALLOWED_ORIGINS.extend([
        "https://nxv40dv9.up.railway.app",
    ])

CORS_ALLOW_CREDENTIALS = True

# STRIPE SETTINGS
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLIC_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# URL SETTINGS - PRODUCTION READY
FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://learncamera101.com')
BACKEND_URL = os.getenv('BACKEND_URL', 'https://nxv40dv9.up.railway.app')

DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL"),
        conn_max_age=600,
        ssl_require=True if os.getenv("DATABASE_URL") else False
    )
}

# SECURITY MIDDLEWARE - SSL redirect disabled for Railway
SECURE_SSL_REDIRECT = os.getenv('RAILWAY_ENVIRONMENT') is None
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# LOGGING
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': 'django_errors.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

# STATIC FILES
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# MEDIA FILES
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')