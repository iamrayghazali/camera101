import './App.css'
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import {useAuth} from "./hooks/UseAuth.tsx";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {useCourse} from './hooks/useCourse.tsx';
import HeroSection from "./pages/home/HeroSection.tsx";
import IPhoneCourseSection from "./pages/home/iPhoneCourseSection.tsx";
import StatsSection from "./pages/home/StatsSection.tsx";
import SimulatorSection from "./pages/home/SimulatorSection.tsx";
import FeaturedCoursesSection from "./pages/home/FeaturedCoursesSection.tsx";


function App() {
    const {initialLoading} = useAuth();
    const {
        courses,
        courseAccess,
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
            className="flex justify-center items-center min-h-screen bg-black"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <motion.div
                className="flex flex-col items-center space-y-4"
                animate={{scale: [1, 1.1, 1]}}
                transition={{duration: 2, repeat: Infinity}}
            >
                <motion.div
                    className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full"
                    animate={{rotate: 360}}
                    transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                />
            </motion.div>
        </motion.div>
    );


    if (initialLoading || loading) {
        return <LoadingAnimation/>;
    }

    return (
        <div className="bg-black flex flex-col min-h-screen">
            <Navbar/>

            {/* Token Expiration Notification */}
            {showExpiredMessage && (
                <motion.div
                    className="mt-18 bg-red-500 text-white px-4 py-3 text-center"
                    initial={{opacity: 0, y: -50}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -50}}
                >
                    <p className="font-bold">Your session has expired. Please log in again.</p>
                </motion.div>
            )}

            {/* Hero Section - Camera Learning Focus */}
            <HeroSection/>

            {/* iPhone Course Section */}
            <IPhoneCourseSection />

            {/* STATS - Master Photography - Rolling Numbers Effect */}
            <StatsSection courses={courses}/>

            {/* Simulator Section */}
            <SimulatorSection />

            {/* Featured Courses Section */}
            <FeaturedCoursesSection courseAccess={courseAccess} courses={courses} handlePurchase={handlePurchase} loading={loading} />

            <Footer/>
        </div>
    )
}

export default App