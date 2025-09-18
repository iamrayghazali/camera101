import Navbar from "../../components/Navbar.tsx";
import iphoneIMG from "../../assets/cameras/iphone.webp"
import dslrIMG from "../../assets/cameras/dslr.jpg"
import mirrorlessIMG from "../../assets/cameras/mirrorless.jpeg"
import {Link} from "react-router-dom";
import {useAuth} from "../../hooks/UseAuth.tsx";
import Footer from "../../components/Footer.tsx";
import Curriculum from "../../components/Curriculum.tsx";

export default function Lessons() {
    const {isAuthenticated} = useAuth();

    /*TODO finish button paths*/
    return (
        <>
            <div className="">
                <Navbar />
            <section className="mt-20 min-h-screen bg-black text-white flex flex-col justify-center items-center">

                <div className="mt-10 flex-none">
                    <h1 className="text-white text-3xl sm:text-4xl my-4 px-5 font-rama">Choose a Camera Category</h1>
                    <p className="text-white text-lg mt-5 px-5">Buying a course gets you all.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_3fr] gap-5 mb-10 lg:mt-15 place-items-stretch">
                    {/*----curriculum----*/}
                    <div id="curriculum" className="ml-3 mt-10 flex flex-col items-center text-center">
                        <p className="text-white text-md my-5 font-rama">Look Through the Curriculum</p>
                            <Curriculum watchForAuth={true}/>
                        </div>
                    <div className=" divider divider-horizontal w-0"></div>

                <div className="flex justify-center items-center">
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-2">
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
                                    <Link to="" className=" rounded-md bg-white py-2 px-4 text-black"> {/*//TODO*/}
                                        Start Learning
                                    </Link>
                                ) : (
                                    <div className="flex felx-col justify-around items-center mt-8">
                                        <Link to="/learn/iphone/" className="font-rama rounded-md bg-primary py-1 px-4 font-bold text-black"> {}
                                            Try For FREE
                                        </Link>
                                        <Link to=""  className="font-rama rounded-md bg-white py-1 px-4 text-black"> {}
                                            Buy Course
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
                                    Mirrorless Camera
                                </h2>
                                <p>Step by step, learn the modern mirrorless system and combine pro-level quality with cutting-edge tech.</p>
                                { isAuthenticated ? (
                                    <Link to="" className=" rounded-md bg-white py-2 px-4 text-black"> {/*//TODO*/}
                                        Start Learning
                                    </Link>
                                ) : (
                                    <div className="flex felx-col justify-around items-center mt-8">
                                        <Link to="" className="font-rama rounded-md bg-white py-1 px-4 font-bold text-black"> {}
                                            Buy Course
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
                                    DSLR
                                    {/*<div className="badge badge-secondary">NEW</div>*/}
                                </h2>
                                <p>From beginner to pro, master the classic DSLR to unlock full creative control over your photography.</p>
                                { isAuthenticated ? (
                                    <Link to="" className=" rounded-md bg-white py-2 px-4 text-black"> {/*//TODO*/}
                                        Start Learning
                                    </Link>
                                ) : (
                                    <div className="flex felx-col justify-around items-center mt-8">

                                        <Link to=""  className=" rounded-md bg-primary py-2 px-4 text-black"> {}
                                        Buy Course
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </section>
            <Footer />
            </div>

        </>
    )
}