from django.urls import path
from .views import (
    CourseListView,
    CourseDetailView,
    ChapterDetailView,
    LessonByNumberView,
    LessonStartView,
    LessonCompleteView,
    LastIncompleteLessonView,
    CourseProgressView,
    NextAvailableLessonView,
    LessonCompletionStatusView,
)

urlpatterns = [
    path('', CourseListView.as_view(), name='course-list'),
    path('<slug:slug>/', CourseDetailView.as_view(), name='course-detail'),
    path('<slug:course_slug>/<slug:chapter_slug>/<int:number>/', LessonByNumberView.as_view(), name='lesson-by-number'),
    path('<slug:course_slug>/<slug:chapter_slug>/<int:number>/start/', LessonStartView.as_view(), name='lesson-start'),
    path('<slug:course_slug>/<slug:chapter_slug>/<int:number>/complete/', LessonCompleteView.as_view(), name='lesson-complete'),
    path('progress/last-incomplete/', LastIncompleteLessonView.as_view(), name='last-incomplete'),
    path('<slug:course_slug>/progress/', CourseProgressView.as_view(), name='course-progress'),
    path('<slug:course_slug>/next-lesson/', NextAvailableLessonView.as_view(), name='next-lesson'),
    path('<slug:course_slug>/lesson-statuses/', LessonCompletionStatusView.as_view(), name='lesson-statuses'),
]


