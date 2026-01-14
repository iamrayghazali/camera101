import ScrollAnimation from "../../components/ScrollAnimation.tsx";
import {AiFillPlayCircle, AiOutlineCamera} from "react-icons/ai";
import {Link} from "react-router-dom";
import dslrImage from "../../assets/cameras/dslr.jpg";
import {BsClock} from "react-icons/bs";
import {useAuth} from "../../hooks/UseAuth.tsx";
import type {Course, UseCourseReturn} from "../../hooks/useCourse.tsx";


interface FeaturedCoursesSectionProps {
    courses: Course[];
    courseAccess: UseCourseReturn["courseAccess"]; // grabs the same type from your hook
    handlePurchase: UseCourseReturn["handlePurchase"];
    loading: boolean;
}

export default function FeaturedCoursesSection({courses, courseAccess, handlePurchase, loading}: FeaturedCoursesSectionProps) {
    const { isAuthenticated } = useAuth();

    return (
        <ScrollAnimation className="py-20 px-4 bg-lines">
            <div className="container mx-auto max-w-6xl">
                <ScrollAnimation className="text-center mb-16" delay={0.1}>
                    <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-sm">
                        Featured Courses
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Start with a free lesson, master at your own pace, and unlock professional photography
                        skills.
                    </p>
                </ScrollAnimation>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="loading loading-spinner loading-lg text-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {/* Available iPhone Course */}
                        {courses.filter(course => course.slug !== 'dslr-101').map((course) => (
                            <div key={course.id}
                                 className="glass-thick rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="relative">
                                    <img
                                        src={course.image_url}
                                        alt={course.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-4 right-4">
                                            <span
                                                className="glass-thick text-black px-3 py-1 rounded-lg text-sm font-bold">
                                                {course.chapters.reduce((acc, chapter) =>
                                                    acc + chapter.lessons.filter(lesson => lesson.is_free_preview).length, 0
                                                ) > 0 ? 'FREE LESSONS' : 'PREMIUM'}
                                            </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        {course.title}
                                    </h3>
                                    <p className="text-gray-300 mb-4 leading-relaxed">
                                        {course.description_markdown?.replace(/[#*]/g, '').substring(0, 120) || 'Master the art of photography with this comprehensive course.'}
                                        {course.description_markdown && course.description_markdown.length > 120 && '...'}
                                    </p>

                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex space-x-4 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <AiOutlineCamera className="mr-2"/>
                                                    {course.chapters.length} Chapters
                                                </span>
                                            <span className="flex items-center">
                                                    <AiFillPlayCircle className="mr-2"/>
                                                {course.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0)} Lessons
                                                </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        {isAuthenticated && courseAccess[course.slug] ? (
                                            <Link
                                                to={`/${course.slug}`}
                                                className="flex-1 glass-thick text-white py-3 px-6 rounded-lg font-bold text-center  cursor-pointer"
                                            >
                                                <AiFillPlayCircle className="inline mr-2"/>
                                                Go to Course
                                            </Link>
                                        ) : (
                                            <>
                                                <Link
                                                    to={`/${course.slug}`}
                                                    className="flex-1 glass-thick text-white py-3 px-6 rounded-lg font-bold text-center  cursor-pointer"
                                                >
                                                    Try For FREE
                                                </Link>
                                                <button
                                                    onClick={() => handlePurchase(course.slug)}
                                                    className="flex-1 glass-thin text-white py-3 px-6 rounded-lg font-bold text-center cursor-pointer"
                                                >
                                                    Buy Course
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* DSLR Course - Coming Soon */}
                        <div className="bg-white opactity-10 rounded-2xl">
                            <div className="glass-thin rounded-xl overflow-hidden shadow-lg relative">
                                <div className="relative">
                                    <img
                                        src={dslrImage}
                                        alt="DSLR Photography Course"
                                        className="w-full h-48 object-cover opacity-60"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <BsClock className="text-4xl mx-auto mb-2"/>
                                            <span className="text-lg font-bold">Coming Soon</span>
                                        </div>
                                    </div>

                                </div>

                                <div className="p-6 bg-gray-950">
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        DSLR 101
                                    </h3>
                                    <p className="text-gray-300 mb-4 leading-relaxed">
                                        Master professional DSLR techniques and unlock the full potential of your
                                        camera.
                                        Advanced lighting, composition, and post-processing techniques.
                                    </p>

                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex space-x-4 text-sm text-gray-400">
                                            <span className="flex items-center">
                                                <AiOutlineCamera className="mr-2"/>
                                                6 Chapters
                                            </span>
                                            <span className="flex items-center">
                                                <AiFillPlayCircle className="mr-2"/>
                                                25 Lessons
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <button
                                            disabled
                                            className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg font-bold text-center cursor-not-allowed opacity-60"
                                        >
                                            Coming Soon
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </ScrollAnimation>
    )
}