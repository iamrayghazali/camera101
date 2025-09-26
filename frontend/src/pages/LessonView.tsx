import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/UseAuth";
import { useCourse } from "../hooks/useCourse";
import { 
    AiOutlineLock, 
    AiOutlineCheckCircle, 
    AiOutlineLeft, 
    AiOutlineRight
} from "react-icons/ai";

type LessonBlock = {
    id: number;
    block_type: "text" | "image" | "video";
    order_index: number;
    text_markdown?: string;
    image_urls?: string[];
    video_url?: string;
    links?: { title: string; url: string }[];
};

type Lesson = {
    id: number;
    title: string;
    number: number;
    is_free_preview: boolean;
    blocks: LessonBlock[];
};

type Chapter = { 
    title: string; 
    slug: string;
    order_index: number;
};

type Course = { 
    title: string; 
    slug: string;
};

type CourseWithStructure = {
    title: string;
    slug: string;
    chapters: Array<{
        id: number;
        title: string;
        slug: string;
        order_index: number;
        lessons: Array<{
            id: number;
            title: string;
            number: number;
            is_free_preview: boolean;
        }>;
    }>;
};

export default function LessonView() {
    const { courseSlug, chapterSlug, number } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, initialLoading } = useAuth();
    const { hasCourseAccess, completeLesson, getCourseProgress, isLessonCompleted } = useCourse();
    
    // Function to convert video URLs to embed format
    const getEmbedUrl = (url: string): string => {
        // YouTube URLs
        if (url.includes('youtube.com/watch')) {
            const videoId = url.split('v=')[1]?.split('&')[0];
            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        }
        if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1]?.split('?')[0];
            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        }
        // Vimeo URLs
        if (url.includes('vimeo.com/')) {
            const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
            return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
        }
        // Return original URL if not a known platform
        return url;
    };
    
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [courseData, setCourseData] = useState<CourseWithStructure | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [wasAlreadyCompleted, setWasAlreadyCompleted] = useState(false);
    const [showLockModal, setShowLockModal] = useState(false);

    // Redirect if not authenticated (but wait for initial auth check)
    useEffect(() => {
        if (!initialLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, initialLoading, navigate]);

    // Reset completion state when lesson changes
    useEffect(() => {
        setIsCompleted(false);
        setWasAlreadyCompleted(false);
        console.log(`Loading lesson ${courseSlug}/${chapterSlug}/${number}`);
    }, [courseSlug, chapterSlug, number]);

    // Check if lesson is already completed
    useEffect(() => {
        const checkLessonCompletion = async () => {
            if (courseSlug && chapterSlug && number) {
                try {
                    const completed = await isLessonCompleted(courseSlug, chapterSlug, parseInt(number));
                    setWasAlreadyCompleted(completed);
                    if (completed) {
                        setIsCompleted(true);
                    }
                } catch (error) {
                    console.error('Error checking lesson completion:', error);
                }
            }
        };

        checkLessonCompletion();
    }, [courseSlug, chapterSlug, number, isLessonCompleted]);

    // Load lesson data
    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);
        
        if (!isAuthenticated || !courseSlug || !chapterSlug || !number) return;

        // Load lesson
        api.get(`/api/courses/${courseSlug}/${chapterSlug}/${number}/`)
            .then(res => {
                if (!mounted) return;
                setLesson(res.data);
            })
            .catch(err => {
                if (!mounted) return;
                setError(err?.response?.data?.detail || "Failed to load lesson.");
            })
            .finally(() => mounted && setLoading(false));

        // Load course structure
        api.get(`/api/courses/${courseSlug}/`)
            .then(res => {
                if (!mounted) return;
                const cd = res.data as CourseWithStructure;
                setCourseData(cd);
                setCourse({ title: cd.title, slug: cd.slug });
                const ch = (cd.chapters || []).find((c: any) => c.slug === chapterSlug);
                if (ch) setChapter({ title: ch.title, slug: ch.slug, order_index: ch.order_index });
            })
            .catch(() => {
                // Silently fail - not critical
            });

        return () => {
            mounted = false;
        };
    }, [courseSlug, chapterSlug, number, isAuthenticated]);

