import ScrollAnimation from "../../components/ScrollAnimation.tsx";
import {motion} from "framer-motion";
import RollingNumber from "../../components/RollingNumber.tsx";


export default function StatsSection({ courses } : {courses: any}) {
    return (
        <>
            <ScrollAnimation className="py-20 px-4 bg-base-300">
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
                            whileHover={{scale: 1.05, y: -5}}
                        >
                            <RollingNumber
                                value={courses.length}
                                className="text-4xl font-bold text-primary mb-2"
                            />
                            <div className="text-gray-600">Professional Courses</div>
                        </motion.div>
                        <motion.div
                            className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                            whileHover={{scale: 1.05, y: -5}}
                        >
                            <RollingNumber
                                value={courses.reduce((acc: any, course: { chapters: string | any[]; }) => acc + course.chapters.length, 0)}
                                className="text-4xl font-bold text-accent mb-2"
                            />
                            <div className="text-gray-600">Course Chapters</div>
                        </motion.div>
                        <motion.div
                            className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                            whileHover={{scale: 1.05, y: -5}}
                        >
                            <RollingNumber
                                value={courses.reduce((acc: any, course: { chapters: any[]; }) =>
                                    acc + course.chapters.reduce((chAcc, chapter) => chAcc + chapter.lessons.length, 0), 0
                                )}
                                className="text-4xl font-bold text-primary mb-2"
                            />
                            <div className="text-gray-600">Total Lessons</div>
                        </motion.div>
                        <motion.div
                            className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                            whileHover={{scale: 1.05, y: -5}}
                        >
                            <RollingNumber
                                value={courses.reduce((acc: any, course: { chapters: any[]; }) =>
                                        acc + course.chapters.reduce((chAcc, chapter) =>
                                            chAcc + chapter.lessons.filter((lesson: { is_free_preview: any; }) => lesson.is_free_preview).length, 0
                                        ), 0
                                )}
                                className="text-4xl font-bold text-secondary mb-2"
                            />
                            <div className="text-gray-600">Free Lesson</div>
                        </motion.div>
                    </ScrollAnimation>
                </div>
            </ScrollAnimation>
        </>
    )
}