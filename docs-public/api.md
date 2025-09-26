# 📡 Camera101 API Documentation

## Base URL
```
Development: http://localhost:8000
Production: https://learncamera101.com
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 🔐 Authentication
```
POST /api/payments/register/
POST /api/payments/token/
GET  /api/payments/check-access/{course_slug}/
```

### 📚 Courses
```
GET  /api/courses/
GET  /api/courses/{course_slug}/
GET  /api/courses/{course_slug}/progress/
GET  /api/courses/{course_slug}/next-lesson/
```

### 📖 Lessons
```
GET  /api/courses/{course_slug}/{chapter_slug}/{lesson_number}/
POST /api/courses/{course_slug}/{chapter_slug}/{lesson_number}/start/
POST /api/courses/{course_slug}/{chapter_slug}/{lesson_number}/complete/
```

### 💳 Payments
```
POST /api/payments/create-checkout-session/
POST /api/payments/webhook/
```

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message for this field"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "A server error occurred."
}
```