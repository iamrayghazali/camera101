import { iPhoneCourse } from "../data/iPhoneCourse.tsx";
import {useAuth} from "../hooks/UseAuth.tsx";
import {AiFillLock} from "react-icons/ai";
import roman from "roman-numerals";
import {Link} from "react-router-dom";

type CurriculumProps = {
    watchForAuth: boolean,
}

export default function Curriculum({ watchForAuth }:CurriculumProps) {
    const {isAuthenticated} = useAuth();

    return (
        <>
            <ul className="flex-none menu bg-base-300 rounded-box w-80 top-0">
                <li>
                    <details>
                        <summary>iPhone</summary>
                        <ul>
                            <li>
                                {iPhoneCourse.chapters.map((chapter, i) => (
                                    <details key={chapter.id}>
                                        <summary>{roman.toRoman(i + 1)}. {chapter.title}</summary>
                                        <ul>
                                            {chapter.lessons.map((lesson, j) => {
                                                const isFirstLesson = i === 0 && j === 0;

                                                // Determine if the lesson is locked
                                                const isLocked = watchForAuth && !isAuthenticated && !isFirstLesson;

                                                // Classes for styling
                                                const classes = isLocked
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-white cursor-pointer";

                                                // Content for the lesson
                                                const content = isLocked
                                                    ? (<><AiFillLock className="text-xs" /> {lesson.title}</>)
                                                    : lesson.title;

                                                return (
                                                    <li key={lesson.id}>
                                                        {isLocked || watchForAuth ? (
                                                            // Normal summary for locked lessons
                                                            <summary className={classes}>{content}</summary>
                                                        ) : (
                                                            // Clickable Link for watchForAuth === false
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
                    </details>

                    <details>
                        <summary>DSLR</summary>
                        <ul>
                            <li>
                                <details>
                                    <summary>I. Introduction to DSLRs</summary>
                                    <ul  className={`${isAuthenticated ? "text-white" : "text-gray-400"}`}>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}The DSLR Camera</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}DSLR vs. Mirrorless vs. Phone</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Understanding Lenses (Prime vs. Zoom)</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Buttons & Modes Overview</a></li>
                                    </ul>
                                </details>
                                <details>
                                    <summary>II. Shooting Modes</summary>
                                    <ul  className={`${isAuthenticated ? "text-white" : "text-gray-400"}`}>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Auto, Program (P)</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Aperture Priority (A/Av)</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Shutter Priority (S/Tv)</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Manual (M)</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Scene Modes</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Homework</a></li>
                                    </ul>
                                </details>
                                <details>
                                    <summary>III. Composition and Framing</summary>
                                    <ul  className={`${isAuthenticated ? "text-white" : "text-gray-400"}`}>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Rule of Thirds, Leading Lines</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Framing Portraits, Landscapes</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Using Depth of Field Creatively</a></li>
                                    </ul>
                                </details>
                                <details>
                                    <summary>IV. Exposure Control</summary>
                                    <ul className={`${isAuthenticated ? "text-white" : "text-gray-400"}`}>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Exposure Triangle (ISO, Shutter, Aperture)</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Metering Modes</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Light and Shadows</a></li>
                                    </ul>
                                </details>
                                <details>
                                    <summary>V. Advanced Features</summary>
                                    <ul className={`${isAuthenticated ? "text-white" : "text-gray-400"}`}>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Autofocus Modes (Single, Continuous)</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Burst Shooting</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}RAW vs. JPEG</a></li>
                                    </ul>
                                </details>
                            </li>
                        </ul>
                    </details>
                    <details>
                        <summary>Mirrorless</summary>
                        <ul>
                            <li>
                                <details>
                                    <summary>I. Introduction to Mirrorless Cameras</summary>
                                    <ul className={`${isAuthenticated ? "text-white" : "text-gray-400"}`}>
                                        <li><a>The Mirrorless Camera</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Mirrorless vs. DSLR vs. Phone</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Electronic Viewfinder (EVF) vs. Optical</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Camera Body & Lens Mounts</a></li>
                                    </ul>
                                </details>
                                <details>
                                    <summary>II. Shooting Modes</summary>
                                    <ul className={`${isAuthenticated ? "text-white" : "text-gray-400"}`}>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Auto, Program (P)</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Aperture Priority (A/Av)</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Shutter Priority (S/Tv)</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Manual (M)</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Video Modes (4K, Log Profiles)</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Homework</a></li>
                                    </ul>
                                </details>
                                <details>
                                    <summary>III. Composition and Framing</summary>
                                    <ul className={`${isAuthenticated ? "text-white" : "text-gray-400"}`}>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Rule of Thirds, Symmetry</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Using EVF & LCD for Framing</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Depth of Field & Focus Peaking</a></li>
                                    </ul>
                                </details>
                                <details>
                                    <summary>IV. Exposure Control</summary>
                                    <ul className={`${isAuthenticated ? "text-white" : "text-gray-400"}`}>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Exposure Triangle (ISO, Shutter, Aperture)</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Live Histogram & Zebra Patterns</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Light and Shadows</a></li>
                                    </ul>
                                </details>
                                <details>
                                    <summary>V. Advanced Features</summary>
                                    <ul className={`${isAuthenticated ? "text-white" : "text-gray-400"}`}>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Autofocus Tracking & Eye AF</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Silent Shutter & Burst Modes</a></li>
                                        <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}RAW, HEIF, and Video Codecs</a></li>
                                    </ul>
                                </details>
                            </li>
                        </ul>
                    </details>
                </li>
            </ul>
        </>
    )
}