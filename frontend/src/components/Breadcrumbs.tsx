import { iPhoneCourse } from "../data/iPhoneCourse";
import {useEffect, useState} from "react";
import { IoMdCamera } from "react-icons/io";
import { AiFillRead } from "react-icons/ai";
import { IoNewspaperSharp } from "react-icons/io5";

type BreadcrumbsProps = {
    courseIndex: number,
    chapterIndex: number,
    lessonIndex: number
}

export default function Breadcrumbs({courseIndex, chapterIndex, lessonIndex} :BreadcrumbsProps ) {
    const [courseName, setCourseName] = useState("");
    const [chapterName, setChapterName] = useState("");
    const [lessonName, setLessonName] = useState("");

    const findCourseName = () : void => {
        if (courseIndex === 0) {
            setCourseName("iPhone");
        } else if (courseIndex === 1) {
            setCourseName("Mirrorless");
        } else if (courseIndex === 2) {
            setCourseName("DSLR");
        } else {
            setCourseName("----??");
        }
    }

    const findChapterName = () => {
        const obj = iPhoneCourse.chapters.find(chapter => parseInt(chapter.id) - 1 === chapterIndex);
        const name = obj.title;
        setChapterName(name);
    }

    const findLessonName = () => {
        const chapter = iPhoneCourse.chapters.find(
            ch => parseInt(ch.id) - 1 === chapterIndex
        );

        if (!chapter) {
            setLessonName("Chapter not found");
            return;
        }
        const lesson = chapter.lessons[lessonIndex];

        if (!lesson) {
            setLessonName("Lesson not found");
            return;
        }
        setLessonName(lesson.title);
    };

    useEffect(() => {
        findCourseName();
        findChapterName();
        findLessonName();
    }, []);


    return (
        <div className="p-2 breadcrumbs text-sm flex flex-1">
            <ul>
                <li>
                    <a>
                        <IoMdCamera/>
                        {courseName}
                    </a>
                </li>
                <li>
                    <a>
                        <AiFillRead/>
                        {chapterName}
                    </a>
                </li>
                <li>
                  <span className="inline-flex items-center gap-2">
                    <IoNewspaperSharp/>
                      {lessonName}
                  </span>
                </li>
            </ul>
        </div>
    )
}