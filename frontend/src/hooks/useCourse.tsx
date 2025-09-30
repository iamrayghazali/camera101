import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../utils/axios";
import { useAuth } from "./UseAuth";

// Types
export interface Lesson {
    id: number;
    title: string;
    number: number;
    is_free_preview: boolean;
}

export interface Chapter {
    id: number;
    title: string;
    slug: string;
    order_index: number;
    lessons: Lesson[];
}

export interface Course {
    id: number;
    title: string;
    slug: string;
    description_markdown?: string;
    image_url?: string;
    price_eur?: number;
    chapters: Chapter[];
}

export interface LessonProgress {
    course_slug: string;
    chapter_slug: string;
    number: number;
    title: string;
}

export interface CourseProgress {
    completed: number;
    total: number;
    percentage: number;
}

export interface NextLesson {
    course_slug: string;
    chapter_slug: string;
    number: number;
    title: string;
    is_free_preview: boolean;
    all_completed?: boolean;
}

export interface LessonStatus {
    lesson_id: number;
    chapter_slug: string;
    number: number;
    title: string;
    is_completed: boolean;
    is_next: boolean;
    is_free_preview: boolean;
}

export interface UseCourseReturn {
    courses: Course[];
    courseAccess: Record<string, boolean>;
    lastIncompleteLesson: LessonProgress | null;
    loading: boolean;
    lastCompletedLessonPath: string;
    loadingStates: {
        courses: boolean;
        access: boolean;
        progress: boolean;
    };
    
    // Functions
    fetchCourses: () => Promise<void>;
    hasCourseAccess: (courseSlug: string) => boolean;
    getLessonStatus: (lesson: Lesson, courseSlug: string, nextLesson?: NextLesson | null, chapterSlug?: string) => 'available' | 'locked' | 'completed' | 'next';
    getCourseProgress: (courseSlug: string) => Promise<CourseProgress>;
    getNextAvailableLesson: (courseSlug: string) => Promise<NextLesson | null>;
    getLessonStatuses: (courseSlug: string) => Promise<LessonStatus[]>;
    isLessonCompleted: (courseSlug: string, chapterSlug: string, lessonNumber: number) => Promise<boolean>;
    handlePurchase: (courseSlug: string) => Promise<void>;
    startLesson: (courseSlug: string, chapterSlug: string, lessonNumber: number) => Promise<void>;
    completeLesson: (courseSlug: string, chapterSlug: string, lessonNumber: number) => Promise<void>;
    getLastIncompleteLesson: () => Promise<LessonProgress | null>;
    getLastCompletedLesson: () => Promise<LessonProgress | null>;
}

