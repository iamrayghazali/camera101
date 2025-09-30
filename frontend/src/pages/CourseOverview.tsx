import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/UseAuth";
import { useCourse, type Course as CourseFromHook } from "../hooks/useCourse";
import { AiOutlineLock, AiOutlinePlayCircle, AiOutlineBook, AiOutlineDown, AiOutlineUp, AiOutlineCheck } from "react-icons/ai";
import { MdAssessment } from "react-icons/md";

type Lesson = {
    id: number;
    title: string;
    number: number;
    is_free_preview: boolean;
};

// ✅ Use the Course type from useCourse hook
type Course = CourseFromHook;

export default function CourseOverview() {
    const { courseSlug } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, initialLoading } = useAuth();
    const {
        courses,
        getCourseProgress,
        hasCourseAccess,
        getLessonStatuses,
        handlePurchase,
        lastCompletedLessonPath,
        loading: courseLoading
    } = useCourse();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
    const [lessonStatuses, setLessonStatuses] = useState<any[]>([]);

    // Redirect if not authenticated (but wait for initial auth check)
    useEffect(() => {
        if (!initialLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, initialLoading, navigate]);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);

        if (!isAuthenticated) return;

        // Find course from useCourse hook first
        const courseFromHook = courses.find(c => c.slug === courseSlug);
        if (courseFromHook) {
            if (!mounted) return;
            setCourse(courseFromHook);
            setLoading(false);
            return;
        }

        // If not found in hook, fetch from API
        import("../utils/axios").then(({ default: api }) => {
            api.get(`/api/courses/${courseSlug}/`).then(res => {
                if (!mounted) return;
                setCourse(res.data);
            }).catch(err => {
                if (!mounted) return;
                if (err?.response?.status === 404) {
                    navigate('/404');
                    return;
                }
                setError(err?.response?.data?.detail || "Failed to load course.");
            }).finally(() => mounted && setLoading(false));
        });

        return () => {
            mounted = false;
        };
    }, [courseSlug, isAuthenticated, navigate, courses]);

    const hasAccess = courseSlug ? hasCourseAccess(courseSlug) : false;

    // Get course progress from useCourse hook
    const [courseProgress, setCourseProgress] = useState({ completed: 0, total: 0, percentage: 0 });

    // Fetch course progress
    useEffect(() => {
        if (courseSlug) {
            getCourseProgress(courseSlug).then(progress => {
                setCourseProgress(progress);
            });
        }
    }, [courseSlug, getCourseProgress]);


    // Fetch lesson statuses
    useEffect(() => {
        if (courseSlug) {
            getLessonStatuses(courseSlug).then(statuses => {
                setLessonStatuses(statuses);
            });
        }
    }, [courseSlug, getLessonStatuses]);

    // Debug course data
    useEffect(() => {
        if (course) {
            console.log('Course data:', course);
            console.log('First chapter:', course.chapters[0]);
            console.log('First lesson:', course.chapters[0]?.lessons[0]);
            console.log('Last completed lesson path:', lastCompletedLessonPath);
        }
    }, [course, lastCompletedLessonPath]);


    // Get lesson status from the fetched lesson statuses
    const getLessonStatusFromData = (lesson: Lesson, chapterSlug: string) => {
        const lessonStatus = lessonStatuses.find(
            status => status.chapter_slug === chapterSlug && status.number === lesson.number
        );

        if (!lessonStatus) return 'locked';

        if (lessonStatus.is_completed) return 'completed';
        if (lessonStatus.is_next) return 'next';
        if (lessonStatus.is_free_preview || hasAccess) return 'available';

        return 'locked';
    };

    const toggleChapter = (chapterId: number) => {
        setExpandedChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterId)) {
                newSet.delete(chapterId);
            } else {
                newSet.add(chapterId);
            }
            return newSet;
        });
    };



    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-lg font-semibold text-white">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }
    if (loading || courseLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-lg font-semibold text-white">Loading course...</p>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <div className="text-center">
                    <div className="alert alert-error shadow-lg max-w-md">
                        <span className="font-bold">Error: {error}</span>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary mt-4"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
    if (!course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
                    <Link to="/learn" className="btn btn-primary">Back to Courses</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-300">
            <Navbar />

            {/* Dashboard Layout */}
            <div className="mt-20 flex flex-col lg:flex-row">


                {/* Main Content */}
                <div className="flex-1 p-4 lg:p-8">
                    {/* Header */}
                    <div className="mb-6 lg:mb-8">
                        <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left side - Course info */}
                                <div className="flex flex-col justify-center order-1 lg:order-1">
                                    <div className="mb-6">
                                        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">{course.title}</h1>
                                        <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                                            {course.description_markdown?.replace(/[#*]/g, '').substring(0, 200) || 'Master the art of photography with this comprehensive course.'}
                                            {course.description_markdown && course.description_markdown.length > 200 && '...'}
                                        </p>
                                    </div>

                                </div>

                                {/* Right side - Course image */}
                                <div className="flex items-center justify-center order-2 lg:order-2">
                                    <div className="relative">
                                        <img
                                            src={course.image_url}
                                            alt={course.title}
                                            className="w-full max-w-md h-80 lg:h-96 rounded-2xl object-cover shadow-2xl"
                                        />
                                        <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                                            {hasAccess ? 'Full Access' : 'Try Free Lessons'}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons - Below image on mobile */}
                                <div className="order-3 lg:order-3 lg:col-span-2 flex justify-center lg:justify-start">
                                    {hasAccess ? (
                                        <Link
                                            to={lastCompletedLessonPath || `/${course.slug}/${course.chapters[0].slug}/${course.chapters[0].lessons[0].number}`}
                                            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                                        >
                                            <AiOutlinePlayCircle className="text-xl" />
                                            Continue Learning
                                        </Link>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <Link
                                                to={`/${course.slug}/${course.chapters[0].slug}/${course.chapters[0].lessons[0].number}`}
                                                className="inline-flex items-center gap-3 bg-white text-primary hover:bg-gray-50 border-2 border-primary py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                            >
                                                <AiOutlinePlayCircle className="text-xl" />
                                                Start Free Lesson
                                            </Link>
                                            <button
                                                onClick={() => handlePurchase(course.slug)}
                                                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                                            >
                                                <AiOutlinePlayCircle className="text-xl" />
                                                Buy Course
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Stats Cards - Below image on mobile, right side on desktop */}
                                <div className="grid grid-cols-2 gap-4 order-3 lg:order-3 lg:col-span-2">
                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <AiOutlineBook className="text-primary text-lg" />
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-lg font-bold text-gray-900">{course.chapters.length}</p>
                                                <p className="text-gray-600 text-xs">Chapters</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <AiOutlinePlayCircle className="text-primary text-lg" />
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-lg font-bold text-gray-900">{course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)}</p>
                                                <p className="text-gray-600 text-xs">Lessons</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <MdAssessment className="text-primary text-lg" />
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-lg font-bold text-gray-900">{courseProgress.completed}</p>
                                                <p className="text-gray-600 text-xs">Completed</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <span className="text-primary text-lg font-bold">%</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-lg font-bold text-gray-900">{courseProgress.percentage}%</p>
                                                <p className="text-gray-600 text-xs">Progress</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar - At bottom of header */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900">Course Progress</h3>
                                    <span className="text-lg font-bold text-primary">{courseProgress.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <motion.div
                                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${courseProgress.percentage}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                    ></motion.div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                                    <span>{courseProgress.completed} lessons completed</span>
                                    <span>{courseProgress.total - courseProgress.completed} lessons remaining</span>
                                </div>
                            </div>
                        </div>
                    </div>




                    {/* Course Curriculum */}
                    <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-2">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Course Curriculum</h2>
                            <p className="text-gray-600 text-sm">Click chapters to expand</p>
                        </div>

                        <div className="space-y-3">
                            {course.chapters.sort((a, b) => a.order_index - b.order_index).map((chapter, chapterIndex) => {
                                const isExpanded = expandedChapters.has(chapter.id);

                                return (
                                    <div
                                        key={chapter.id}
                                        className="border border-gray-200 rounded-lg overflow-hidden"
                                    >
                                        {/* Chapter Header - Clickable */}
                                        <button
                                            onClick={() => toggleChapter(chapter.id)}
                                            className="w-full bg-gray-50 hover:bg-gray-100 p-3 lg:p-4 text-left flex items-center justify-between transition-colors duration-200"
                                        >
                                            <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                                                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs lg:text-sm font-bold flex-shrink-0">
                                                    {chapterIndex + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{chapter.title}</h3>
                                                    <p className="text-xs lg:text-sm text-gray-600">{chapter.lessons.length} lessons</p>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 ml-2">
                                                {isExpanded ? (
                                                    <AiOutlineUp className="text-gray-500 text-sm lg:text-base" />
                                                ) : (
                                                    <AiOutlineDown className="text-gray-500 text-sm lg:text-base" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Lessons - Collapsible */}
                                        <motion.div
                                            initial={false}
                                            animate={{ height: isExpanded ? 'auto' : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-3 lg:p-4 bg-gray-50 space-y-2">
                                                {chapter.lessons.sort((a, b) => a.number - b.number).map((lesson) => {
                                                    const status = getLessonStatusFromData(lesson, chapter.slug);

                                                    return (
                                                        <div
                                                            key={lesson.id}
                                                            className={`p-2 lg:p-3 rounded-lg border transition-colors duration-200 ${status === 'completed'
                                                                    ? 'bg-green-50 border-green-200'
                                                                    : status === 'next'
                                                                        ? 'bg-primary/10 border-primary hover:border-primary/70'
                                                                        : status === 'available'
                                                                            ? 'bg-white border-blue-200 hover:border-blue-300'
                                                                            : 'bg-gray-100 border-gray-200'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                                                                    <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${status === 'completed'
                                                                            ? 'bg-green-500 text-white'
                                                                            : status === 'next'
                                                                                ? 'bg-primary text-white'
                                                                                : status === 'available'
                                                                                    ? 'bg-blue-500 text-white'
                                                                                    : 'bg-gray-400 text-white'
                                                                        }`}>
                                                                        {status === 'completed' ? (
                                                                            <AiOutlineCheck className="text-xs" />
                                                                        ) : status === 'available' || status === 'next' ? (
                                                                            <AiOutlinePlayCircle className="text-xs" />
                                                                        ) : (
                                                                            <AiOutlineLock className="text-xs" />
                                                                        )}
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <h4 className="font-medium text-gray-900 text-xs lg:text-sm truncate">
                                                                            {lesson.number}. {lesson.title}
                                                                        </h4>
                                                                        <div className="flex items-center gap-1 lg:gap-2 text-xs text-gray-600">
                                                                            {lesson.is_free_preview && (
                                                                                <span className="bg-green-100 text-green-800 px-1 lg:px-2 py-1 rounded-full text-xs font-medium">
                                                                                    FREE
                                                                                </span>
                                                                            )}
                                                                            {status === 'completed' && (
                                                                                <span className="bg-green-100 text-green-800 px-1 lg:px-2 py-1 rounded-full text-xs font-medium">
                                                                                    COMPLETED
                                                                                </span>
                                                                            )}
                                                                            {status === 'next' && (
                                                                                <span className="bg-primary/20 text-primary px-1 lg:px-2 py-1 rounded-full text-xs font-medium">
                                                                                    NEXT LESSON
                                                                                </span>
                                                                            )}
                                                                            {status === 'locked' && !lesson.is_free_preview && (
                                                                                <span className="text-gray-500 text-xs">Purchase required</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex-shrink-0">
                                                                    {status === 'locked' ? (
                                                                        <button
                                                                            className="btn btn-disabled btn-xs bg-gray-300 text-gray-600 border-gray-300"
                                                                            disabled
                                                                        >
                                                                            <AiOutlineLock className="text-xs" />
                                                                        </button>
                                                                    ) : status === 'completed' ? (
                                                                        <Link
                                                                            to={`/${course.slug}/${chapter.slug}/${lesson.number}`}
                                                                            className="btn btn-success btn-xs"
                                                                        >
                                                                            <AiOutlineCheck className="text-xs" />
                                                                            Completed
                                                                        </Link>
                                                                    ) : status === 'next' ? (
                                                                        <Link
                                                                            to={`/${course.slug}/${chapter.slug}/${lesson.number}`}
                                                                            className="btn btn-primary btn-xs"
                                                                        >
                                                                            <AiOutlinePlayCircle className="text-xs" />
                                                                            Next Lesson
                                                                        </Link>
                                                                    ) : status === 'available' ? (
                                                                        <Link
                                                                            to={`/${course.slug}/${chapter.slug}/${lesson.number}`}
                                                                            className="btn btn-outline btn-xs"
                                                                        >
                                                                            <AiOutlinePlayCircle className="text-xs" />
                                                                            Start
                                                                        </Link>
                                                                    ) : (
                                                                        <button
                                                                            className="btn btn-disabled btn-xs bg-gray-400 text-gray-700 border-gray-400"
                                                                            disabled
                                                                        >
                                                                            <AiOutlinePlayCircle className="text-xs" />
                                                                            Start
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}