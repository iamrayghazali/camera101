import iphoneIMG from "../assets/cameras/iphone.webp"
import dslrIMG from "../assets/cameras/dslr.jpg"
import mirrorlessIMG from "../assets/cameras/mirrorless.jpeg"
import { AiFillRightCircle } from "react-icons/ai";
import {Link} from "react-router-dom";

export default function LessonCategories(){
    return (
        <>
            <h1 className="text-5xl text-white font-extrabold mb-30 font-lato">OUR LESSONS</h1>
            <ul className="max-w-xs sm:max-w-sm md:max-w-xl list bg-base-100 rounded-box shadow-md">
                <li className="list-row">
                    <div className="row-span-2">
                        <img className="md:max-h-30 max-h-15 rounded-box" src={iphoneIMG} alt="IMG"/>
                    </div>
                    <div>
                        <div className=" md:text-lg">iPhone</div>
                        <div className="text-xs md:text-sm uppercase opacity-60">Camera Lessons</div>
                    </div>
                    <p className="list-col-wrap col-span-2 text-xs md:text-sm">
                        Master the camera that’s always in your pocket with simple tricks to take pro level shots using your iPhone.
                    </p>
                    <Link className="flex items-center justify-center text-3xl" to=""> {/*//TODO*/}
                        <AiFillRightCircle />
                    </Link>
                </li>

                <li className="list-row">
                    <div className="row-span-2">
                        <img className="md:max-h-30 max-h-10 rounded-box" src={dslrIMG}/>
                    </div>
                    <div>
                        <div className=" md:text-lg">DSLR</div>
                        <div className="text-xs md:text-sm uppercase opacity-60">Camera Lessons</div>
                    </div>
                    <p className="list-col-wrap col-span-2 text-xs md:text-sm">
                        Learn the power of classic DSLR cameras and take full control of your photography.
                    </p>
                    <Link className="flex items-center justify-center text-3xl" to=""> {/*//TODO*/}
                        <AiFillRightCircle />
                    </Link>
                </li>

                <li className="list-row">
                    <div className="row-span-2">
                        <img className="md:max-h-30 max-h-10 rounded-box" src={mirrorlessIMG}/>
                    </div>
                    <div>
                        <div className=" md:text-lg">Mirrorless</div>
                        <div className="text-xs  md:text-sm uppercase opacity-60">Camera Lessons</div>
                    </div>
                    <p className="list-col-wrap col-span-2 text-xs md:text-sm">
                        Discover the modern mirrorless camera that is lightweight, versatile, and built for sharp stunning images.
                    </p>
                    <Link className="flex items-center justify-center text-3xl" to=""> {/*//TODO*/}
                        <AiFillRightCircle />
                    </Link>
                </li>

            </ul>
        </>
    )
}