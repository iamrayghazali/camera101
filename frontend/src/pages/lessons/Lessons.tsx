import Navbar from "../../components/Navbar.tsx";
import iphoneIMG from "../../assets/cameras/iphone.webp"
import dslrIMG from "../../assets/cameras/dslr.jpg"
import mirrorlessIMG from "../../assets/cameras/mirrorless.jpeg"
import {Link} from "react-router-dom";
import { AiFillLock } from "react-icons/ai";
import {useAuth} from "../../hooks/UseAuth.tsx";
import Footer from "../../components/Footer.tsx";
import { AiFillCaretDown } from "react-icons/ai";

export default function Lessons() {
    const {isAuthenticated} = useAuth();

    return (
        <>
            <Navbar />
            <section className="mt-20 min-h-screen bg-black text-white flex flex-col justify-center items-center">
                <div className="mt-10 flex-none">
                    <h1 className="text-white text-4xl my-4 mx-4 font-rama">Choose a Camera Category</h1>
                    <p className="text-white text-lg mt-5 mb-20 mx-4">Buying </p>
                    <div className="flex flex-row justify-center items-center m-5 mb-10">
                        <a className="cursor-pointer flex flex-row justify-center items-center gap-1 rounded-md bg-white w-40 h-10 text-black font-bold" href="#curriculum"><AiFillCaretDown/>Go to Curriculum</a>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10 place-items-center sm:place-items-stretch">
                    {/*----IPHONE----*/}
                    <div className="card bg-base-100 w-70 shadow-sm">
                        <figure>
                            <img
                                src={iphoneIMG}
                                alt="iphone" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title text-xl">
                                iPhone Camera
                                {/*<div className="badge badge-secondary">FIRST LESSON FREE</div>*/}
                            </h2>
                            <p>From basics to expert, learn about the camera that is in your pocket to take better photos.</p>
                            { isAuthenticated ? (
                                <Link to="" className=""> {/*//TODO*/}
                                    <a className=" rounded-md bg-white py-2 px-4 text-black">Start Learning</a>
                                </Link>
                            ) : (
                                <div className="flex felx-col justify-around items-center mt-8">
                                    <Link to="" className=""> {}
                                        <a className="font-rama rounded-md bg-white py-1 px-4 font-bold text-black">Try For FREE</a>
                                    </Link>
                                    <Link to="" className=""> {}
                                        <a className="font-rama rounded-md bg-primary py-1 px-4 text-black">Buy Course</a>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    {/*----MIRRORLESS----*/}
                    <div className="card bg-base-100 w-70 shadow-sm">
                        <figure>
                            <img className="w-full object-cover object-center"
                                src={mirrorlessIMG}
                                alt="mirrorless IMG" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title text-xl">
                                iPhone Camera
                                {/*<div className="badge badge-secondary">NEW</div>*/}
                            </h2>
                            <p>From basics to expert, learn about the camera that is in your pocket to take better photos.</p>
                            { isAuthenticated ? (
                                <Link to="" className=""> {/*//TODO*/}
                                    <a className=" rounded-md bg-white py-2 px-4 text-black">Start Learning</a>
                                </Link>
                            ) : (
                                <div className="flex felx-col justify-around items-center mt-8">
                                    <Link to="" className=""> {}
                                        <a className=" rounded-md bg-primary py-2 px-4 text-black">Buy Course</a>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    {/*----DSLR----*/}
                    <div className="card bg-base-100 w-70 shadow-sm">
                        <figure>
                            <img className=" w-full object-cover object-center"
                                 src={dslrIMG}
                                 alt="dslr" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title text-xl">
                                iPhone Camera
                                {/*<div className="badge badge-secondary">NEW</div>*/}
                            </h2>
                            <p>From basics to expert, learn about the camera that is in your pocket to take better photos.</p>
                            { isAuthenticated ? (
                                <Link to="" className=""> {/*//TODO*/}
                                    <a className=" rounded-md bg-white py-2 px-4 text-black">Start Learning</a>
                                </Link>
                            ) : (
                                <div className="flex felx-col justify-around items-center mt-8">

                                    <Link to="" className=""> {}
                                        <a className=" rounded-md bg-primary py-2 px-4 text-black">Buy Course</a>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="divider"></div>


                {/*----curriculum----*/}
                <div id="curriculum" className="my-20 flex-none text-center">
                    <p className="text-white text-md my-5 font-rama">Look Through the Curriculum</p>
                    <ul className="menu bg-base-300 rounded-box w-80 top-0">
                        <li>
                            <summary>iPhone</summary>
                            <ul>
                                <li>
                                    <details>
                                        <summary>I. Introduction to Cameras</summary>
                                        <ul>
                                            <li><a>The iPhone Camera</a></li>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}iPhone vs. DSLR vs. Mirrorless</a></li>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Understanding Multiple Lenses</a></li>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Camera App Review</a></li>
                                        </ul>
                                    </details>
                                    <details>
                                        <summary>II. Shooting modes</summary>
                                        <ul>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Photo</a></li>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Portrait</a></li>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Video</a></li>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Night</a></li>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Panorama</a></li>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Homework</a></li>
                                        </ul>
                                    </details>
                                    <details>
                                        <summary>III. Composition and Framing</summary>
                                        <ul>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Rule of Thirds, Leading Lines</a></li>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Framing People and Objects</a></li>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Cropping and Alignment</a></li>
                                        </ul>
                                    </details>
                                    <details>
                                        <summary>IV. Exposure</summary>
                                        <ul>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}What is exposure</a></li>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Tap to Focus, Exposure Alignment</a></li>
                                            <li><a>{ isAuthenticated ? null : (<AiFillLock className="text-xs"/>)}Light and Shadows</a></li>
                                        </ul>
                                    </details>
                                </li>
                            </ul>
                        </li>
                    </ul>

                </div>
            </section>
            <Footer />
        </>
    )
}