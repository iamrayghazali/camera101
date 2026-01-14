import {motion} from "framer-motion";
import type { Variants } from "framer-motion";
import {Link} from "react-router-dom";
import {useAuth} from "../../hooks/UseAuth.tsx";
import {useCourse} from "../../hooks/useCourse.tsx";

const fadeInUp: Variants = {
    initial: { opacity: 0, y: 60 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1] as any
        }
    }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function HeroSection() {
    const { isAuthenticated } = useAuth();
    const { lastCompletedLessonPath } = useCourse();

    return (
        <>
            <main className="relative w-full h-screen overflow-hidden gradient">
                {/* Background Image - Mobile */}
                <div
                    className="absolute inset-0 w-full h-full md:hidden bg-wave"

                ></div>

                {/* Background Image - Desktop */}
                <div
                    className="absolute inset-0 w-full h-full hidden md:block bg-wave"

                ></div>

                <div className="absolute inset-0 opacity-50 gradient"></div>

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
                            <div className="mb-12">
                                <motion.h1
                                    className="text-white font-baby font-bold text-4xl md:text-6xl mb-4"
                                    style={{ textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.4)' }}
                                    initial={{ opacity: 0, y: 80 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    Welcome Back! 👋
                                </motion.h1>
                                <motion.p
                                    className="text-white/70 text-xl md:text-2xl"
                                    style={{ textShadow: '0 0 15px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6)' }}
                                    initial={{ opacity: 0, y: 80 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
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
                                                className="glass-thick text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg drop-shadow-lg cursor-pointer"
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Continue Learning
                                            </motion.button>
                                        </Link>
                                        <Link to="/learn">
                                            <motion.button
                                                className="glass-thin text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 drop-shadow-lg  cursor-pointer"
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Explore Courses
                                            </motion.button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/learn">
                                            <motion.button
                                                className="glass-thick text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg drop-shadow-lg cursor-pointer"
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Start Learning
                                            </motion.button>
                                        </Link>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div className="text-center max-w-5xl" variants={fadeInUp}>
                            {/* Main headline */}
                            <div className="mb-24">
                                <motion.div
                                    className=" bg-gradient-to-r from-gray-200 to-gray-400  bg-clip-text text-transparent font-baby text-5xl md:text-7xl leading-tight"
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    Cameras Made <motion.div className="text-white font-baby text-6xl md:text-8xl">Simple</motion.div>
                                </motion.div>
                            </div>


                            {/* Call to action button */}
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center cursor-pointer"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                            >
                                <Link to="/learn">
                                    <motion.button
                                        className="glass-thin hover:bg-white/90 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl drop-shadow-lg"
                                        whileTap={{ scale: 0.90 }}
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
                    transition={{ duration: 1, delay: 1.5 }}
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

        </>
    )
}