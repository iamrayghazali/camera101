import Navbar from "../../../components/Navbar";
import { iPhoneCourse } from "../../../data/iPhoneCourse";
import {AiFillCaretDown, AiFillCaretUp, AiFillLock} from "react-icons/ai";
import {useEffect, useState} from "react";
import roman from "roman-numerals";
import {Link} from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs.tsx";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";

export default function IPhoneLessons() {

    //TODO Change to useAuth
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [lessonsToggled, setLessonsToggled] = useState(true);
    const courseIndex = 0;
    const [chapterIndex, setChapterIndex] = useState(0);
    const [lessonIndex, setLessonIndex] = useState(0);
    const currentChapter = iPhoneCourse.chapters[chapterIndex];
    const currentLesson = currentChapter.lessons[lessonIndex];
    const [userCompletedLessons, setUserCompletedLessons] = useState(true);
    const [isLastChapter, setIsLastChapter] = useState(false);
    const [isLastLesson, setIsLastLesson] = useState(false);

    useEffect(() => {
        checkIfUserCompletedLesson();
        setIsLastChapter(chapterIndex === iPhoneCourse.chapters.length - 1);
        setIsLastLesson(lessonIndex === currentChapter.lessons.length - 1);
        console.log("chapterIndex", chapterIndex)
        console.log("lessonIndex", lessonIndex)
    }, [chapterIndex, lessonIndex])

    function checkIfUserPaid() {
        //TODO
    }

    function checkIfUserCompletedLesson () {
        //TODO
    }

    function nextLesson() {
        if (lessonIndex < currentChapter.lessons.length - 1) {
            setLessonIndex(lessonIndex + 1);
        } else if (chapterIndex < iPhoneCourse.chapters.length - 1) {
            setChapterIndex(chapterIndex + 1);
            setLessonIndex(0);
        }
    }

    function prevLesson() {
        if (lessonIndex > 0) {
            setLessonIndex(lessonIndex - 1);
        } else if (chapterIndex > 0) {
            setChapterIndex(chapterIndex - 1);
            setLessonIndex(iPhoneCourse.chapters[chapterIndex - 1].lessons.length - 1);
        }
    }

    return (
        <>
            <Navbar />

            <section className="min-h-screen bg-base-300 mt-15">
                {/*MENU*/}
                <div className="h-12 min-w-full bg-base-300 flex flex-wrap flex-justify-center items-center ">
                    <Breadcrumbs courseIndex={courseIndex} chapterIndex={chapterIndex} lessonIndex={lessonIndex} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr]">
                    <div className="flex justify-center items-center flex-col md:flex-none md:justify-start md:items-start">
                        {/*MENU-LESSONS*/}
                        <div className="w-82">
                            <a className="w-80 font-bold py-4  rounded-lg bg-base-300 flex justify-center items-center gap-1 text-white"
                               onClick={() => setLessonsToggled(!lessonsToggled)} >
                                <p className="text-lg">Lessons</p>
                                { lessonsToggled ? (<AiFillCaretDown className="text-xl"/>) : (<AiFillCaretUp className="text-xl"/>)}
                            </a>
                            {
                                lessonsToggled ? (
                                    <ul className="flex-none menu bg-base-300 rounded-box w-80 top-0">
                                        <li>
                                            {iPhoneCourse.chapters.map((chapter, i) => (
                                                <details  key={chapter.id}>
                                                    <summary>{roman.toRoman(i + 1)}. {chapter.title}</summary>
                                                    <ul>
                                                        {chapter.lessons.map((lesson, j) => {
                                                            const isFirstLesson = i === 0 && j === 0;

                                                            const isLocked = !isAuthenticated && !isFirstLesson;

                                                            const classes = isLocked
                                                                ? "text-gray-400 cursor-not-allowed"
                                                                : "text-white cursor-pointer";

                                                            const content = isLocked
                                                                ? (<><AiFillLock className="text-xs" /> {lesson.title}</>)
                                                                : lesson.title;

                                                            return (
                                                                <li key={lesson.id}>
                                                                    {isLocked ? (
                                                                        <summary className={classes}>{content}</summary>
                                                                    ) : (
                                                                        <Link to="/learn/iphone" className={classes}>{content}</Link>
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </details>
                                            ))}
                                        </li>
                                    </ul>
                                ) : null
                            }
                        </div>
                    </div>

                    {/* LESSONS */}
                    <main className="mb-30 flex-1 pt-0 overflow-y-auto ">
                        <progress
                            className="progress progress-primary w-full sticky top-0 z-50"
                            value={(lessonIndex + 1) * 100 / currentChapter.lessons.length}
                            max="100"
                        ></progress>

                        <h1 className="text-2xl font-bold mb-4">{currentLesson.title}</h1>

                        {Object.entries(currentLesson.content).map(([key, value], idx) => {
                            // all text keys
                            if (key.startsWith("text")) {
                                return <p key={idx} className="mb-4">{value as string}</p>;
                            }

                            // images can be a single image or an array
                            if (key === "images" || key.startsWith("image")) {
                                const imgs = Array.isArray(value) ? value : [value];
                                return (
                                    <div key={idx} className="flex justify-center items-center flex-wrap gap-4 my-4">
                                        {imgs.map((img, i) => (
                                            <div key={`${idx}-${i}`} className="relative h-32 w-32">
                                                <img
                                                    src={img}
                                                    className="rounded-lg h-full w-full object-cover"
                                                    alt=""
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                );
                            }

                            // videos
                            if (key.startsWith("video")) {
                                return (
                                    <iframe
                                        key={idx}
                                        src={value as string}
                                        className="w-full h-64 my-4 rounded-lg"
                                        allowFullScreen
                                    />
                                );
                            }

                            // links (all displayed together at the end of content)
                            if (key === "links" && Array.isArray(value)) {
                                return (
                                    <ul key={idx} className="mb-4 list-disc list-inside">
                                        {value.map((link, i) => (
                                            <li key={i}>
                                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                    {link.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                );
                            }

                            return null;
                        })}
                    </main>
                </div>


                {/* DOCK */}
                <div className="dock dock-md bottom-[-4px] py-0">

                {/* PREVIOUS BUTTON*/}
                    <div className="tooltip" data-tip={
                        chapterIndex === 0 && lessonIndex === 0
                            ? ""
                            : lessonIndex === 0
                                ? "Previous Chapter"
                                : "Previous Lesson"
                    }>
                        <button onClick={() => prevLesson()}
                                className="flex flex-row justify-center items-center cursor-pointer"
                                disabled={chapterIndex === 0 && lessonIndex === 0}>
                            <span className="md:hidden flex items-center gap-2">
                                {chapterIndex === 0 && lessonIndex === 0 ? null : <FiChevronLeft className="text-xl" />}
                                {chapterIndex !== 0 && lessonIndex === 0
                                    ? "Previous Chapter"
                                        : ""}
                            </span>

                            {/* Desktop */}
                            <span className="hidden md:flex whitespace-nowrap items-center gap-2">
                                {chapterIndex === 0 && lessonIndex === 0 ? null : <FiChevronLeft className="text-xl" />}
                                {chapterIndex === 0 && lessonIndex === 0
                                    ? ""
                                    : chapterIndex !== 0 && lessonIndex === 0
                                        ? "Previous Chapter"
                                        : "Previous Lesson"
                                }
                            </span>
                        </button>
                    </div>

                    <div className="tooltip bg-primary max-h-full text-black font-bold" data-tip="Complete Lesson">
                        <button className={` dock-inactive flex flex-col justify-center items-center  ${userCompletedLessons ? "bg-primary cursor-pointer" : "bg-base-300 cursor-not-allowed"}`}>
                            <FiCheck className="text-xl"/>
                            <p className="text-sm">Complete Lesson</p>
                        </button>
                    </div>
                {/* NEXT BUTTON*/}

                    <div
                        className="tooltip"
                        data-tip={
                            isLastChapter && isLastLesson
                                ? ""
                                : isLastLesson
                                    ? "Next Chapter"
                                    : "Next Lesson"
                        }
                    >
                        <button
                            onClick={() => nextLesson()}
                            className={`flex flex-row justify-center items-center cursor-pointer`}
                            disabled={isLastChapter && isLastLesson}>
                            {/* Mobile */}
                            <span className="md:hidden flex items-center gap-2">
                                {isLastChapter && isLastLesson
                                    ? ""
                                    : isLastLesson
                                        ? "Next Chapter"
                                        : ""}
                                {!isLastChapter || !isLastLesson ? (<FiChevronRight className="text-xl" />) : null}
                            </span>

                            {/* Desktop */}
                            <span className="hidden md:flex items-center gap-2">
                                {isLastChapter && isLastLesson
                                    ? ""
                                    : isLastLesson
                                        ? "Next Chapter"
                                        : "Next Lesson"}
                                {!isLastChapter || !isLastLesson ? (<FiChevronRight className="text-xl" />) : null}
                            </span>
                        </button>
                    </div>

                </div>
            </section>
        </>
    );
}