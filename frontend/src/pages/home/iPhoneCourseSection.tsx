import {motion} from "framer-motion";
import iphoneIMG from "../../assets/cameras/iphone.webp";
import {Link} from "react-router-dom";


export default function IPhoneCourseSection() {
    return (
        <>
            <section className="py-24 px-4 bg-dots bg-fixed bg-center bg-cover relative overflow-hidden">

                <div className="container flex flex-col justify-center items-center mx-auto max-w-7xl relative z-10">
                    {/* Header */}
                    <div className=" text-center mb-20 max-w-3xl">
                        <motion.h2
                            className="text-3xl md:text-4xl font-rama font-bold text-gray-100 mb-8"
                            initial={{opacity: 0, y: 40}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.8}}
                        >
                            iPhone Photography Course
                        </motion.h2>
                        <motion.p
                            className="text-sm md:text-base text-gray-300 max-w-5xl mx-auto leading-relaxed"
                            initial={{opacity: 0, y: 30}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.8, delay: 0.2}}
                        >
                            Learn everything from basic camera settings to advanced composition techniques and lighting
                            mastery.
                            Perfect for beginners and enthusiasts who want to capture
                            stunning photos that rival professional cameras.
                        </motion.p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left Side - Course Image */}
                        <motion.div
                            className="relative order-1 lg:order-1"
                            initial={{opacity: 0, x: -70}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{
                                delay: 0.4,
                                x: {type: "spring", stiffness: 60, damping: 20},
                                opacity: {duration: 1, ease: "easeOut"},
                            }}
                        >
                            <div className="relative">
                                <img
                                    src={iphoneIMG}
                                    alt="iPhone Camera Course"
                                    className="w-100 h-80 object-cover rounded-2xl shadow-2xl"
                                />
                                {/* Floating badge */}
                                <motion.div
                                    className="absolute -top-4 -right-4 glass-thick text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg"
                                    animate={{y: [0, -5, 0]}}
                                    transition={{duration: 2, repeat: Infinity}}
                                >
                                    FREE LESSONS
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right Side - Course Card */}
                        <motion.div
                            className="order-2 lg:order-2 glass-thick rounded-2xl "
                            initial={{opacity: 0, x: 70}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{
                                delay: 0.9,
                                x: {type: "spring", stiffness: 60, damping: 20},
                                opacity: {duration: 1, ease: "easeOut"},
                            }}
                        >
                            <div className="overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
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
                                            to="/iphone-camera-101"
                                            className="flex-1 bg-primary text-white py-4 px-6 rounded-xl font-rama font-bold text-center hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
                                        >
                                            Try For FREE
                                        </Link>
                                        <Link
                                            to="/iphone-camera-101"
                                            className="flex-1 glass-thin py-4 px-6 rounded-xl font-rama font-bold text-center bg-transparent hover:bg-primary hover:text-white transition-all duration-300 whitespace-nowrap"
                                        >
                                            View Curriculum
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    )
}