export const useCourse = (): UseCourseReturn => {
    const { isAuthenticated } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [courseAccess, setCourseAccess] = useState<Record<string, boolean>>({});
    const [lastIncompleteLesson, setLastIncompleteLesson] = useState<LessonProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastCompletedLessonPath, setLastCompletedLessonPath] = useState("");
    const [loadingStates, setLoadingStates] = useState({
        courses: false,
        access: false,
        progress: false
    });

    // Fetch all courses (always fetch, regardless of authentication)
    const fetchCourses = useCallback(async (): Promise<void> => {
        try {
            setLoadingStates(prev => ({ ...prev, courses: true }));
            setLoading(true);
            const response = await api.get("/api/courses/");
            setCourses(response.data);
        } catch (err: any) {
            console.error("Error fetching courses:", err);
            console.error("Error details:", err.response?.data);
        } finally {
            setLoading(false);
            setLoadingStates(prev => ({ ...prev, courses: false }));
        }
    }, []);

    // Check course access for all courses
    const checkCourseAccess = useCallback(async (): Promise<void> => {
        if (!isAuthenticated || courses.length === 0) return;

        try {
            setLoadingStates(prev => ({ ...prev, access: true }));
            const accessPromises = courses.map(async (course) => {
                try {
                    const response = await api.get(`/api/payments/check-access/${course.slug}/`);
                    return { slug: course.slug, hasAccess: response.data.has_access };
                } catch (error) {
                    console.error(`Error checking access for ${course.slug}:`, error);
                    return { slug: course.slug, hasAccess: false };
                }
            });

            const results = await Promise.all(accessPromises);
            const accessMap: Record<string, boolean> = {};
            results.forEach(({ slug, hasAccess }) => {
                accessMap[slug] = hasAccess;
            });
            setCourseAccess(accessMap);
        } catch (error) {
            console.error('Error checking course access:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, access: false }));
        }
    }, [isAuthenticated, courses]);

    // Combined function to get both last incomplete and completed lessons
    const getLastIncompleteLesson = useCallback(async (): Promise<LessonProgress | null> => {
        if (!isAuthenticated) return null;

        const token = localStorage.getItem("authToken");
        if (!token) return null;

        try {
            setLoadingStates(prev => ({ ...prev, progress: true }));

            const res = await api.get("/api/courses/progress/last-incomplete/", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && res.data.course_slug) {
                setLastIncompleteLesson(res.data);
                const path = `/${res.data.course_slug}/${res.data.chapter_slug}/${res.data.number}/`;
                setLastCompletedLessonPath(path);
                return res.data;
            } else {
                setLastIncompleteLesson(null);
                setLastCompletedLessonPath("");
                return null;
            }
        } catch (e) {
            console.error('Error fetching last incomplete lesson:', e);
            setLastIncompleteLesson(null);
            setLastCompletedLessonPath("");
            return null;
        } finally {
            setLoadingStates(prev => ({ ...prev, progress: false }));
        }
    }, [isAuthenticated]);

    // Get last completed lesson (now just returns the data, no duplicate API call)
    const getLastCompletedLesson = useCallback(async (): Promise<LessonProgress | null> => {
        return lastIncompleteLesson;
    }, [lastIncompleteLesson]);

    // Check if user has access to specific course
    const hasCourseAccess = useCallback((courseSlug: string): boolean => {
        return courseAccess[courseSlug] || false;
    }, [courseAccess]);

    // Get lesson status for a specific lesson
    const getLessonStatus = useCallback((lesson: Lesson, courseSlug: string, nextLesson?: NextLesson | null, chapterSlug?: string): 'available' | 'locked' | 'completed' | 'next' => {
        const hasAccess = hasCourseAccess(courseSlug);

        // If user has course access, all lessons are available
        if (hasAccess) return 'available';

        // If it's a free preview lesson, it's available
        if (lesson.is_free_preview) return 'available';

        // Check if this is the next available lesson
        if (nextLesson && chapterSlug && 
            nextLesson.chapter_slug === chapterSlug && 
            nextLesson.number === lesson.number) {
            return 'next';
        }

        // Otherwise, it's locked
        return 'locked';
    }, [hasCourseAccess]);

    // Calculate progress for a course with proper logic
    const getCourseProgress = useCallback(async (courseSlug: string): Promise<CourseProgress> => {
        const course = courses.find(c => c.slug === courseSlug);
        if (!course) return { completed: 0, total: 0, percentage: 0 };

        // Always fetch actual progress from the backend (works for both purchased and free lessons)
        try {
            const response = await api.get(`/api/courses/${courseSlug}/progress/`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching course progress:', error);
            console.error('Error details:', error.response?.data);
            // Fallback to 0 progress if API fails
            const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
            return { completed: 0, total: totalLessons, percentage: 0 };
        }
    }, [courses]);

    // Get next available lesson for a course
    const getNextAvailableLesson = useCallback(async (courseSlug: string): Promise<NextLesson | null> => {
        if (!isAuthenticated) return null;

        try {
            const response = await api.get(`/api/courses/${courseSlug}/next-lesson/`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching next available lesson:', error);
            console.error('Error details:', error.response?.data);
            return null;
        }
    }, [isAuthenticated]);

    // Get lesson completion statuses for a course
    const getLessonStatuses = useCallback(async (courseSlug: string): Promise<LessonStatus[]> => {
        if (!isAuthenticated) return [];

        try {
            const response = await api.get(`/api/courses/${courseSlug}/lesson-statuses/`);
            return response.data.lesson_statuses || [];
        } catch (error: any) {
            console.error('Error fetching lesson statuses:', error);
            console.error('Error details:', error.response?.data);
            return [];
        }
    }, [isAuthenticated]);

    // Check if a specific lesson is completed
    const isLessonCompleted = useCallback(async (courseSlug: string, chapterSlug: string, lessonNumber: number): Promise<boolean> => {
        if (!isAuthenticated) return false;

        try {
            // Use the lesson statuses endpoint to check completion
            const statuses = await getLessonStatuses(courseSlug);
            const lessonStatus = statuses.find(
                status => status.chapter_slug === chapterSlug && status.number === lessonNumber
            );
            return lessonStatus?.is_completed || false;
        } catch (error: any) {
            console.error('Error checking lesson completion:', error);
            return false;
        }
    }, [isAuthenticated, getLessonStatuses]);

    // Memoized course progress calculation
    const memoizedCourseProgress = useMemo(() => {
        return getCourseProgress;
    }, [getCourseProgress]);

    // Handle course purchase
    const handlePurchase = useCallback(async (courseSlug: string): Promise<void> => {
        if (!isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        try {
            const response = await api.post('/api/payments/create-payment-link/', {
                course_slug: courseSlug
            });

            // Redirect to the Payment Link URL
            window.location.href = response.data.payment_url;
        } catch (error) {
            console.error('Error creating payment link:', error);
            alert('Error creating payment link. Please try again.');
        }
    }, [isAuthenticated]);

    // Mark lesson as started
    const startLesson = useCallback(async (courseSlug: string, chapterSlug: string, lessonNumber: number): Promise<void> => {
        if (!isAuthenticated) return;

        try {
            await api.post(`/api/courses/${courseSlug}/${chapterSlug}/${lessonNumber}/start/`);
        } catch (error) {
            console.error('Error starting lesson:', error);
        }
    }, [isAuthenticated]);

    // Mark lesson as completed
    const completeLesson = useCallback(async (courseSlug: string, chapterSlug: string, lessonNumber: number): Promise<void> => {
        if (!isAuthenticated) return;

        try {
            await api.post(`/api/courses/${courseSlug}/${chapterSlug}/${lessonNumber}/complete/`);
            // Refresh progress after completion
            await getLastIncompleteLesson();
        } catch (error) {
            console.error('Error completing lesson:', error);
        }
    }, [isAuthenticated, getLastIncompleteLesson]);


    // Safety timeout to prevent infinite loading
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (loading) {
                console.warn('Loading timeout reached, setting loading to false');
                setLoading(false);
            }
        }, 10000); // 10 second timeout

        return () => clearTimeout(timeout);
    }, [loading]);

    // Initial data loading (always fetch courses)
    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // Load progress when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            getLastIncompleteLesson();
        }
    }, [isAuthenticated, getLastIncompleteLesson]);

    // Check access when courses are loaded and user is authenticated
    useEffect(() => {
        if (isAuthenticated && courses.length > 0) {
            checkCourseAccess();
        }
    }, [isAuthenticated, courses, checkCourseAccess]);

    return {
        // Data
        courses,
        courseAccess,
        lastIncompleteLesson,
        loading,
        lastCompletedLessonPath,
        loadingStates,
    
        // Functions
        fetchCourses,
        hasCourseAccess,
        getLessonStatus,
        getCourseProgress: memoizedCourseProgress,
        getNextAvailableLesson,
        getLessonStatuses,
        isLessonCompleted,
        handlePurchase,
        startLesson,
        completeLesson, 
        getLastIncompleteLesson,
        getLastCompletedLesson,
    };
};