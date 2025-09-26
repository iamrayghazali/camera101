# 📸 Camera101 - Photography Learning Platform

A modern, full-stack photography education platform built with React, TypeScript, Django, and Stripe. Learn photography through interactive courses, simulators, and hands-on lessons.

![Camera101 Hero](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![Django](https://img.shields.io/badge/Django-5.2.6-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Stripe](https://img.shields.io/badge/Stripe-12.5.1-purple)

## 🌟 Features

### 📚 **Course Management**
- **Interactive Lessons**: Rich content with text, images, and videos
- **Progress Tracking**: Real-time progress monitoring and completion status
- **Free Previews**: Try-before-you-buy with free lesson previews
- **Chapter Organization**: Structured learning with expandable chapters

### 🎯 **Learning Experience**
- **iPhone Camera Simulator**: Practice photography skills without a real camera
- **Mobile-First Design**: Optimized for all devices
- **Smooth Animations**: Polished UX with Framer Motion
- **Responsive Navigation**: Intuitive course navigation with breadcrumbs

### 💳 **Payment Integration**
- **Stripe Checkout**: Secure payment processing
- **Course Purchases**: One-time payments for full course access
- **Access Control**: Smart lesson unlocking based on purchase status

### 🔐 **Authentication**
- **JWT Authentication**: Secure token-based auth
- **User Registration**: Easy signup with email validation
- **Session Management**: Automatic token refresh and expiration handling


## 🛠️ API Endpoints

### **Authentication**
```
POST /api/payments/register/          # User registration
POST /api/payments/token/             # Login (JWT)
POST /api/payments/check-access/      # Check course access
```

### **Courses**
```
GET  /api/courses/                    # List all courses
GET  /api/courses/{slug}/             # Course details
GET  /api/courses/{slug}/progress/    # Course progress
GET  /api/courses/{slug}/next-lesson/ # Next available lesson
```

### **Lessons**
```
GET  /api/courses/{slug}/{chapter}/{number}/  # Lesson content
POST /api/courses/{slug}/{chapter}/{number}/start/    # Start lesson
POST /api/courses/{slug}/{chapter}/{number}/complete/ # Complete lesson
```

### **Payments**
```
POST /api/payments/create-checkout-session/  # Create Stripe session
POST /api/payments/webhook/                   # Stripe webhook
```

## 🎨 Frontend Architecture

### **Custom Hooks**
- **`useAuth`**: Authentication state management
- **`useCourse`**: Course data and progress tracking

### **Key Components**
- **`App.tsx`**: Main application with hero section
- **`CourseOverview.tsx`**: Course dashboard and curriculum
- **`LessonView.tsx`**: Individual lesson viewer
- **`iPhoneCameraSimulator.tsx`**: Interactive camera simulator

### **State Management**
- React Context for authentication
- Custom hooks for data fetching
- Local state for UI interactions

## 🔒 Security Features

### **Authentication**
- JWT tokens with 1-hour expiration
- Automatic token refresh
- Secure password handling

### **Access Control**
- Course purchase verification
- Free lesson access for unauthenticated users
- Protected lesson content

### **Payment Security**
- Stripe webhook verification
- Secure session management
- PCI compliance through Stripe