// Mark lesson as started when loaded
    useEffect(() => {
        if (!lesson || !courseSlug || !chapterSlug || !number) return;
        api.post(`/api/courses/${courseSlug}/${chapterSlug}/${number}/start/`).catch(() => {
            // Silently fail - not critical
        });
    }, [lesson, courseSlug, chapterSlug, number]);

    const hasAccess = courseSlug ? hasCourseAccess(courseSlug) : false;
    const canAccessCurrentLesson = lesson ? (hasAccess || lesson.is_free_preview) : false;

    const currentPosition = useMemo(() => {
        if (!courseData) return null;
        const chIdx = courseData.chapters
            .sort((a, b) => a.order_index - b.order_index)
            .findIndex(c => c.slug === chapterSlug);
        if (chIdx === -1) return null;
        const ch = courseData.chapters.sort((a, b) => a.order_index - b.order_index)[chIdx];
        const lessonsSorted = ch.lessons.slice().sort((a, b) => a.number - b.number);
        const lsIdx = lessonsSorted.findIndex(l => String(l.number) === String(number));
        if (lsIdx === -1) return null;
        return { chIdx, lsIdx, ch, lessonsSorted };
    }, [courseData, chapterSlug, number]);

    const canAccessLesson = (lesson: any) => {
        if (!isAuthenticated) return false;
        return hasAccess || lesson.is_free_preview;
    };

    const handleCompleteLesson = async () => {
        if (!lesson || !courseSlug || !chapterSlug || !number) return;
        
        // Check if user has access to complete this lesson
        if (!canAccessCurrentLesson) {
            alert('You need to purchase the course to complete lessons.');
            return;
        }
        
        setIsCompleting(true);
        try {
            await completeLesson(courseSlug, chapterSlug, parseInt(number));
            setIsCompleted(true);
            // Refresh course progress to update overview page
            if (courseSlug) {
                // Add a small delay to ensure database has been updated
                setTimeout(() => {
                    getCourseProgress(courseSlug).then(progress => {
                        console.log('Course progress updated:', progress);
                    });
                }, 500);
            }
        } catch (error) {
            console.error('Error completing lesson:', error);
            alert('Failed to complete lesson. Please try again.');
        } finally {
            setIsCompleting(false);
        }
    };

    const goPrev = () => {
        if (!currentPosition || !courseData) return;
        const { chIdx, lsIdx } = currentPosition;
        const chaptersSorted = courseData.chapters.slice().sort((a, b) => a.order_index - b.order_index);
        
        if (lsIdx > 0) {
            const ch = chaptersSorted[chIdx];
            const lessons = ch.lessons.slice().sort((a, b) => a.number - b.number);
            const target = lessons[lsIdx - 1];
            navigate(`/${courseData.slug}/${ch.slug}/${target.number}`);
        } else if (chIdx > 0) {
            const prevCh = chaptersSorted[chIdx - 1];
            const lessons = prevCh.lessons.slice().sort((a, b) => a.number - b.number);
            const target = lessons[lessons.length - 1];
            navigate(`/${courseData.slug}/${prevCh.slug}/${target.number}`);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goNext = () => {
        if (!currentPosition || !courseData) return;
        const { chIdx, lsIdx } = currentPosition;
        const chaptersSorted = courseData.chapters.slice().sort((a, b) => a.order_index - b.order_index);
        const ch = chaptersSorted[chIdx];
        const lessons = ch.lessons.slice().sort((a, b) => a.number - b.number);
        
        let nextLesson = null;
        let nextChapter = null;
        
        if (lsIdx < lessons.length - 1) {
            nextLesson = lessons[lsIdx + 1];
            nextChapter = ch;
        } else if (chIdx < chaptersSorted.length - 1) {
            const nextCh = chaptersSorted[chIdx + 1];
            const nextLessons = nextCh.lessons.slice().sort((a, b) => a.number - b.number);
            nextLesson = nextLessons[0];
            nextChapter = nextCh;
        }

        if (nextLesson) {
            const canAccessNext = canAccessLesson(nextLesson);
            if (!canAccessNext) {
                setShowLockModal(true);
                return;
            }
            
            navigate(`/${courseData.slug}/${nextChapter?.slug}/${nextLesson.number}`);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-4 text-lg font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    if (!canAccessCurrentLesson && lesson) {
        return (
            <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                    <div className="text-center max-w-md">
                        <AiOutlineLock className="text-6xl text-base-content/60 mx-auto mb-6" />
                        <h1 className="text-3xl font-bold mb-4">Lesson Locked</h1>
                        <p className="text-base-content/70 mb-8 text-lg">
                            {hasAccess 
                                ? "This lesson is not available yet." 
                                : "You need to purchase this course to access premium lessons."
                            }
                        </p>
                        <Link 
                            to={`/${courseSlug}`}
                            className="btn btn-primary btn-lg"
                        >
                            Back to Course
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
            <Navbar />
            
            {/* Mobile Header with Breadcrumbs */}
            <div className="mt-15 lg:hidden bg-base-200 border-b border-base-300 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                    <Link 
                        to={`/${courseSlug}`}
                        className="btn btn-ghost btn-sm"
                    >
                        ← Back to Course
                    </Link>
                </div>
                
                {/* Breadcrumbs */}
                <div className="breadcrumbs text-sm">
                    <ul className="flex flex-col sm:flex-row gap-1">
                        <li>
                            <Link to={`/${courseSlug}`} className="link link-hover text-primary">
                                {course?.title || 'Course'}
                            </Link>
                        </li>
                        <li>
                            <span className="text-base-content/70">
                                {chapter?.title || 'Chapter'}
                            </span>
                        </li>
                        <li>
                            <span className="text-base-content/70">
                                {lesson ? `${lesson.number}. ${lesson.title}` : 'Lesson'}
                            </span>
                        </li>
                    </ul>
                </div>
                    </div>

            <main className="flex-1 mt-15">
                {/* Desktop Breadcrumbs */}
                <div className="hidden lg:block border-b border-base-300 bg-base-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="breadcrumbs text-sm">
                                <ul>
                                    <li>
                                        <Link to={`/${courseSlug}`} className="link link-hover">
                                            {course?.title || 'Course'}
                                                                                </Link>
                                    </li>
                                    <li>
                                        <span className="text-base-content/70">
                                            {chapter?.title || 'Chapter'}
                                        </span>
                                                                        </li>
                                    <li>
                                        <span className="text-base-content/70">
                                            {lesson ? `${lesson.number}. ${lesson.title}` : 'Lesson'}
                                        </span>
                                        </li>
                                    </ul>
                                </div>
                            <Link
                                to={`/${courseSlug}`}
                                className="btn btn-outline btn-sm"
                            >
                                ← Back to Course
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">

                    {/* Content */}
                    <div className="flex-1 container mx-auto px-4 py-6">
                        {loading && (
                            <div className="flex justify-center items-center py-20">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-error mb-6">
                                <span>{error}</span>
                            </div>
                        )}

                        {lesson && (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="max-w-4xl mx-auto pb-20"
                            >
                                <div className="mb-8">
                                    <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-base-content">
                                        {lesson.number}. {lesson.title}
                                    </h1>
                                    
                                    {lesson.is_free_preview && (
                                        <div className="badge badge-success badge-lg mb-4">
                                            FREE PREVIEW
                                        </div>
                                    )}
                                </div>

                                <div className="prose prose-lg max-w-none">
                                    <div className="space-y-8">
                                        {lesson.blocks
                                            .sort((a, b) => a.order_index - b.order_index)
                                            .map((block) => (
                                                <motion.div
                                                    key={block.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.1 }}
                                                >
                                        {block.block_type === 'text' && block.text_markdown && (
                                                        <div className="prose prose-lg max-w-none text-base-content">
                                                            <ReactMarkdown
                                                                components={{
                                                                    h1: ({children}) => <h1 className="text-3xl font-bold mb-4 text-base-content">{children}</h1>,
                                                                    h2: ({children}) => <h2 className="text-2xl font-bold mb-3 text-base-content">{children}</h2>,
                                                                    h3: ({children}) => <h3 className="text-xl font-bold mb-2 text-base-content">{children}</h3>,
                                                                    h4: ({children}) => <h4 className="text-lg font-bold mb-2 text-base-content">{children}</h4>,
                                                                    h5: ({children}) => <h5 className="text-base font-bold mb-1 text-base-content">{children}</h5>,
                                                                    h6: ({children}) => <h6 className="text-sm font-bold mb-1 text-base-content">{children}</h6>,
                                                                    p: ({children}) => <p className="mb-4 text-base-content/80 leading-relaxed">{children}</p>,
                                                                    strong: ({children}) => <strong className="font-bold text-base-content">{children}</strong>,
                                                                    em: ({children}) => <em className="italic text-base-content/90">{children}</em>,
                                                                    ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                                                                    ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                                                                    li: ({children}) => <li className="text-base-content/80">{children}</li>,
                                                                    blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 italic text-base-content/70 mb-4 bg-base-200 p-4 rounded-r-lg">{children}</blockquote>,
                                                                    code: ({children}) => <code className="bg-base-200 px-2 py-1 rounded text-sm font-mono text-base-content">{children}</code>,
                                                                    pre: ({children}) => <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto mb-4 text-base-content">{children}</pre>
                                                                }}
                                                            >
                                                                {block.text_markdown}
                                                            </ReactMarkdown>
                                                        </div>
                                                    )}
                                                    
                                        {block.block_type === 'image' && block.image_urls && (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {block.image_urls.map((src, idx) => (
                                                    <div key={idx} className="relative">
                                                        <div className="skeleton w-full h-64 rounded-lg shadow-lg"></div>
                                                        <img 
                                                            src={src} 
                                                            alt="lesson"
                                                            className="w-full h-64 rounded-lg shadow-lg object-cover absolute inset-0 opacity-0 transition-opacity duration-300"
                                                            onLoad={(e) => {
                                                                e.currentTarget.style.opacity = '1';
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                                    
                                        {block.block_type === 'video' && block.video_url && (
                                                        <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                                                <iframe
                                                                className="w-full h-full"
                                                    src={getEmbedUrl(block.video_url)}
                                                    title="Lesson video"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                />
                                            </div>
                                        )}
                                                    
                                        {block.links && block.links.length > 0 && (
                                                        <div className="bg-base-200 rounded-lg p-4">
                                                            <h4 className="font-semibold mb-3">Useful Links:</h4>
                                                            <ul className="space-y-2">
                                                {block.links.map((l, i) => (
                                                                    <li key={i}>
                                                                        <a 
                                                                            className="link link-primary hover:link-primary/70" 
                                                                            href={l.url}
                                                                   target="_blank"
                                                                            rel="noreferrer"
                                                                        >
                                                                            {l.title || l.url}
                                                                        </a>
                                                                    </li>
                                                ))}
                                            </ul>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                    </div>
                                </div>

                                {/* Navigation */}
                                <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 py-2 px-4 z-50">
                                    <div className="flex flex-row gap-2 items-center justify-between max-w-4xl mx-auto min-h-[44px]">
                                        <button 
                                            onClick={goPrev}
                                            className="btn btn-outline btn-sm flex items-center gap-1 flex-1 min-h-[36px]"
                                        >
                                            <AiOutlineLeft />
                                            <span className="hidden sm:inline">Previous</span>
                                        </button>
                                        
                                        <button
                                            onClick={wasAlreadyCompleted ? undefined : handleCompleteLesson}
                                            disabled={wasAlreadyCompleted || isCompleting || isCompleted}
                                            className={`btn btn-sm flex items-center gap-1 flex-1 min-h-[36px] ${
                                                wasAlreadyCompleted
                                                    ? 'btn-success cursor-default'
                                                    : isCompleted 
                                                        ? 'btn-success' 
                                                        : 'btn-primary'
                                            }`}
                                        >
                                            {wasAlreadyCompleted ? (
                                                <>
                                                    <AiOutlineCheckCircle />
                                                    <span className="hidden sm:inline">Completed</span>
                                                </>
                                            ) : isCompleting ? (
                                                <>
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                    <span className="hidden sm:inline">Completing...</span>
                                                </>
                                            ) : isCompleted ? (
                                                <>
                                                    <AiOutlineCheckCircle />
                                                    <span className="hidden sm:inline">Completed!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <AiOutlineCheckCircle />
                                                    <span className="hidden sm:inline">Mark Complete</span>
                                                </>
                                            )}
                                        </button>
                                        
                                        <button 
                                            onClick={goNext}
                                            className="btn btn-outline btn-sm flex items-center gap-1 flex-1 min-h-[36px]"
                                        >
                                            <span className="hidden sm:inline">Next</span>
                                            <AiOutlineRight />
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        )}
                    </div>
                            </div>
            </main>

            {/* Lock Modal */}
            <AnimatePresence>
                {showLockModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowLockModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-base-100 rounded-lg p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <AiOutlineLock className="text-4xl text-warning mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Lesson Locked</h3>
                                <p className="text-base-content/70 mb-4">
                                Purchase the course to unlock all lessons and continue your learning journey.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowLockModal(false)}
                                        className="btn btn-ghost flex-1"
                                    >
                                        Stay Here
                                    </button>
                                    <Link
                                        to={`/${courseSlug}`}
                                        className="btn btn-primary flex-1"
                                    >
                                        Buy Course
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}