import './App.css'
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { useAuth } from "./hooks/UseAuth.tsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AiFillPlayCircle, AiOutlineCamera } from "react-icons/ai";
import { BsClock } from "react-icons/bs";
import bgImageDesktop from './assets/images/bg2.webp';
import bgImageMobile from './assets/images/bg3.webp';
import dslrImage from './assets/cameras/dslr.jpg';
import iPhoneSimMobile from './assets/images/iphone-sim-mobile.png'
import iPhoneSimDesktop from './assets/images/iphone-sim-desktop.png'
import iphoneIMG from './assets/cameras/iphone.webp'
import { motion } from "framer-motion";
import { useCourse } from './hooks/useCourse.tsx';
import ScrollAnimation from './components/ScrollAnimation.tsx';
import RollingNumber from './components/RollingNumber.tsx';

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
};
const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};


function App() {
    const { isAuthenticated, initialLoading } = useAuth();
    const {
        courses,
        courseAccess,
        lastCompletedLessonPath,
        handlePurchase,
        loading
    } = useCourse();
    const [showExpiredMessage, setShowExpiredMessage] = useState(false);

    // Listen for token expiration
    useEffect(() => {
        const handleTokenExpired = () => {
            setShowExpiredMessage(true);
            // Hide message after 5 seconds
            setTimeout(() => setShowExpiredMessage(false), 5000);
        };

        window.addEventListener('auth:token-expired', handleTokenExpired);
        return () => window.removeEventListener('auth:token-expired', handleTokenExpired);
    }, []);

    // Loading animation component
    const LoadingAnimation = () => (
        <motion.div
            className="flex justify-center items-center min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="flex flex-col items-center space-y-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <motion.div
                    className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.p
                    className="text-xl font-bold text-primary"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    Loading Content...
                </motion.p>
            </motion.div>
        </motion.div>
    );


    if (initialLoading || loading) {
        return <LoadingAnimation />;
    }

    return (
        <div className="bg-black flex flex-col min-h-screen">
            <Navbar />

            {/* Token Expiration Notification */}
            {showExpiredMessage && (
                <motion.div
                    className="bg-red-500 text-white px-4 py-3 text-center"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                >
                    <p className="font-bold">Your session has expired. Please log in again.</p>
                </motion.div>
            )}

            {/* Hero Section - Camera Learning Focus */}
            <main className="relative w-full h-screen overflow-hidden">
                {/* Background Image - Mobile */}
                <div
                    className="absolute inset-0 w-full h-full md:hidden"
                    style={{
                        backgroundImage: `url(${bgImageMobile})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                ></div>

                {/* Background Image - Desktop */}
                <div
                    className="absolute inset-0 w-full h-full hidden md:block"
                    style={{
                        backgroundImage: `url(${bgImageDesktop})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                ></div>

                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Hero Content */}
                <motion.div
                    className="relative z-10 flex flex-col justify-center items-center h-full px-4"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {isAuthenticated ? (
                        <motion.div className="text-center max-w-4xl" variants={fadeInUp}>
                            {/* Welcome back message */}
                            <div className="mb-8">
                                <motion.h1
                                    className="text-white font-rama font-bold text-4xl md:text-6xl mb-4"
                                    style={{ textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.4)' }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Welcome Back! 👋
                                </motion.h1>
                                <motion.p
                                    className="text-white/90 text-xl md:text-2xl"
                                    style={{ textShadow: '0 0 15px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6)' }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    Ready to capture your next masterpiece?
                                </motion.p>
                            </div>

                            {/* Action buttons */}
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                {lastCompletedLessonPath ? (
                                    <>
                                        <Link to={lastCompletedLessonPath}>
                                            <motion.button
                                                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg drop-shadow-lg"
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                📸 Continue Learning
                                            </motion.button>
                                        </Link>
                                        <Link to="/learn">
                                            <motion.button
                                                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 drop-shadow-lg"
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                🎯 Explore Courses
                                            </motion.button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/learn">
                                            <motion.button
                                                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg drop-shadow-lg"
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                📚 Start Learning
                                            </motion.button>
                                        </Link>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div className="text-center max-w-5xl" variants={fadeInUp}>
                            {/* Main headline */}
                            <div className="mb-12">
                                <motion.h1
                                    className="text-white font-rama text-5xl md:text-7xl mb-50 leading-tight"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                >
                                    CAMERAS MADE SIMPLE
                                </motion.h1>
                            </div>


                            {/* Call to action button */}
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <Link to="/learn">
                                    <motion.button
                                        className="bg-gradient-to-r from-primary to-secondary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl drop-shadow-lg"
                                        whileHover={{ scale: 1.05, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Start Learning for Free
                                    </motion.button>
                                </Link>

                            </motion.div>


                        </motion.div>
                    )}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    <motion.div
                        className="flex flex-col items-center"
                        style={{ textShadow: '0 0 10px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)' }}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <span className="text-sm mb-2 text-white">Scroll to explore</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.div>
                </motion.div>
            </main>

            {/* iPhone Course Section */}
            <section className="py-24 px-4 bg-gradient-to-b from-black to-secondary relative overflow-hidden">


                <div className="container flex flex-col justify-center items-center mx-auto max-w-7xl relative z-10">
                    {/* Header */}
                    <div className=" text-center mb-20 max-w-3xl">
                        <motion.h2
                            className="text-3xl md:text-4xl font-rama font-bold text-gray-100 mb-8"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            iPhone Photography Course
                        </motion.h2>
                        <motion.p
                            className="text-sm md:text-base text-gray-300 max-w-5xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Learn everything from basic camera settings to advanced composition techniques and lighting mastery. 
                            Perfect for beginners and enthusiasts who want to capture
                            stunning photos that rival professional cameras.
                        </motion.p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left Side - Course Image */}
                        <motion.div
                            className="relative order-1 lg:order-1"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="relative">
                                <img
                                    src={courses.find(course => course.slug === 'iphone-camera-101')?.image_url || iphoneIMG}
                                    alt="iPhone Camera Course"
                                    className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                                />
                                {/* Floating badge */}
                                <motion.div
                                    className="absolute -top-4 -right-4 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg"
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    FREE LESSONS
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right Side - Course Card */}
                        <motion.div
                            className="order-2 lg:order-2"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="bg-black border border-gray-700 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
                                <div className="p-8">
                                    <h3 className="text-3xl font-rama font-bold text-white mb-6">
                                        iPhone Camera 101
                                    </h3>

                                    {/* Course Features with Simple Green Ticks */}
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-green-400 text-xl font-bold">✓</span>
                                            <span className="text-gray-200 font-medium text-lg">How the iPhone camera works</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-green-400 text-xl font-bold">✓</span>
                                            <span className="text-gray-200 font-medium text-lg">Creative control settings</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-green-400 text-xl font-bold">✓</span>
                                            <span className="text-gray-200 font-medium text-lg">Shooting in different lighting</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-green-400 text-xl font-bold">✓</span>
                                            <span className="text-gray-200 font-medium text-lg">Professional mobile editing</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link
                                            to="/learn"
                                            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 rounded-xl font-rama font-bold text-center hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            Try For FREE
                                        </Link>
                                        <Link
                                            to="/simulators/iphone"
                                            className="flex-1 border-2 border-primary text-primary py-4 px-6 rounded-xl font-rama font-bold text-center bg-transparent hover:bg-primary hover:text-white transition-all duration-300"
                                        >
                                            Try Simulator
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Master Photography - Rolling Numbers Effect */}
            <ScrollAnimation className="py-20 px-4 bg-gradient-to-b from-secondary to-base-300">
                <div className="container mx-auto max-w-6xl">
                    <ScrollAnimation className="text-center mb-16" delay={0.1}>
                        <h2 className="text-5xl font-rama text-gray-100 mb-6 drop-shadow-sm">
                            Master Photography
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Learn professional photography techniques with our comprehensive courses.
                            Start with free lessons and upgrade when you're ready.
                        </p>
                    </ScrollAnimation>

                    {/* Rolling Numbers Stats Grid */}
                    <ScrollAnimation className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16" delay={0.2}>
                        <motion.div
                            className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                            whileHover={{ scale: 1.05, y: -5 }}
                        >
                            <RollingNumber
                                value={courses.length}
                                className="text-4xl font-bold text-primary mb-2"
                            />
                            <div className="text-gray-600">Professional Courses</div>
                        </motion.div>
                        <motion.div
                            className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                            whileHover={{ scale: 1.05, y: -5 }}
                        >
                            <RollingNumber
                                value={courses.reduce((acc, course) => acc + course.chapters.length, 0)}
                                className="text-4xl font-bold text-accent mb-2"
                            />
                            <div className="text-gray-600">Course Chapters</div>
                        </motion.div>
                        <motion.div
                            className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                            whileHover={{ scale: 1.05, y: -5 }}
                        >
                            <RollingNumber
                                value={courses.reduce((acc, course) =>
                                    acc + course.chapters.reduce((chAcc, chapter) => chAcc + chapter.lessons.length, 0), 0
                                )}
                                className="text-4xl font-bold text-primary mb-2"
                            />
                            <div className="text-gray-600">Total Lessons</div>
                        </motion.div>
                        <motion.div
                            className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                            whileHover={{ scale: 1.05, y: -5 }}
                        >
                            <RollingNumber
                                value={courses.reduce((acc, course) =>
                                    acc + course.chapters.reduce((chAcc, chapter) =>
                                        chAcc + chapter.lessons.filter(lesson => lesson.is_free_preview).length, 0
                                    ), 0
                                )}
                                className="text-4xl font-bold text-secondary mb-2"
                            />
                            <div className="text-gray-600">Free Lesson</div>
                        </motion.div>
                    </ScrollAnimation>
                </div>
            </ScrollAnimation>

            {/* Simulator Section */}
            <section className="py-16 md:py-24 px-4 bg-base-300 ">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Content */}
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-rama font-bold text-gray-100 mb-6">
                                Check out our iPhone Simulator!
                            </h2>
                            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                                Can't take pictures now? Try our iPhone Simulator and practice your photography skills anywhere!
                            </p>
                            <div className="flex justify-center lg:justify-start">
                                <Link
                                    to="/simulators/iphone"
                                    className="inline-flex items-center bg-gradient-to-r from-primary to-secondary text-white py-4 px-8 rounded-lg font-bold text-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Try Simulator for Free
                                </Link>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="relative">
                            <div className="hidden md:block">
                                <img
                                    src={iPhoneSimDesktop}
                                    alt="iPhone Simulator Desktop Preview"
                                    className="w-full h-auto object-cover rounded-xl shadow-2xl"
                                />
                            </div>
                            <div className="block md:hidden">
                                <img
                                    src={iPhoneSimMobile}
                                    alt="iPhone Simulator Mobile Preview"
                                    className="w-full h-auto object-cover rounded-xl shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Courses Section */}
            <ScrollAnimation className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <ScrollAnimation className="text-center mb-16" delay={0.1}>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6 drop-shadow-sm">
                            Featured Courses
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Start with a free lesson, master at your own pace, and unlock professional photography skills.
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
                                <div key={course.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="relative">
                                        <img
                                            src={course.image_url}
                                            alt={course.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-bold">
                                                {course.chapters.reduce((acc, chapter) =>
                                                    acc + chapter.lessons.filter(lesson => lesson.is_free_preview).length, 0
                                                ) > 0 ? 'FREE LESSONS' : 'PREMIUM'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {course.description_markdown?.replace(/[#*]/g, '').substring(0, 120) || 'Master the art of photography with this comprehensive course.'}
                                            {course.description_markdown && course.description_markdown.length > 120 && '...'}
                                        </p>

                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex space-x-4 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <AiOutlineCamera className="mr-2" />
                                                    {course.chapters.length} Chapters
                                                </span>
                                                <span className="flex items-center">
                                                    <AiFillPlayCircle className="mr-2" />
                                                    {course.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0)} Lessons
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            {isAuthenticated && courseAccess[course.slug] ? (
                                                <Link
                                                    to={`/${course.slug}`}
                                                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-bold text-center hover:bg-primary/90 transition-colors"
                                                >
                                                    <AiFillPlayCircle className="inline mr-2" />
                                                    Go to Course
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link
                                                        to={`/${course.slug}`}
                                                        className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-bold text-center hover:bg-primary/90 transition-colors"
                                                    >
                                                        Try For FREE
                                                    </Link>
                                                    <button
                                                        onClick={() => handlePurchase(course.slug)}
                                                        className="flex-1 border border-primary text-primary py-3 px-6 rounded-lg font-bold text-center bg-primary/5 hover:bg-primary hover:text-white transition-colors cursor-pointer"
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
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg relative">
                                <div className="relative">
                                    <img
                                        src={dslrImage}
                                        alt="DSLR Photography Course"
                                        className="w-full h-48 object-cover opacity-60"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <BsClock className="text-4xl mx-auto mb-2" />
                                            <span className="text-lg font-bold">Coming Soon</span>
                                        </div>
                                    </div>

                                </div>

                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        DSLR 101
                                    </h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed">
                                        Master professional DSLR techniques and unlock the full potential of your camera.
                                        Advanced lighting, composition, and post-processing techniques.
                                    </p>

                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex space-x-4 text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <AiOutlineCamera className="mr-2" />
                                                6 Chapters
                                            </span>
                                            <span className="flex items-center">
                                                <AiFillPlayCircle className="mr-2" />
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
                    )}
                </div>
            </ScrollAnimation>


            <Footer />
        </div>
    )
}

export default App