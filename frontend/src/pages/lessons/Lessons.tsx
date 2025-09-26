import { useState } from "react";
import Navbar from "../../components/Navbar.tsx";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth.tsx";
import { useCourse, type Course } from "../../hooks/useCourse";
import Footer from "../../components/Footer.tsx";
import { AiFillLock, AiOutlineEye, AiFillPlayCircle } from "react-icons/ai";

type CourseCardProps = {
    course: Course;
    isAuthenticated: boolean;
    hasAccess: boolean;
    onPurchase: (courseSlug: string) => void;
};

function CourseCard({ course, isAuthenticated, hasAccess, onPurchase }: CourseCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const totalLessons = course.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0);
    const freeLessons = course.chapters.reduce((acc, chapter) =>
        acc + chapter.lessons.filter(lesson => lesson.is_free_preview).length, 0
    );

    // Check if this is the DSLR course
    const isDSLRCourse = course.slug === 'dslr-101';

    return (
        <div className={`card bg-secondary shadow-2xl transition-all duration-300 ${isDSLRCourse ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-3xl transform hover:-translate-y-2'
            }`}>
            {/* Course Image */}
            <figure className="relative overflow-hidden">
                <img
                    src={course.image_url || "/placeholder-course.jpg"}
                    alt={course.title}
                    className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4">
                    {isDSLRCourse ? (
                        <div className="badge badge-primary badge-lg font-bold">
                            COMING SOON
                        </div>
                    ) : freeLessons > 0 ? (
                        <div className="badge badge-primary badge-lg font-bold">
                            {`${freeLessons} FREE`}
                        </div>
                    ) : null}
                </div>
            </figure>

            {/* Course Content */}
            <div className="card-body p-6">
                {/* Course Title & Description */}
                <div className="mb-4">
                    <h2 className="card-title text-2xl font-bold text-white mb-2">
                        {course.title}
                    </h2>
                    <p className="text-base-content/70 text-sm leading-relaxed">
                        {course.description_markdown?.replace(/[#*]/g, '').substring(0, 120) || 'Master the art of photography with this comprehensive course.'}
                        {course.description_markdown && course.description_markdown.length > 120 && '...'}
                    </p>
                </div>

                {/* Course Stats */}
                <div className="stats stats-horizontal shadow-sm mb-4">
                    <div className="stat py-2 px-3 text-center">
                        <div className="stat-title text-xs">Chapters</div>
                        <div className="stat-value text-lg text-gray-300">{course.chapters.length}</div>
                    </div>
                    <div className="stat py-2 px-3 text-center">
                        <div className="stat-title text-xs">Lessons</div>
                        <div className="stat-value text-lg text-white">{totalLessons}</div>
                    </div>
                    <div className="stat py-2 px-3 text-center">
                        <div className="stat-title text-xs">Free</div>
                        <div className="stat-value text-lg text-gray-300">{freeLessons}</div>
                    </div>
                </div>

                {/* Curriculum Toggle */}
                <div className="bg-gray-800 rounded-lg mb-4">
                    <button
                        className="w-full text-left p-4 flex items-center justify-between transition-colors rounded-lg hover:cursor-pointer"
                        onClick={() => !isDSLRCourse && setIsExpanded(!isExpanded)}
                        disabled={isDSLRCourse}
                    >
                        <div className="flex items-center gap-2">
                            <AiOutlineEye className="text-primary" />
                            <span className="text-lg font-semibold">View Curriculum</span>
                        </div>
                        <svg
                            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isExpanded && (
                        <div className="px-4 pb-4">
                            <div className="space-y-3">
                                {course.chapters
                                    .sort((a, b) => a.order_index - b.order_index)
                                    .map((chapter) => (
                                        <div key={chapter.id} className="border-l-4 border-primary pl-4">
                                            <h4 className="font-semibold text-primary mb-2">
                                                {chapter.title}
                                            </h4>
                                            <div className="space-y-1">
                                                {chapter.lessons
                                                    .sort((a, b) => a.number - b.number)
                                                    .map((lesson) => {
                                                        const isLocked = (!isAuthenticated && !lesson.is_free_preview) || (isAuthenticated && !hasAccess && !lesson.is_free_preview);
                                                        return (
                                                            <div
                                                                key={lesson.id}
                                                                className={`flex items-center gap-2 text-sm ${isLocked ? 'text-base-content/50' : 'text-base-content'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    {lesson.is_free_preview ? (
                                                                        <AiFillPlayCircle className="text-primary" />
                                                                    ) : isLocked ? (
                                                                        <AiFillLock className="text-base-content/50" />
                                                                    ) : (
                                                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                                    )}
                                                                    <span className="font-medium">
                                                                        {lesson.number}. {lesson.title}
                                                                    </span>
                                                                    {lesson.is_free_preview && (
                                                                        <span className="badge badge-success badge-xs">FREE</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="card-actions justify-end">
                    {isDSLRCourse ? (
                        <button
                            disabled
                            className="btn btn-disabled btn-lg w-full font-bold cursor-not-allowed"
                        >
                            Coming Soon
                        </button>
                    ) : isAuthenticated && hasAccess ? (
                        <Link
                            to={`/${course.slug}`}
                            className="btn btn-primary btn-lg w-full font-bold"
                        >
                            <AiFillPlayCircle className="text-lg" />
                            Start Learning
                        </Link>
          ) : isAuthenticated && !hasAccess ? (
            <div className="flex flex-col gap-2 w-full">
              <Link
                to={`/${course.slug}`}
                className="btn btn-primary btn-lg font-bold"
              >
                Try For FREE
              </Link>
              <button
                onClick={() => onPurchase(course.slug)}
                className="btn btn-outline btn-lg font-bold cursor-pointer"
              >
                Buy Course
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <Link
                to={`/${course.slug}`}
                className="btn btn-primary btn-lg font-bold"
              >
                Try For FREE
              </Link>
              <button
                onClick={() => window.location.href = '/login'}
                className="btn btn-outline btn-lg font-bold cursor-pointer"
              >
                Login to Buy
              </button>
            </div>
          )}
                </div>
            </div>
        </div>
    );
}

export default function Lessons() {
    const { isAuthenticated } = useAuth();
    const { 
        courses, 
        courseAccess, 
        handlePurchase, 
        loading, 
        loadingStates 
    } = useCourse();

    if (loading || loadingStates.courses) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
                <Navbar />

                {/* Courses Grid */}
                <section className="py-25 px-4">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4">Courses we offer</h2>
                            <p className="text-lg text-base-content/70">
                                Each course includes comprehensive curriculum with hands-on lessons
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
                            {courses
                                .sort((a, b) => {
                                    // Always put iPhone course first, then DSLR, then others alphabetically
                                    if (a.slug === 'iphone-camera-101') return -1;
                                    if (b.slug === 'iphone-camera-101') return 1;
                                    if (a.slug === 'dslr-101') return -1;
                                    if (b.slug === 'dslr-101') return 1;
                                    return a.title.localeCompare(b.title);
                                })
                                .map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        isAuthenticated={isAuthenticated}
                                        hasAccess={courseAccess[course.slug] || false}
                                        onPurchase={handlePurchase}
                                    />
                                ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}